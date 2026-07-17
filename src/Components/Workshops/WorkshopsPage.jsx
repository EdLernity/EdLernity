import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";

const workshops = [
  {
    id: "build-ai-agent-mcp",
    slug: "build-your-own-ai-agent-with-mcp",
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
    ctaLabel: "Register interest",
    ctaHref: "/contact?subject=Workshop%3A%20Build%20Your%20Own%20AI%20Agent%20with%20MCP",
    featured: true,
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

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap"
      />

      <div
        className="min-h-screen"
        style={{
          fontFamily: "Manrope, sans-serif",
          background:
            "radial-gradient(1100px 480px at 85% -5%, rgba(24,31,197,0.14), transparent 55%), radial-gradient(800px 400px at 0% 20%, rgba(6,182,212,0.10), transparent 45%), linear-gradient(180deg, #f3f6fb 0%, #ffffff 40%, #eef3f9 100%)",
        }}
      >
        <section className="relative overflow-hidden px-4 pt-14 pb-8 sm:pt-20 sm:pb-12">
          <div className="relative mx-auto max-w-5xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#181FC5]">
              EdLernity Workshops
            </p>
            <h1
              className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Learn by building — live workshops for modern AI skills
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Focused, mentor-led sessions you can apply the same week. Start with our flagship MCP
              agent workshop, with more sessions rolling out soon.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                Upcoming & featured
              </h2>
              <p className="mt-1 text-sm text-slate-500">{workshops.length} workshop listed</p>
            </div>
          </div>

          <div className="space-y-6">
            {workshops.map((workshop) => (
              <article
                key={workshop.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(24,31,197,0.4)]"
              >
                <div className="grid lg:grid-cols-12">
                  <div className="relative lg:col-span-4">
                    <div
                      className="flex h-full min-h-[220px] flex-col justify-between p-6 text-white sm:p-8"
                      style={{
                        background:
                          "linear-gradient(145deg, #0b1040 0%, #181FC5 48%, #0ea5e9 120%)",
                      }}
                    >
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                          <Sparkles size={12} />
                          Featured workshop
                        </span>
                        <div className="mt-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                          <Bot size={28} />
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
                    <h3
                      className="text-2xl font-bold text-slate-900 sm:text-[1.75rem]"
                      style={{ fontFamily: "Fraunces, Georgia, serif" }}
                    >
                      {workshop.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {workshop.description}
                    </p>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                          What you’ll walk away with
                        </p>
                        <ul className="space-y-2">
                          {workshop.outcomes.map((item) => (
                            <li key={item} className="flex gap-2 text-sm text-slate-700">
                              <CheckCircle2
                                size={16}
                                className="mt-0.5 shrink-0 text-emerald-600"
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
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
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
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#181FC5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1418a8]"
                      >
                        {workshop.ctaLabel}
                        <ArrowRight size={16} />
                      </Link>
                      <Link
                        to="/internship-programs"
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#181FC5]/30 hover:text-[#181FC5]"
                      >
                        Explore internships
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </BaseLayout>
  );
}
