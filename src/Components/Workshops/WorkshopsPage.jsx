import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Database,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";

const workshops = [
  {
    id: "build-ai-agent-mcp",
    title: "Build Your Own AI Agent with MCP",
    tagline: "From prompts to production agents",
    description:
      "A hands-on workshop where you design, wire, and ship an AI agent using the Model Context Protocol (MCP) — tools, context, and real workflows you can reuse at work or in your portfolio.",
    duration: "1 day · Live",
    level: "Intermediate",
    format: "Live online + recordings",
    outcomes: [
      "Understand MCP architecture and why agents need tools",
      "Connect an LLM to MCP servers for files, APIs, and workflows",
      "Build a working personal or team AI agent end-to-end",
      "Ship a demo-ready project with clear next steps",
    ],
    topics: ["MCP servers & clients", "Tool calling", "Agent loops", "Safety & evals"],
    ctaHref: "/contact?subject=Workshop%3A%20Build%20Your%20Own%20AI%20Agent%20with%20MCP",
    featured: true,
    trending: true,
    icon: Bot,
    accent: "linear-gradient(145deg, #0b1040 0%, #181FC5 48%, #0ea5e9 120%)",
  },
  {
    id: "genai-prompt-engineering",
    title: "GenAI & Prompt Engineering Masterclass",
    tagline: "Write prompts that actually ship features",
    description:
      "Learn practical prompt patterns for LLMs — system prompts, few-shot, chain-of-thought, and evaluation — then apply them to real product and internship use cases.",
    duration: "Half day · Live",
    level: "Beginner+",
    format: "Live online + recordings",
    outcomes: [
      "Design reliable system and user prompts",
      "Use structured outputs for apps and workflows",
      "Debug weak prompts with simple eval checks",
      "Build a reusable prompt playbook for your team",
    ],
    topics: ["Prompt patterns", "Structured output", "RAG basics", "Eval loops"],
    ctaHref: "/contact?subject=Workshop%3A%20GenAI%20%26%20Prompt%20Engineering",
    trending: true,
    icon: MessageSquareText,
    accent: "linear-gradient(145deg, #1e1b4b 0%, #4338ca 50%, #a855f7 120%)",
  },
  {
    id: "rag-apps",
    title: "Build RAG Apps with Your Own Data",
    tagline: "Chatbots that answer from your docs",
    description:
      "Go beyond chat demos. Index documents, retrieve the right chunks, and build a grounded Q&A assistant you can demo to employers or clients.",
    duration: "1 day · Live",
    level: "Intermediate",
    format: "Live online + recordings",
    outcomes: [
      "Chunk and embed documents the right way",
      "Wire retrieval + generation into a working app",
      "Reduce hallucinations with grounding and citations",
      "Ship a portfolio-ready RAG mini-project",
    ],
    topics: ["Embeddings", "Vector search", "Citations", "Chunking"],
    ctaHref: "/contact?subject=Workshop%3A%20Build%20RAG%20Apps",
    trending: true,
    icon: Database,
    accent: "linear-gradient(145deg, #042f2e 0%, #0f766e 50%, #2dd4bf 120%)",
  },
  {
    id: "ai-automation-n8n",
    title: "AI Automation with n8n & APIs",
    tagline: "Automate busywork with AI workflows",
    description:
      "Connect LLMs to email, sheets, Slack, and webhooks. Build no-code / low-code automations that save hours every week for sales, ops, and student teams.",
    duration: "Half day · Live",
    level: "Beginner+",
    format: "Live online + recordings",
    outcomes: [
      "Map a process into an automation workflow",
      "Call LLM APIs from n8n safely",
      "Handle errors, retries, and human-in-the-loop steps",
      "Deploy one live automation by end of session",
    ],
    topics: ["n8n", "Webhooks", "LLM APIs", "Ops workflows"],
    ctaHref: "/contact?subject=Workshop%3A%20AI%20Automation%20with%20n8n",
    trending: true,
    icon: Workflow,
    accent: "linear-gradient(145deg, #431407 0%, #c2410c 50%, #fb923c 120%)",
  },
  {
    id: "fullstack-ai-apps",
    title: "Ship Full-Stack AI Apps Faster",
    tagline: "Frontend + API + LLM in one weekend skillset",
    description:
      "Wire a modern web app to an LLM backend: auth-ready UI, streaming responses, rate limits, and a clean architecture you can reuse across projects.",
    duration: "1 day · Live",
    level: "Intermediate",
    format: "Live online + recordings",
    outcomes: [
      "Stream LLM responses in a React UI",
      "Secure API keys and usage limits",
      "Design a simple AI feature architecture",
      "Publish a deployable demo",
    ],
    topics: ["React", "Streaming", "API design", "Deploy"],
    ctaHref: "/contact?subject=Workshop%3A%20Full-Stack%20AI%20Apps",
    trending: true,
    icon: Code2,
    accent: "linear-gradient(145deg, #083344 0%, #0369a1 50%, #38bdf8 120%)",
  },
  {
    id: "agentic-workflows",
    title: "Agentic Workflows for Business Teams",
    tagline: "Multi-step agents for real office work",
    description:
      "Design agents that research, draft, and hand off work — research assistants, lead qualifiers, and content pipelines built for non-tech and tech teams alike.",
    duration: "Half day · Live",
    level: "All levels",
    format: "Live online + recordings",
    outcomes: [
      "Break a business task into agent steps",
      "Add tools and memory without overbuilding",
      "Review outputs with human approval gates",
      "Prototype one agent workflow for your role",
    ],
    topics: ["Multi-step agents", "Handoffs", "Memory", "Use cases"],
    ctaHref: "/contact?subject=Workshop%3A%20Agentic%20Workflows",
    trending: true,
    icon: Brain,
    accent: "linear-gradient(145deg, #312e81 0%, #4f46e5 50%, #818cf8 120%)",
  },
];

export default function WorkshopsPage() {
  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.workshops.title}
        description={PAGE_SEO.workshops.description}
        path={PAGE_SEO.workshops.path}
        keywords={PAGE_SEO.workshops.keywords}
      />

      <div className="min-h-screen font-sans bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#ECEFFE] via-[#F4F6FF] to-white pt-10 pb-14 lg:pt-16 lg:pb-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#181FC5]/5 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#181FC5]" />
              EdLernity Workshops
            </div>

            <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
              Learn by building —{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#181FC5] to-[#4F46E5]">
                live workshops
              </span>{" "}
              for modern AI skills
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-medium mb-4 max-w-3xl">
              Trending, mentor-led sessions you can apply the same week
            </p>
            <p className="text-base text-slate-500 max-w-3xl leading-relaxed">
              Agents, RAG, automation, and full-stack AI — with more cohorts opening soon. Same
              EdLernity learning experience as our internship programs.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                <TrendingUp size={22} className="text-[#181FC5]" />
                Trending workshops
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {workshops.length} workshops listed
              </p>
            </div>
          </div>

          <div className="space-y-6 w-full">
            {workshops.map((workshop) => {
              const Icon = workshop.icon || Bot;
              return (
                <article
                  key={workshop.id}
                  className="w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid lg:grid-cols-12">
                    <div className="relative lg:col-span-4">
                      <div
                        className="flex h-full min-h-[220px] flex-col justify-between p-6 text-white sm:p-8"
                        style={{ background: workshop.accent }}
                      >
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {workshop.featured ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                                <Sparkles size={12} />
                                Featured
                              </span>
                            ) : null}
                            {workshop.trending ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                                <TrendingUp size={12} />
                                Trending
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                            <Icon size={28} />
                          </div>
                          <p className="mt-4 text-sm font-medium text-white/80">{workshop.tagline}</p>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-white/90">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-black/20 px-2.5 py-1">
                            <Clock size={12} />
                            {workshop.duration}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-black/20 px-2.5 py-1">
                            <Users size={12} />
                            {workshop.level}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-black/20 px-2.5 py-1">
                            <Calendar size={12} />
                            {workshop.format}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-8 p-6 sm:p-8">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                        {workshop.title}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                        {workshop.description}
                      </p>

                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            What you’ll walk away with
                          </p>
                          <ul className="space-y-2">
                            {workshop.outcomes.map((item) => (
                              <li
                                key={item}
                                className="flex gap-2 text-sm font-semibold text-slate-700"
                              >
                                <CheckCircle2
                                  size={16}
                                  className="mt-0.5 shrink-0 text-emerald-500"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Topics covered
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {workshop.topics.map((topic) => (
                              <span
                                key={topic}
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                              >
                                <Wrench size={11} className="text-[#181FC5]" />
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                          to={workshop.ctaHref}
                          className="inline-flex items-center gap-2 rounded-full bg-[#181FC5] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#1418a0] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          Register interest
                          <ArrowRight size={16} />
                        </Link>
                        <Link
                          to="/internship-programs"
                          className="inline-flex items-center gap-2 rounded-full border border-[#181FC5]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#181FC5] hover:bg-[#f0f1ff] transition-all"
                        >
                          Explore internships
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </BaseLayout>
  );
}
