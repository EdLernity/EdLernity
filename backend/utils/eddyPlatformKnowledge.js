const { getInternshipBySlug, listCatalogPrograms } = require("./internshipCatalog");

const SECTION_LABELS = {
  overview: "Overview — program summary and progress",
  schedule: "Schedule — class timings",
  classes: "Live Classes — join live sessions (attendance counted when joining during schedule)",
  assignments: "Assignments — weekly class quizzes/tasks",
  projects: "Projects — weekly project submissions (GitHub) reviewed by trainer",
  announcements: "Announcements — trainer/program updates",
  bonuses: "Bonuses — extra workshops and perks",
  completion: "Internship Completion — trainer marks complete; then manager issues certificate",
  certificate: "Certificate — view/download issued internship completion PDF",
};

const PLATFORM_FACTS = `
You are Eddy — a helpful AI assistant for EdLernity users. Talk like a normal LLM chatbot: conversational, curious, and clear. You are powered by Groq and also grounded in EdLernity facts below.

## How to think
- Mix general knowledge (career advice, tech concepts, learning tips, interview prep) with EdLernity product facts.
- When the user is vague, ASK a short clarifying question (interests, experience level, career goal) before dumping a long list.
- Prefer a short answer + 1 follow-up question over a wall of text.
- Do NOT say you are "sharing" a page or mention browser context chips. You may quietly use the current path to be more relevant.
- Never invent personal student data (grades, payments). Do not reveal secrets or admin credentials.

## Company facts (use when asked about EdLernity)
- Legal name: EdLernity Tech (OPC) Private Limited
- Brand: EdLernity
- Tagline: "Embarking on a journey with EdLernity — Where knowledge meets eternity."
- Founded: 2023 · HQ: Bengaluru, Karnataka, India
- Industry: E-Learning / Software · Size: about 51–200 employees
- Website: https://www.edlernity.com · Phone: +91 8073306479 · Email: info@edlernity.com
- Founder & CEO: Tayyaba Anwar Khan Girni
- ISO 9001:2015 certified · Accredited by Standards Council of Canada (SCC)
- Google reviews: about 4.284 (Software company in Bengaluru)

## EdLernity products
Career internships (/careers, /internship-programs):
- Business Development, Sales & Marketing, Lead Generation, Human Resources, Technical

Paid tech internships (12 weeks, /internship-programs):
- AI & Machine Learning, Full Stack with AI, Salesforce Cloud with AI, Python for Data Science & ML, Cloud Computing & DevOps

Also: courses at /courses/overview · certificate verify at /verify-certificate · student dashboard /my-internships/:slug/...

## Internship dashboard (when relevant)
Tabs: overview, schedule, classes, assignments, projects, announcements, bonuses, completion, certificate.
Live Join during schedule can record attendance. Trainer completes internship → manager issues PDF with from/to dates.

## Reply formatting
- Short paragraphs. Blank line between sections.
- Lists: each item on its own line with "- " (never "*").
- Keep under ~120 words unless the user asks for more depth.
- End with a question when it helps move the conversation forward.
`.trim();

function describePath(pathname = "/") {
  const path = String(pathname || "/").split("?")[0] || "/";
  const parts = path.split("/").filter(Boolean);

  if (parts[0] === "my-internships" && parts[1]) {
    const slug = parts[1];
    const section = parts[2] || "overview";
    const program = getInternshipBySlug(slug);
    const sectionHelp = SECTION_LABELS[section] || `Section: ${section}`;
    return {
      path,
      area: "student-internship-dashboard",
      slug,
      section,
      programTitle: program?.title || slug,
      programCategory: program?.category || "",
      programTrack: program?.track || "",
      summary: `Student is inside their enrolled internship dashboard for "${program?.title || slug}" on the ${section} tab. ${sectionHelp}.`,
    };
  }

  if (parts[0] === "internship-programs") {
    if (parts[1]) {
      const program = getInternshipBySlug(parts[1]);
      return {
        path,
        area: "internship-marketing",
        slug: parts[1],
        programTitle: program?.title || parts[1],
        summary: `Browsing internship program detail page for "${program?.title || parts[1]}". They can apply/enroll from here.`,
      };
    }
    return {
      path,
      area: "internship-marketing",
      summary:
        "On the Internship Programs listing page — paid tech tracks and career internship options with certification messaging.",
    };
  }

  if (parts[0] === "careers") {
    return {
      path,
      area: "careers",
      summary: "On Careers page — career internship tracks and applications.",
    };
  }

  if (parts[0] === "my-courses" || parts[0] === "courses") {
    return {
      path,
      area: "courses",
      summary: "Browsing courses / my courses area of the platform.",
    };
  }

  if (parts[0] === "verify-certificate") {
    return {
      path,
      area: "certificate-verify",
      summary: "On certificate verification page — enter certificate ID/UUID to verify authenticity.",
    };
  }

  if (parts[0] === "auth") {
    return {
      path,
      area: "auth",
      summary: "On authentication (login/signup) pages.",
    };
  }

  return {
    path,
    area: "general",
    summary: `On page ${path}. Help with EdLernity internships, courses, certificates, and navigation.`,
  };
}

/** Normalize model replies so lists render cleanly in the chat UI. */
function formatEddyReply(text) {
  let out = String(text || "").trim();
  if (!out) return out;

  const hasStructuredLines = /\n\s*[-*•]/.test(out) || /\n\n/.test(out);

  if (!hasStructuredLines) {
    // Unpack jammed one-liners: "We offer: * A * B"
    out = out.replace(/:\s*\*\s+/g, ":\n- ");
    out = out.replace(/\s+\*\s+/g, "\n- ");
  }

  out = out.replace(/^[•·*]\s+/gm, "- ");
  out = out.replace(/\s+(Career internships:)/gi, "\n\n$1");
  out = out.replace(/\s+(Paid tech internships:)/gi, "\n\n$1");
  // Drop empty bullet lines
  out = out.replace(/^\s*-\s*$/gm, "");
  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
}

function buildSystemPrompt({ pathname, pageTitle } = {}) {
  const ctx = describePath(pathname);
  const programs = listCatalogPrograms()
    .map((p) => `- ${p.title} (slug: ${p.slug}, track: ${p.track})`)
    .join("\n");

  return `${PLATFORM_FACTS}

## Catalog (slugs)
${programs}

## Quiet page hint (do not announce "sharing")
Path: ${ctx.path}
Area: ${ctx.area}
${ctx.summary}
${ctx.slug ? `Program slug: ${ctx.slug}` : ""}
${ctx.section ? `Section: ${ctx.section}` : ""}
Page title: ${pageTitle || "n/a"}

Reply as Eddy — mix EdLernity facts with useful general advice, ask questions when helpful, format cleanly.`;
}

module.exports = {
  describePath,
  buildSystemPrompt,
  formatEddyReply,
  PLATFORM_FACTS,
  SECTION_LABELS,
};
