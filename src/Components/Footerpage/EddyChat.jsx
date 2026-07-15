import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, Loader2, Sparkles, HelpCircle, Lightbulb, PanelRightClose } from "lucide-react";
import { axiosInstanceWithoutToken } from "../../Utils/AxiosInstance";

function renderInline(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function EddyMessageBody({ content, isUser }) {
  const lines = String(content || "").split("\n");
  const blocks = [];
  let list = [];

  const flushList = () => {
    if (!list.length) return;
    blocks.push({ type: "ul", items: list });
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-•*]\s+(.+)$/);
    if (bullet) {
      list.push(bullet[1]);
      continue;
    }
    flushList();
    if (line.trim() === "") blocks.push({ type: "gap" });
    else blocks.push({ type: "p", text: line.trim() });
  }
  flushList();

  return (
    <div
      className={`space-y-1.5 text-[15px] leading-relaxed ${
        isUser ? "text-white" : "text-white/90"
      }`}
    >
      {blocks.map((block, i) => {
        if (block.type === "gap") return <div key={i} className="h-1.5" />;
        if (block.type === "ul") {
          return (
            <ul key={i} className="my-1 list-disc space-y-1 pl-5">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="m-0">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function EddyFab({ onClick }) {
  const [showHi, setShowHi] = useState(true);

  useEffect(() => {
    // Show "Hi" bubble on load, then every ~12s for a short wave
    const hide = setTimeout(() => setShowHi(false), 4500);
    const loop = setInterval(() => {
      setShowHi(true);
      setTimeout(() => setShowHi(false), 3500);
    }, 12000);
    return () => {
      clearTimeout(hide);
      clearInterval(loop);
    };
  }, []);

  return (
    <div className="fixed bottom-28 right-5 z-[999] sm:bottom-32 sm:right-8">
      <style>{`
        @keyframes eddyBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(-4deg); }
          50% { transform: translateY(-2px) rotate(3deg); }
          75% { transform: translateY(-8px) rotate(-2deg); }
        }
        @keyframes eddyHiPop {
          0% { opacity: 0; transform: translateY(8px) scale(0.85); }
          15% { opacity: 1; transform: translateY(0) scale(1.05); }
          30% { transform: translateY(0) scale(1); }
          80% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-4px) scale(0.95); }
        }
        @keyframes eddyWave {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(14deg); }
          40% { transform: rotate(-8deg); }
          60% { transform: rotate(12deg); }
          80% { transform: rotate(-4deg); }
        }
        @keyframes eddyPulseRing {
          0% { transform: scale(1); opacity: 0.55; }
          70% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .eddy-fab-bob { animation: eddyBob 2.4s ease-in-out infinite; }
        .eddy-fab-hi { animation: eddyHiPop 3.5s ease-out forwards; }
        .eddy-fab-wave { display: inline-block; animation: eddyWave 1s ease-in-out 2; transform-origin: 70% 70%; }
        .eddy-fab-ring { animation: eddyPulseRing 2.2s ease-out infinite; }
      `}</style>

      {showHi && (
        <div
          className="eddy-fab-hi pointer-events-none absolute -top-12 right-0 whitespace-nowrap rounded-2xl rounded-br-sm bg-[#181FC5] px-3 py-1.5 text-sm font-semibold text-white shadow-lg"
          aria-hidden
        >
          Hi <span className="eddy-fab-wave">👋</span>
        </div>
      )}

      <button
        type="button"
        id="eddy-chat-widget"
        onClick={onClick}
        aria-label="Open Eddy AI assistant — say hi"
        className="eddy-fab-bob relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl ring-2 ring-[#181FC5]/25 transition hover:scale-105 hover:ring-[#181FC5]/50 focus:outline-none focus:ring-4 focus:ring-[#181FC5]/30"
      >
        <span
          className="eddy-fab-ring pointer-events-none absolute inset-0 rounded-full ring-2 ring-[#181FC5]/40"
          aria-hidden
        />
        <img
          src="/Image/eddy-face.png"
          alt="Eddy"
          className="relative h-14 w-14 rounded-full object-cover"
        />
        <span className="absolute -bottom-1 rounded-full bg-[#181FC5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
          Eddy
        </span>
      </button>
    </div>
  );
}

const QUICK_PROMPTS = [
  { icon: Sparkles, label: "What can you do?", prompt: "What can you help me with on EdLernity?" },
  {
    icon: HelpCircle,
    label: "Which internship fits me?",
    prompt: "Which internship should I choose based on my interests?",
  },
  {
    icon: Lightbulb,
    label: "Help with this page",
    prompt: "What should I do on this page?",
  },
];

function EddySidebar({ onClose }) {
  const location = useLocation();
  const pathname = location.pathname || "/";
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  const started = messages.length > 0;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, sending]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const send = async (rawText) => {
    const text = String(rawText || "").trim();
    if (!text || sending) return;
    setInput("");
    setError("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setSending(true);
    try {
      const { data } = await axiosInstanceWithoutToken.post("/api/v1/eddy/chat", {
        message: text,
        messages: next,
        pathname,
        pageTitle: typeof document !== "undefined" ? document.title : "",
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I couldn't answer that." },
      ]);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Eddy couldn't reply. Check that the backend is running.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Hmm, I hit a snag. Try again in a second, or call us at +91 8073306479.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close Eddy sidebar"
        className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Eddy AI assistant"
        className="fixed inset-y-0 right-0 z-[1001] flex w-full max-w-[420px] flex-col bg-[#0f1117] text-white shadow-2xl sm:border-l sm:border-white/10"
        style={{
          animation: "eddySidebarIn 0.22s ease-out",
        }}
      >
        <style>{`
          @keyframes eddySidebarIn {
            from { transform: translateX(100%); opacity: 0.85; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/Image/eddy-face.png"
              alt=""
              className="h-9 w-9 rounded-full bg-white object-cover ring-2 ring-white/15"
            />
            <div>
              <p className="text-sm font-semibold leading-tight">Eddy</p>
              <p className="text-[11px] text-white/55">EdLernity AI assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              title="Close Eddy"
              aria-label="Close Eddy"
            >
              <PanelRightClose className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-5 pb-4">
          {!started ? (
            <div className="flex min-h-full flex-col justify-center py-8">
              <h2 className="bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-3xl font-semibold text-transparent">
                Hello
              </h2>
              <p className="mt-2 text-2xl font-medium text-white/90">How can I help you today?</p>
              <p className="mt-3 text-sm text-white/50">
                Ask me about EdLernity, careers, tech learning, or anything else.
              </p>

              <div className="mt-8 flex flex-col gap-2.5">
                {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => send(prompt)}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/[0.08]"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-sky-300" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <img
                      src="/Image/eddy-face.png"
                      alt=""
                      className="mr-2 mt-1 h-7 w-7 shrink-0 rounded-full bg-white object-cover"
                    />
                  )}
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 ${
                      m.role === "user"
                        ? "rounded-br-md bg-[#181FC5]"
                        : "rounded-bl-md bg-white/[0.06] ring-1 ring-white/10"
                    }`}
                  >
                    <EddyMessageBody
                      content={m.content}
                      isUser={m.role === "user"}
                    />
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 pl-9 text-xs text-white/50">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Eddy is typing…
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="mx-4 mb-2 rounded-lg bg-amber-500/15 px-3 py-2 text-xs text-amber-200">
            {error}
          </p>
        )}

        {/* Composer */}
        <form
          className="border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 focus-within:border-sky-400/40">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask Eddy anything…"
              className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder:text-white/40 outline-none"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="mb-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#181FC5] text-white disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

export default function EddyChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && <EddyFab onClick={() => setOpen(true)} />}
      {open && <EddySidebar onClose={() => setOpen(false)} />}
    </>
  );
}
