"use client";

import React, { useEffect, useState } from "react";
import {
  completeOnboarding,
  fetchInviteByToken,
  getCrmLoginUrl,
  InviteDetails,
  isGmailAddress,
  KycOnboardPayload,
  OnboardSuccess,
} from "@/lib/onboardApi";
import { inputClass } from "@/lib/crmUtils";

type Props = {
  token: string;
};

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
  required,
  accept,
  file,
  onChange,
}: {
  label: string;
  required?: boolean;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500 mb-1 block">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type="file"
        required={required}
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-600"
      />
      {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
    </label>
  );
}

export default function InternOnboardPage({ token }: Props) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [success, setSuccess] = useState<OnboardSuccess | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    collegeName: "",
    programName: "",
    phone: "",
  });
  const [files, setFiles] = useState<FileFields>(initialFiles);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    let active = true;
    fetchInviteByToken(token)
      .then((data) => {
        if (!active) return;
        setInvite(data);
        const presetName = [data.firstName, data.lastName].filter(Boolean).join(" ");
        setForm((prev) => ({
          ...prev,
          fullName: presetName,
        }));
        if (!isGmailAddress(data.email)) {
          setError("This invite must use a Gmail address. Contact admin for a new invite.");
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err.response?.data?.message || "Invalid or expired invite link");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      setPhoneError("Phone number is required");
      return false;
    }
    if (!/^\d{10}$/.test(value.trim())) {
      setPhoneError("Enter a valid 10-digit phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(form.phone)) return;
    if (!files.photo || !files.twelfthCertificate || !files.aadharFront || !files.aadharBack || !files.collegeId) {
      setError("Please upload all required KYC documents");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const payload: KycOnboardPayload = {
        fullName: form.fullName.trim(),
        collegeName: form.collegeName.trim(),
        programName: form.programName.trim(),
        phone: form.phone.trim(),
        photo: files.photo,
        twelfthCertificate: files.twelfthCertificate,
        aadharFront: files.aadharFront,
        aadharBack: files.aadharBack,
        collegeId: files.collegeId,
      };
      const data = await completeOnboarding(token, payload);
      setSuccess(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Onboarding failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const crmLoginUrl = success?.redirectTo || getCrmLoginUrl();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading invite...
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invite unavailable</h1>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Internship onboarding complete!</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{success.message}</p>
          <div className="rounded-xl bg-white dark:bg-gray-900 p-4 mb-6 text-sm space-y-2">
            <p>
              <strong>Email:</strong> {success.credentials?.email}
            </p>
            <p>
              <strong>Password:</strong> {success.credentials?.password}
            </p>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Credentials were emailed to you. After admin or manager approval, your offer letter will appear in the intern portal.
          </p>
          <a
            href={crmLoginUrl}
            className="block w-full py-3 rounded-lg bg-brand-500 text-white text-center text-sm font-semibold"
          >
            Login to Intern Portal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 sm:p-8 lg:p-10 shadow-theme-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Internship Onboarding</h1>
        <p className="text-sm text-gray-500 mb-6">
          {invite?.programTitle}
        </p>
        {invite?.inviteMessage && (
          <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
            {invite.inviteMessage}
          </p>
        )}
        {error && <p className="text-sm text-error-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name *</label>
              <input
                required
                placeholder="Ex. Will Smith"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className={inputClass()}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Email address *</label>
              <input
                readOnly
                value={invite?.email || ""}
                className={inputClass() + " bg-gray-50 dark:bg-gray-800"}
              />
              <p className="text-xs text-gray-500 mt-1">Only Gmail ID</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">College Name (FULL) *</label>
              <input
                required
                placeholder="Ex. Lovely Professional University"
                value={form.collegeName}
                onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                className={inputClass()}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Program Name *</label>
              <input
                required
                placeholder="Ex. MBA"
                value={form.programName}
                onChange={(e) => setForm({ ...form, programName: e.target.value })}
                className={inputClass()}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Phone number *</label>
              <input
                required
                inputMode="numeric"
                pattern="\d{10}"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, phone: digits });
                  if (phoneError) validatePhone(digits);
                }}
                onBlur={() => validatePhone(form.phone)}
                className={inputClass()}
              />
              {phoneError && <p className="text-xs text-error-500 mt-1">{phoneError}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FileField
              label="My Photo"
              required
              accept="image/*"
              file={files.photo}
              onChange={(photo) => setFiles((prev) => ({ ...prev, photo }))}
            />
            <FileField
              label="12th Certificate/Marksheet"
              required
              accept="image/*,application/pdf"
              file={files.twelfthCertificate}
              onChange={(twelfthCertificate) => setFiles((prev) => ({ ...prev, twelfthCertificate }))}
            />
            <FileField
              label="Aadhar card Front"
              required
              accept="image/*,application/pdf"
              file={files.aadharFront}
              onChange={(aadharFront) => setFiles((prev) => ({ ...prev, aadharFront }))}
            />
            <FileField
              label="Aadhar card Back"
              required
              accept="image/*,application/pdf"
              file={files.aadharBack}
              onChange={(aadharBack) => setFiles((prev) => ({ ...prev, aadharBack }))}
            />
            <FileField
              label="College Id card"
              required
              accept="image/*,application/pdf"
              file={files.collegeId}
              onChange={(collegeId) => setFiles((prev) => ({ ...prev, collegeId }))}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || Boolean(error && invite && !isGmailAddress(invite.email))}
            className="w-full py-3 rounded-lg bg-brand-500 text-white text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Complete internship onboarding"}
          </button>
        </form>
      </div>
    </div>
  );
}
