import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Linkedin,
  Loader2,
  PartyPopper,
  Share2,
  ShieldCheck,
  User,
} from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { SITE_URL } from "../../Utils/seoConfig";
import { BACKEND_URL } from "../../URL_Config";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const RECORD_LABELS = {
  "internship-completion": "Internship Completion Certificate",
  "tech-internship": "Tech Internship Certificate",
  "course-completion": "Course Completion Certificate",
  "certificate-of-appreciation": "Certificate of Appreciation",
  appreciation: "Certificate of Appreciation",
  participation: "Certificate of Participation",
  "best-performer": "Best Performer Certificate",
};

function buildLinkedInAddUrl({ name, certId, certUrl, issuedAt, organization = "EdLernity" }) {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: name || "EdLernity Certificate",
    organizationName: organization,
    certUrl: certUrl || "",
    certId: certId || "",
  });
  if (issuedAt) {
    const d = new Date(issuedAt);
    if (!Number.isNaN(d.getTime())) {
      params.set("issueYear", String(d.getFullYear()));
      params.set("issueMonth", String(d.getMonth() + 1));
    }
  }
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

export default function CredentialSharePage() {
  const { uuid: rawUuid } = useParams();
  const uuid = decodeURIComponent(rawUuid || "").trim();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [copied, setCopied] = useState(false);
  const [verifiedPanelOpen, setVerifiedPanelOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [pdfPages, setPdfPages] = useState([]);

  const credentialUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/credential/${encodeURIComponent(uuid)}`;
    }
    return `${SITE_URL}/credential/${encodeURIComponent(uuid)}`;
  }, [uuid]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!uuid) {
        setError("Missing certificate ID.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/certificates/verify/${encodeURIComponent(uuid)}`
        );
        const data = await response.json();
        if (cancelled) return;
        if (!response.ok || !data.valid || !data.certificate) {
          setError(data.message || "This credential could not be found.");
          setCertificate(null);
          return;
        }
        setCertificate(data.certificate);
      } catch {
        if (!cancelled) setError("Failed to load credential. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [uuid]);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    async function loadPdfJs() {
      if (window.pdfjsLib) return window.pdfjsLib;
      await new Promise((resolve, reject) => {
        const existing = document.querySelector("script[data-pdfjs]");
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", reject);
          if (window.pdfjsLib) resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
        script.type = "module";
        script.dataset.pdfjs = "1";
        script.onload = () => resolve();
        script.onerror = reject;
        // Prefer classic build that sets window.pdfjsLib
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.type = "text/javascript";
        document.head.appendChild(script);
      });
      if (!window.pdfjsLib) throw new Error("pdf.js failed to load");
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      return window.pdfjsLib;
    }

    async function loadPdf(id) {
      setPdfLoading(true);
      setPdfError("");
      setPdfPages([]);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/certificates/${encodeURIComponent(id)}/pdf`
        );
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Could not load certificate PDF");
        }
        const blob = await response.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(
          blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" })
        );
        setPdfUrl(objectUrl);

        try {
          const pdfjsLib = await loadPdfJs();
          const data = await blob.arrayBuffer();
          const doc = await pdfjsLib.getDocument({ data }).promise;
          const rendered = [];
          for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
            const page = await doc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.75 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) continue;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext: context, viewport }).promise;
            rendered.push(canvas.toDataURL("image/png"));
          }
          if (!cancelled) setPdfPages(rendered);
        } catch {
          // iframe fallback below
        }
      } catch (err) {
        if (!cancelled) setPdfError(err.message || "Failed to render certificate");
      } finally {
        if (!cancelled) setPdfLoading(false);
      }
    }

    if (certificate?.uuid) loadPdf(certificate.uuid);

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [certificate?.uuid]);

  const title =
    certificate?.templateLabel ||
    RECORD_LABELS[certificate?.recordType] ||
    RECORD_LABELS[certificate?.certificateType] ||
    "EdLernity Certificate";

  const issuedLabel = formatDate(certificate?.issuedAt);
  const hasPeriod = Boolean(certificate?.fromDate && certificate?.toDate);

  const linkedInUrl = buildLinkedInAddUrl({
    name: title,
    certId: certificate?.uuid || uuid,
    certUrl: credentialUrl,
    issuedAt: certificate?.issuedAt,
  });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(credentialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const downloadPdf = async () => {
    if (!certificate?.uuid && !uuid) return;
    const id = certificate?.uuid || uuid;
    setDownloading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/certificates/${encodeURIComponent(id)}/pdf`
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Download failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${String(certificate?.studentName || "EdLernity").replace(
        /\s+/g,
        "_"
      )}_Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      window.alert(err.message || "Failed to download certificate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} — ${certificate?.studentName || "EdLernity"}`,
          text: `View my EdLernity credential: ${title}`,
          url: credentialUrl,
        });
      } catch {
        /* cancelled */
      }
    } else {
      copyLink();
    }
  };

  const seoTitle = certificate
    ? `${certificate.studentName} | ${title} | EdLernity`
    : "EdLernity Credential";

  return (
    <BaseLayout>
      <SeoHead
        title={seoTitle}
        description={
          certificate
            ? `${certificate.studentName} earned ${title} from EdLernity. Verify this credential online.`
            : "View and verify an EdLernity digital credential."
        }
        path={`/credential/${encodeURIComponent(uuid)}`}
        keywords="EdLernity credential, verify certificate, digital certificate, LinkedIn certificate"
      />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
      />

      <div
        className="min-h-screen w-full font-sans"
        style={{
          background:
            "radial-gradient(900px 380px at 0% 0%, rgba(24,31,197,0.12), transparent 50%), radial-gradient(700px 320px at 100% 10%, rgba(14,165,233,0.10), transparent 45%), #f4f6fb",
        }}
      >
        <div className="w-full px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Loader2 className="animate-spin text-[#181FC5]" size={36} />
              <p className="mt-4 text-sm font-medium">Loading credential…</p>
            </div>
          ) : error || !certificate ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
              <ShieldCheck className="mx-auto text-rose-500" size={40} />
              <h1 className="mt-4 text-2xl font-extrabold text-slate-900 font-sans">
                Credential not found
              </h1>
              <p className="mt-2 text-sm text-rose-700">{error}</p>
              <Link
                to="/verify-certificate"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#181FC5] px-5 py-3 text-sm font-bold text-white"
              >
                Verify another certificate
              </Link>
            </div>
          ) : (
            <div className="w-full space-y-5">
              {/* Top bar */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-white sm:px-5"
                style={{
                  background: "linear-gradient(120deg, #0b1040 0%, #181FC5 55%, #2563eb 100%)",
                }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white/95">
                  <Award size={18} />
                  {title}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={downloadPdf}
                    disabled={downloading}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur hover:bg-white/25 disabled:opacity-60"
                  >
                    <Download size={12} />
                    {downloading ? "Downloading…" : "Download"}
                  </button>
                  <button
                    type="button"
                    onClick={shareNative}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur hover:bg-white/25"
                  >
                    <Share2 size={12} />
                    Share
                  </button>
                </div>
              </div>

              {/* Main: real certificate PDF + details */}
              <div className="grid w-full gap-5 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                    <div className="border-b border-slate-200 bg-white px-4 py-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Certificate preview
                      </p>
                    </div>

                    <div className="relative w-full bg-slate-200/60">
                      {pdfLoading ? (
                        <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-slate-500">
                          <Loader2 className="animate-spin text-[#181FC5]" size={32} />
                          <p className="text-sm font-semibold">Rendering certificate…</p>
                        </div>
                      ) : pdfError ? (
                        <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center">
                          <p className="text-sm font-semibold text-rose-600">{pdfError}</p>
                          <button
                            type="button"
                            onClick={downloadPdf}
                            className="rounded-xl bg-[#181FC5] px-4 py-2 text-sm font-bold text-white"
                          >
                            Download instead
                          </button>
                        </div>
                      ) : pdfPages.length > 0 ? (
                        <div className="w-full space-y-3 p-2 sm:p-3">
                          {pdfPages.map((src, idx) => (
                            <img
                              key={idx}
                              src={src}
                              alt={`Certificate page ${idx + 1}`}
                              className="block w-full rounded-xl bg-white shadow-md"
                            />
                          ))}
                        </div>
                      ) : pdfUrl ? (
                        <iframe
                          title="EdLernity certificate"
                          src={`${pdfUrl}#toolbar=0&navpanes=0`}
                          className="block h-[min(70vh,720px)] w-full border-0 bg-white"
                        />
                      ) : (
                        <div className="flex min-h-[280px] items-center justify-center text-sm font-semibold text-slate-500">
                          Certificate will appear here
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details column */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#181FC5]">
                      Digital credential
                    </p>
                    <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                      {title}
                    </h1>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      <MetaBlock
                        icon={Building2}
                        label="Credential issuer"
                        value="EdLernity"
                        hint="Organization"
                      />
                      <MetaBlock
                        icon={User}
                        label="Receiver"
                        value={certificate.studentName}
                        hint="Individual"
                      />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Program / course
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {certificate.programTitle || "—"}
                      </p>
                      {hasPeriod ? (
                        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                          <span>Period:</span>
                          <span className="font-semibold text-slate-700">
                            {formatShortDate(certificate.fromDate)}
                          </span>
                          <ArrowRight size={12} className="shrink-0 text-[#181FC5]" aria-hidden />
                          <span className="font-semibold text-slate-700">
                            {formatShortDate(certificate.toDate)}
                          </span>
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-slate-500">Issued on {issuedLabel}</p>
                      )}
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Credential link
                      </p>
                      <div className="mt-2 flex gap-2">
                        <input
                          readOnly
                          value={credentialUrl}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-[11px] text-slate-700"
                        />
                        <button
                          type="button"
                          onClick={copyLink}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#181FC5] px-3 py-2 text-xs font-bold text-white"
                        >
                          <Copy size={14} />
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href={linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#0A66C2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#084d93]"
                      >
                        <Linkedin size={18} />
                        Build your LinkedIn profile
                      </a>
                      <Link
                        to={`/verify-certificate?id=${encodeURIComponent(certificate.uuid)}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-[#181FC5]/30 hover:text-[#181FC5]"
                      >
                        <ShieldCheck size={16} />
                        Open verify page
                      </Link>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                      <a
                        href="https://edlernity.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#181FC5]"
                      >
                        edlernity.com
                        <ExternalLink size={14} />
                      </a>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-slate-700">Issued {issuedLabel}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        <BadgeCheck size={14} />
                        Active, not expired
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Congratulation */}
              <div className="relative overflow-hidden rounded-3xl border border-[#181FC5]/15 bg-white shadow-sm">
                <div
                  className="absolute inset-y-0 left-0 w-1.5"
                  style={{ background: "linear-gradient(180deg, #181FC5, #22d3ee, #f97316)" }}
                />
                <div className="p-5 sm:p-7 pl-6 sm:pl-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#181FC5]/10 text-[#181FC5]">
                      <PartyPopper size={20} />
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
                      Congratulations, {certificate.studentName}!
                    </h2>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#181FC5]">
                    Share your success on social media
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                    <p>
                      We are thrilled to congratulate you on completing your training with EdLernity
                      and earning the <strong>{title}</strong>
                      {certificate.programTitle ? (
                        <>
                          {" "}
                          for <strong>{certificate.programTitle}</strong>
                        </>
                      ) : null}
                      . This achievement is a testament to your dedication, perseverance, and
                      commitment to personal and professional growth.
                    </p>
                    <p>
                      Your successful completion reflects the time and effort you invested —
                      mastering concepts, building projects, and engaging with mentors and peers.
                      This certificate is not just a document; it is a symbol of your potential and
                      readiness to apply your knowledge in real-world scenarios.
                    </p>
                    <p>
                      At EdLernity, we believe in nurturing talent and creating pathways to
                      excellence. We are honored to have been part of your learning journey. Keep
                      striving, stay curious, and never stop learning.
                    </p>
                    <p className="font-bold text-slate-800">
                      Once again, congratulations — and welcome to the growing community of
                      EdLernity alumni!
                    </p>
                  </div>
                </div>
              </div>

              {/* Authenticity */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900 font-sans">
                  Credential authenticity
                </h2>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <AuthRow label="Technology" value="EdLernity Credential Registry" />
                  <AuthRow label="Certificate ID" value={certificate.uuid} mono />
                  <AuthRow label="Issued on" value={issuedLabel} />
                  <AuthRow label="Status" value="Active · Verified" />
                </dl>

                <button
                  type="button"
                  onClick={() => setVerifiedPanelOpen((v) => !v)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#181FC5] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#1418a8] sm:w-auto"
                >
                  <ShieldCheck size={18} />
                  {verifiedPanelOpen ? "Hide verification details" : "Verify credential"}
                </button>

                {verifiedPanelOpen ? (
                  <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-500 px-4 py-3 text-white">
                      <CheckCircle2 size={18} />
                      <span className="text-sm font-bold">Verified credential</span>
                    </div>
                    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                      <AuthRow label="Recipient name" value={certificate.studentName} />
                      <AuthRow label="Issuer name" value="EdLernity" />
                      <AuthRow label="Credential title" value={title} />
                      <AuthRow label="Issuance date" value={issuedLabel} />
                      <AuthRow label="Active, not expired" value="Yes" />
                      <AuthRow label="Verified on registry" value={certificate.uuid} mono />
                    </div>
                  </div>
                ) : null}
              </div>

              <p className="pb-4 text-center text-xs text-slate-500">
                Learners and can confirm this credential at{" "}
                <Link to="/verify-certificate" className="font-semibold text-[#181FC5]">
                  /verify-certificate
                </Link>{" "}
                using ID <span className="font-mono">{certificate.uuid}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}

function MetaBlock({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <p className="text-[11px] font-bold uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-1.5 text-base font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function AuthRow({ label, value, mono }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd
        className={`mt-1 text-sm font-semibold text-slate-900 ${mono ? "break-all font-mono text-xs" : ""}`}
      >
        {value || "—"}
      </dd>
    </div>
  );
}
