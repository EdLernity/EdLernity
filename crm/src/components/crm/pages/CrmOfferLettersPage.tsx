"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  downloadOfferLetterPdf,
  OFFER_LETTER_TEMPLATES,
  sendOfferLetterEmail,
} from "@/lib/offerLetterUtils";
import { recordOfferLetter, fetchCareersPrograms } from "@/lib/crmApi";
import { inputClass, selectClass } from "@/lib/crmUtils";

export default function CrmOfferLettersPage() {
  const searchParams = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [internshipSlug, setInternshipSlug] = useState("sales-marketing");
  const [programs, setPrograms] = useState<Array<{ slug: string; title: string }>>([]);
  const [mailBody, setMailBody] = useState("");
  const [subject, setSubject] = useState("Your EdLernity Offer Letter");
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCareersPrograms().then(setPrograms).catch(() => {});
  }, []);

  useEffect(() => {
    const initialEmail = searchParams.get("email");
    const initialName = searchParams.get("name");
    if (initialEmail) setEmail(initialEmail);
    if (initialName) setName(initialName);
  }, [searchParams]);

  const validate = () => {
    if (!pdfUrl || !name.trim()) {
      setMessage("Select a template and enter candidate name");
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validate() || !email.trim() || !mailBody.trim()) {
      setMessage("Please fill all required fields");
      return;
    }
    setSending(true);
    setMessage("");
    try {
      await sendOfferLetterEmail({
        pdfUrl,
        email: email.trim(),
        name: name.trim(),
        mailBody,
        subject: subject.trim(),
      });
      const template = OFFER_LETTER_TEMPLATES.find((t) => t.url === pdfUrl);
      await recordOfferLetter({
        userEmail: email.trim(),
        internshipSlug,
        candidateName: name.trim(),
        templateId: template?.id,
        templateLabel: template?.label,
      });
      setMessage("Offer letter sent and recorded for intern visibility");
    } catch {
      setMessage("Failed to send offer letter");
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async () => {
    if (!validate()) return;
    setDownloading(true);
    try {
      await downloadOfferLetterPdf({
        pdfUrl,
        name: name.trim(),
      });
      setMessage("Offer letter downloaded");
    } catch {
      setMessage("Failed to download offer letter");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Offer Letters</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and send personalized offer letters</p>
      </div>

      {message && (
        <p className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg px-4 py-2">{message}</p>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Letter Template *</span>
              <select value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} className={selectClass()}>
                <option value="">Select template</option>
                {OFFER_LETTER_TEMPLATES.map((item) => (
                  <option key={item.id} value={item.url}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Candidate Name *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass()} placeholder="Full name" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Candidate Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass()} />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Careers internship</span>
              <select
                value={internshipSlug}
                onChange={(e) => setInternshipSlug(e.target.value)}
                className={selectClass()}
              >
                {programs.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.title}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Email Subject</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass()} />
            </label>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Email Body *</span>
              <textarea
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                rows={10}
                className={inputClass() + " !h-auto py-3"}
                placeholder="Write the email message..."
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-60"
              >
                {downloading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
