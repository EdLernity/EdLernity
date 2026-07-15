const axios = require("axios");

function makeQuestionId(index) {
  return `q-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeGeneratedQuestions(rawList, numMcq, numText) {
  const list = Array.isArray(rawList) ? rawList : [];
  const questions = [];

  for (const item of list) {
    if (!item || !item.prompt) continue;
    const type = item.type === "text" ? "text" : "mcq";
    if (type === "mcq") {
      const options = Array.isArray(item.options)
        ? item.options.map(String).slice(0, 4)
        : [];
      while (options.length < 4) options.push(`Option ${options.length + 1}`);
      let correct = Number(item.correctOptionIndex);
      if (!Number.isInteger(correct) || correct < 0 || correct > 3) correct = 0;
      questions.push({
        id: item.id || makeQuestionId(questions.length),
        type: "mcq",
        prompt: String(item.prompt).trim(),
        options,
        correctOptionIndex: correct,
      });
    } else {
      questions.push({
        id: item.id || makeQuestionId(questions.length),
        type: "text",
        prompt: String(item.prompt).trim(),
        options: [],
        correctOptionIndex: 0,
      });
    }
  }

  const mcqs = questions.filter((q) => q.type === "mcq").slice(0, numMcq);
  const texts = questions.filter((q) => q.type === "text").slice(0, numText);
  return [...mcqs, ...texts];
}

function extractJsonObject(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Hybrid generation via Gemini:
 * - Always uses program/week/class title + difficulty + focus
 * - Optionally uses pasted context text and/or an uploaded PDF
 */
async function generateAssignmentQuestions({
  programTitle,
  weekLabel,
  weekTopic,
  classTitle,
  scheduleDay,
  scheduleTime,
  numMcq = 3,
  numText = 0,
  difficulty = "medium",
  focus = "",
  contextText = "",
  pdfBuffer = null,
  pdfMimeType = "application/pdf",
} = {}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not configured on the server");
    err.status = 503;
    throw err;
  }

  const mcqCount = Math.min(10, Math.max(1, Number(numMcq) || 0));
  const textCount = 0;
  if (mcqCount < 1) {
    const err = new Error("Provide at least one MCQ question");
    err.status = 400;
    throw err;
  }

  // Probed against this project's API key (live generateContent):
  // works: gemini-3.1-flash-lite, gemini-flash-lite-latest, gemini-3-flash-preview
  // busy:  gemini-3.5-flash, gemini-flash-latest (503 high demand)
  // blocked for new users / quota: gemini-2.5-*, gemini-2.0-*
  const preferredModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const fallbackModels = [
    preferredModel,
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3-flash-preview",
    "gemini-3.5-flash",
    "gemini-flash-latest",
  ].filter((m, i, arr) => m && arr.indexOf(m) === i);

  const schedule = [scheduleDay, scheduleTime].filter(Boolean).join(" · ") || "TBA";
  const trimmedContext = String(contextText || "").trim().slice(0, 60000);

  const instruction = `You are an instructor creating internship homework questions.
Return ONLY valid JSON with this shape:
{"questions":[{"type":"mcq","prompt":"...","options":["A","B","C","D"],"correctOptionIndex":0}]}
Rules:
- Exactly ${mcqCount} items with type "mcq" and exactly 4 options each.
- Do not include text / short-answer questions.
- correctOptionIndex is 0-3 for MCQs.
- Difficulty: ${difficulty}.
- Prefer the uploaded session notes/PDF and pasted context when present.
- Otherwise base questions on the class title, week topic, and focus.
- Questions must be clear, relevant, and answerable from the provided material.`;

  const meta = [
    `Program: ${programTitle || "Internship"}`,
    `Week: ${weekLabel || ""} — ${weekTopic || "General topic"}`,
    `Class: ${classTitle || "Live class"}`,
    `Schedule: ${schedule}`,
    focus ? `Extra focus: ${focus}` : "",
    trimmedContext ? `Trainer context notes:\n${trimmedContext}` : "",
    `Generate exactly ${mcqCount} MCQ questions.`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const parts = [{ text: `${instruction}\n\n${meta}` }];

  if (pdfBuffer && Buffer.isBuffer(pdfBuffer) && pdfBuffer.length) {
    if (pdfBuffer.length > 12 * 1024 * 1024) {
      const err = new Error("PDF must be 12MB or smaller");
      err.status = 400;
      throw err;
    }
    parts.push({
      inline_data: {
        mime_type: pdfMimeType || "application/pdf",
        data: pdfBuffer.toString("base64"),
      },
    });
    parts.push({
      text: "Use the attached PDF as primary source material for the questions.",
    });
  }

  let content;
  let lastError = null;
  for (const model of fallbackModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${apiKey}`;
      const { data } = await axios.post(
        url,
        {
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        },
        { timeout: 90000 }
      );
      content =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
      if (content) break;
      lastError = new Error(`Empty response from ${model}`);
    } catch (e) {
      const msg =
        e.response?.data?.error?.message ||
        e.message ||
        "Gemini request failed";
      lastError = new Error(msg);
      const canRetryNextModel =
        e.response?.status === 429 ||
        e.response?.status === 503 ||
        e.response?.status === 404 ||
        /quota|rate.?limit|resource.?exhausted|high demand|try again later|no longer available|not found|not supported|unavailable to new users/i.test(
          msg
        );
      if (!canRetryNextModel) {
        lastError.status = e.response?.status === 400 ? 400 : 502;
        throw lastError;
      }
      // try next model on quota / deprecated / unavailable
    }
  }

  if (!content) {
    const err = lastError || new Error("Gemini request failed");
    err.status = err.status || 502;
    throw err;
  }

  const parsed = extractJsonObject(content);
  if (!parsed) {
    const err = new Error("AI returned invalid JSON");
    err.status = 502;
    throw err;
  }

  const questions = normalizeGeneratedQuestions(
    parsed.questions,
    mcqCount,
    textCount
  );

  if (!questions.length) {
    const err = new Error("AI did not return usable questions");
    err.status = 502;
    throw err;
  }

  return questions;
}

module.exports = {
  generateAssignmentQuestions,
  normalizeGeneratedQuestions,
};
