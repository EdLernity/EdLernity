const axios = require("axios");
const {
  buildSystemPrompt,
  describePath,
  formatEddyReply,
} = require("../utils/eddyPlatformKnowledge");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

function getGroqModel() {
  return process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({
      role: m.role,
      content: String(m.content).trim().slice(0, 2000),
    }))
    .filter((m) => m.content);
}

const chatWithEddy = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ message: "Eddy is not configured (missing GROQ_API_KEY)" });
    }

    const pathname = String(req.body?.pathname || "/").slice(0, 300);
    const pageTitle = String(req.body?.pageTitle || "").slice(0, 200);
    const messages = sanitizeMessages(req.body?.messages);
    const latestUser = String(req.body?.message || "").trim().slice(0, 2000);

    if (!latestUser && !messages.length) {
      return res.status(400).json({ message: "Message is required" });
    }

    const history = messages.length
      ? messages
      : [{ role: "user", content: latestUser }];

    if (latestUser && (!history.length || history[history.length - 1].content !== latestUser)) {
      history.push({ role: "user", content: latestUser });
    }

    const systemPrompt = buildSystemPrompt({ pathname, pageTitle });
    const pathContext = describePath(pathname);

    const { data } = await axios.post(
      GROQ_URL,
      {
        model: getGroqModel(),
        temperature: 0.65,
        max_tokens: 700,
        messages: [{ role: "system", content: systemPrompt }, ...history],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 45000,
      }
    );

    const reply = formatEddyReply(
      data?.choices?.[0]?.message?.content?.trim() ||
        "I had trouble answering that. Try again, or contact support at +91 8073306479."
    );

    res.status(200).json({
      reply,
      pathContext,
      model: getGroqModel(),
    });
  } catch (err) {
    const status = err.response?.status;
    const groqMessage = err.response?.data?.error?.message || err.message;
    console.error("Eddy chat error:", groqMessage);
    if (status === 429) {
      return res.status(429).json({ message: "Eddy is busy right now — try again in a moment." });
    }
    res.status(500).json({ message: "Eddy could not reply right now. Please try again." });
  }
};

module.exports = { chatWithEddy };
