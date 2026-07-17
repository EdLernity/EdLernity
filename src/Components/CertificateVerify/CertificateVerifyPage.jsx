import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  AlertCircle,
  CheckCircle2,
  Upload,
  BadgeCheck,
  Lock,
  Globe2,
  FileText,
  CalendarRange,
} from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";
import { BACKEND_URL } from "../../URL_Config";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const RECORD_LABELS = {
  "internship-completion": "Internship Certificate",
  "tech-internship": "Tech Internship Certificate",
  "course-completion": "Course Completion Certificate",
  "certificate-of-appreciation": "Certificate of Appreciation",
  appreciation: "Certificate of Appreciation",
  participation: "Certificate of Participation",
  "best-performer": "Best Performer Certificate",
};

export default function CertificateVerifyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("id");

  const runVerify = async (uuid) => {
    const cleaned = String(uuid || "").trim();
    if (!cleaned) {
      setError("Please enter a certificate ID.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/certificates/verify/${encodeURIComponent(cleaned)}`
      );
      const data = await response.json();
      if (!response.ok || !data.valid) {
        setError(data.message || "Certificate could not be verified.");
        setResult(data);
        return;
      }
      setResult(data);
      setSearchParams({ id: cleaned }, { replace: true });
    } catch {
      setError("Verification failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fromQuery = searchParams.get("id");
    if (fromQuery) {
      setCertificateId(fromQuery);
      runVerify(fromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIdVerify = (e) => {
    e.preventDefault();
    runVerify(certificateId);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("certificate", file);
      const response = await fetch(`${BACKEND_URL}/api/v1/certificates/verify/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.valid) {
        setError(data.message || "Certificate could not be verified.");
        setResult(data);
        return;
      }
      setResult(data);
      if (data.certificate?.uuid) {
        setCertificateId(data.certificate.uuid);
        setSearchParams({ id: data.certificate.uuid }, { replace: true });
      }
    } catch {
      setError("Upload failed. Please try again with the original PDF.");
    } finally {
      setUploading(false);
    }
  };

  const cert = result?.certificate;
  const typeLabel =
    cert?.templateLabel ||
    RECORD_LABELS[cert?.recordType] ||
    RECORD_LABELS[cert?.certificateType] ||
    cert?.recordType ||
    "EdLernity Certificate";
  const hasPeriod = Boolean(cert?.fromDate && cert?.toDate);

  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.verifyCertificate.title}
        description={PAGE_SEO.verifyCertificate.description}
        path={PAGE_SEO.verifyCertificate.path}
        keywords={PAGE_SEO.verifyCertificate.keywords}
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
            "radial-gradient(1200px 500px at 10% -10%, rgba(24,31,197,0.12), transparent 55%), radial-gradient(900px 420px at 90% 0%, rgba(14,165,233,0.10), transparent 50%), linear-gradient(180deg, #f4f7fb 0%, #ffffff 42%, #eef2f8 100%)",
        }}
      >
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-14 pb-10 sm:pt-20 sm:pb-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(24,31,197,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(24,31,197,0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "linear-gradient(180deg, black, transparent 85%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl text-center">
            <p
              className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#181FC5]"
              style={{ letterSpacing: "0.22em" }}
            >
              EdLernity Credential Registry
            </p>
            <h1
              className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-[3.25rem]"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Verify Certificate
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Confirm any EdLernity internship, workshop, or course credential worldwide using the
              certificate ID printed on the document — or upload the original PDF.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                { icon: Globe2, label: "Global lookup", text: "Works for every issued credential" },
                { icon: BadgeCheck, label: "Official records", text: "Matched against EdLernity registry" },
                { icon: Lock, label: "Tamper-aware", text: "Invalid or forged IDs are rejected" },
              ].map(({ icon: Icon, label, text }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-left shadow-sm backdrop-blur"
                >
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#181FC5]/10 text-[#181FC5]">
                    <Icon size={18} />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verify panel */}
        <section className="relative z-10 mx-auto max-w-3xl px-4 pb-20">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-28px_rgba(24,31,197,0.35)]">
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => setMode("id")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition ${
                  mode === "id"
                    ? "bg-[#181FC5] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Search size={16} />
                Certificate ID
              </button>
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition ${
                  mode === "upload"
                    ? "bg-[#181FC5] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Upload size={16} />
                Upload PDF
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {mode === "id" ? (
                <form onSubmit={handleIdVerify}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Certificate ID
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      placeholder="e.g. EDL-INT-2026-A7K9M2P4"
                      className="w-full flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-mono text-sm text-slate-900 outline-none ring-[#181FC5]/30 transition focus:border-[#181FC5] focus:bg-white focus:ring-4"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#181FC5] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1418a8] disabled:opacity-60 sm:min-w-[160px]"
                    >
                      <ShieldCheck size={18} />
                      {loading ? "Verifying…" : "Verify"}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Find the ID near the bottom of your certificate (CREDENTIAL ID / Certificate ID).
                  </p>
                </form>
              ) : (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Original PDF certificate
                  </label>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-[#181FC5]/40 hover:bg-indigo-50/40">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#181FC5]/10 text-[#181FC5]">
                      <FileText size={22} />
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {uploading ? "Reading PDF…" : "Drop or choose a PDF"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      We extract the certificate ID and check it against the registry.
                    </p>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      disabled={uploading}
                      onChange={handlePdfUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Result */}
          {(error || result) && (
            <div
              className={`mt-8 overflow-hidden rounded-3xl border ${
                result?.valid
                  ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
                  : "border-rose-200 bg-gradient-to-br from-rose-50 to-white"
              }`}
            >
              <div className="flex items-start gap-4 p-6 sm:p-8">
                <div
                  className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    result?.valid
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {result?.valid ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    className="text-xl font-bold text-slate-900"
                    style={{ fontFamily: "Fraunces, Georgia, serif" }}
                  >
                    {result?.valid ? "Certificate verified" : "Not verified"}
                  </h2>
                  <p
                    className={`mt-1 text-sm ${
                      result?.valid ? "text-emerald-800" : "text-rose-700"
                    }`}
                  >
                    {result?.message || error}
                  </p>

                  {result?.valid && cert && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <ResultField label="Recipient" value={cert.studentName} />
                      <ResultField label="Program / course" value={cert.programTitle} />
                      <ResultField label="Credential type" value={typeLabel} />
                      <ResultField
                        label={hasPeriod ? "Internship period" : "Issued on"}
                        value={
                          hasPeriod
                            ? `${formatDate(cert.fromDate)} → ${formatDate(cert.toDate)}`
                            : formatDate(cert.issuedAt)
                        }
                        icon={hasPeriod ? CalendarRange : null}
                      />
                      <div className="sm:col-span-2">
                        <ResultField label="Certificate ID" value={cert.uuid} mono />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="mt-10 text-center text-xs text-slate-500">
            Employers and institutions: treat this page as EdLernity’s official public verification
            channel. For questions, contact{" "}
            <a href="mailto:info@edlernity.com" className="font-semibold text-[#181FC5]">
              info@edlernity.com
            </a>
            .
          </p>
        </section>
      </div>
    </BaseLayout>
  );
}

function ResultField({ label, value, mono, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p
        className={`mt-1 text-sm font-semibold text-slate-900 ${mono ? "break-all font-mono" : ""}`}
      >
        {Icon ? (
          <span className="inline-flex items-center gap-1.5">
            <Icon size={14} className="text-[#181FC5]" />
            {value}
          </span>
        ) : (
          value || "—"
        )}
      </p>
    </div>
  );
}
