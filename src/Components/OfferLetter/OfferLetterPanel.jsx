import React, { useEffect, useState } from "react";
import { Download, Mail, Send } from "lucide-react";
import { showSnackbar } from "../Utils/enQueSnackBar";
import MailBodyEditor from "./MailBodyEditor";
import {
  downloadOfferLetterPdf,
  OFFER_LETTER_TEMPLATES,
  sendOfferLetterEmail,
} from "./offerLetterUtils";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function inputClass() {
  return "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800";
}

function OfferLetterPanel({ initialEmail = "", initialName = "" }) {
  const [pdfUrl, setPdfUrl] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [mailBody, setMailBody] = useState("");
  const [subject, setSubject] = useState("Your EdLernity Offer Letter");
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialName) setName(initialName);
  }, [initialEmail, initialName]);

  const validateBase = () => {
    if (!pdfUrl || !name.trim()) {
      showSnackbar("Select a template and enter the candidate name", "error", "top");
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validateBase() || !email.trim() || !mailBody.trim() || !subject.trim()) {
      showSnackbar("Please fill all required fields", "error", "top");
      return;
    }

    setSending(true);
    try {
      const result = await sendOfferLetterEmail({
        pdfUrl,
        email: email.trim(),
        name: name.trim(),
        mailBody,
        subject: subject.trim(),
      });
      showSnackbar(result.message || "Offer letter sent successfully", "success", "top");
    } catch {
      showSnackbar("Failed to send offer letter", "error", "top");
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async () => {
    if (!validateBase()) return;

    setDownloading(true);
    try {
      await downloadOfferLetterPdf({
        pdfUrl,
        name: name.trim(),
        fileName: `${name.trim().replace(/\s+/g, "_")}_offer_letter.pdf`,
      });
      showSnackbar("Offer letter downloaded", "success", "top");
    } catch {
      showSnackbar("Failed to download offer letter", "error", "top");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900">Issue Offer Letter</h2>
        <p className="text-sm text-slate-600 mt-1">
          Generate a personalized offer letter PDF and email it to the candidate, or download a copy for records.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Letter Template *">
            <select
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className={inputClass()}
            >
              <option value="">Select template</option>
              {OFFER_LETTER_TEMPLATES.map((item) => (
                <option key={item.id} value={item.url}>{item.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Candidate Name *">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name on offer letter"
              className={inputClass()}
            />
          </Field>

          <Field label="Recipient Email *">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@email.com"
              className={inputClass()}
            />
          </Field>

          <Field label="Email Subject *">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line"
              className={inputClass()}
            />
          </Field>
        </div>

        <div className="space-y-4">
          <Field label="Email Body *">
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white min-h-[220px]">
              <MailBodyEditor value={mailBody} onChange={setMailBody} />
            </div>
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0] disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send Offer Letter"}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Preparing..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Available templates</p>
        <div className="flex flex-wrap gap-2">
          {OFFER_LETTER_TEMPLATES.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-[#181FC5]" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OfferLetterPanel;
