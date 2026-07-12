"use client";

import React, { useEffect, useState } from "react";
import { fetchMyKycStatus, MyKycStatus, resubmitKyc } from "@/lib/crmApi";
import { inputClass } from "@/lib/crmUtils";

type FileFields = {
  photo: File | null;
  twelfthCertificate: File | null;
  aadharFront: File | null;
  aadharBack: File | null;
  collegeId: File | null;
};

const initialFiles: FileFields = {
  photo: null,
  twelfthCertificate: null,
  aadharFront: null,
  aadharBack: null,
  collegeId: null,
};

function FileField({
  label,
  accept,
  file,
  onChange,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500 mb-1 block">{label} *</span>
      <input
        type="file"
        required
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-600"
      />
      {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
    </label>
  );
}

export default function InternResubmitKycPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [kyc, setKyc] = useState<MyKycStatus | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    collegeName: "",
    programName: "",
    phone: "",
  });
  const [files, setFiles] = useState<FileFields>(initialFiles);

  useEffect(() => {
    fetchMyKycStatus()
      .then((status) => {
        setKyc(status);
        if (status) {
          setForm({
            fullName: status.fullName || "",
            collegeName: status.collegeName || "",
            programName: status.programName || "",
            phone: status.phone || "",
          });
        }
      })
      .catch(() => setError("Failed to load verification status"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName.trim());
      formData.append("collegeName", form.collegeName.trim());
      formData.append("programName", form.programName.trim());
      formData.append("phone", form.phone.trim());
      if (files.photo) formData.append("photo", files.photo);
      if (files.twelfthCertificate) formData.append("twelfthCertificate", files.twelfthCertificate);
      if (files.aadharFront) formData.append("aadharFront", files.aadharFront);
      if (files.aadharBack) formData.append("aadharBack", files.aadharBack);
      if (files.collegeId) formData.append("collegeId", files.collegeId);

      const result = await resubmitKyc(formData);
      setMessage(result.message || "Verification resubmitted");
      setKyc((prev) => (prev ? { ...prev, approvalStatus: "pending", rejectionReason: "" } : prev));
      setFiles(initialFiles);
    } catch (err: unknown) {
      const apiMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(apiMessage || "Failed to resubmit verification");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500 py-8 text-center">Loading...</p>;
  }

  if (!kyc || kyc.approvalStatus !== "rejected") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No resubmission needed</h1>
        <p className="text-sm text-gray-500">
          {kyc?.approvalStatus === "pending"
            ? "Your application is awaiting admin or manager approval."
            : "Your verification is up to date."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resubmit verification</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your application was rejected. Please review the feedback, re-upload all documents, and submit again.
        </p>
      </div>

      {kyc.rejectionReason && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 p-4">
          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">Rejection reason</p>
          <p className="text-sm text-amber-900 dark:text-amber-200">{kyc.rejectionReason}</p>
        </div>
      )}

      {message && (
        <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg px-4 py-2">{message}</p>
      )}
      {error && (
        <p className="text-sm text-error-500 bg-error-50 dark:bg-error-500/10 rounded-lg px-4 py-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 space-y-4">
        <input
          required
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className={inputClass()}
        />
        <input
          required
          placeholder="College name"
          value={form.collegeName}
          onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
          className={inputClass()}
        />
        <input
          required
          placeholder="Program name"
          value={form.programName}
          onChange={(e) => setForm({ ...form, programName: e.target.value })}
          className={inputClass()}
        />
        <input
          required
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          placeholder="10-digit phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
          className={inputClass()}
        />

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <FileField label="My Photo" accept="image/*" file={files.photo} onChange={(photo) => setFiles((p) => ({ ...p, photo }))} />
          <FileField label="12th Certificate/Marksheet" accept="image/*,application/pdf" file={files.twelfthCertificate} onChange={(twelfthCertificate) => setFiles((p) => ({ ...p, twelfthCertificate }))} />
          <FileField label="Aadhar card Front" accept="image/*,application/pdf" file={files.aadharFront} onChange={(aadharFront) => setFiles((p) => ({ ...p, aadharFront }))} />
          <FileField label="Aadhar card Back" accept="image/*,application/pdf" file={files.aadharBack} onChange={(aadharBack) => setFiles((p) => ({ ...p, aadharBack }))} />
          <FileField label="College Id card" accept="image/*,application/pdf" file={files.collegeId} onChange={(collegeId) => setFiles((p) => ({ ...p, collegeId }))} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg bg-brand-500 text-white text-sm font-semibold disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Resubmit for verification"}
        </button>
      </form>
    </div>
  );
}
