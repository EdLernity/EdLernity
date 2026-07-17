"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchMyProfile, MyProfile } from "@/lib/crmApi";
import { formatDate } from "@/lib/crmUtils";

function isImageUrl(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(url) || url.includes("image");
}

function statusBadge(status?: string) {
  if (status === "approved") {
    return "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10";
  }
  if (status === "rejected") {
    return "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-500/10";
  }
  return "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10";
}

function ProfileDoc({ label, url }: { label: string; url: string }) {
  if (!url) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-xs text-gray-400">Not uploaded</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {isImageUrl(url) ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="h-36 w-full rounded-xl object-cover border border-gray-100 dark:border-gray-800"
          />
        </a>
      ) : (
        <div className="flex h-36 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500">Document file</p>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-xs font-semibold text-brand-500 hover:text-brand-600"
      >
        Open document
      </a>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-words">
        {value?.trim() || "—"}
      </p>
    </div>
  );
}

export default function InternMyProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyProfile()
      .then(setProfile)
      .catch(() => setError("Failed to load your profile"))
      .finally(() => setLoading(false));
  }, []);

  const kyc = profile?.kyc;
  const account = profile?.account;
  const displayName =
    kyc?.fullName ||
    `${account?.firstName || user?.firstName || ""} ${account?.lastName || user?.lastName || ""}`.trim() ||
    account?.email ||
    user?.email ||
    "Intern";
  const photoUrl = kyc?.photoUrl || "";
  const approval = kyc?.approvalStatus || "pending";

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-sm text-gray-500">
        Loading your profile…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-500 via-brand-500 to-brand-600 p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {photoUrl && isImageUrl(photoUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={displayName}
              className="h-24 w-24 rounded-full border-4 border-white/30 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/15 text-3xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Intern portal
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">{displayName}</h1>
            <p className="mt-1 text-sm text-white/85">
              {kyc?.programName || "Your internship profile"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadge(approval)}`}
              >
                KYC {approval}
              </span>
              {kyc?.collegeName ? (
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  {kyc.collegeName}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {!kyc ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          No onboarding profile found yet. Complete internship onboarding to build your profile here.
        </div>
      ) : (
        <>
          {approval === "rejected" && kyc.rejectionReason ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 dark:border-red-500/30 dark:bg-red-500/10">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                Application needs updates
              </p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{kyc.rejectionReason}</p>
              <Link
                href="/resubmit-kyc"
                className="mt-3 inline-flex text-sm font-semibold text-red-700 underline dark:text-red-200"
              >
                Resubmit documents
              </Link>
            </div>
          ) : null}

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Information from your internship onboarding.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="Full name" value={kyc.fullName} />
              <Detail label="Email" value={kyc.email || account?.email} />
              <Detail label="Phone" value={kyc.phone || account?.phone} />
              <Detail label="College" value={kyc.collegeName} />
              <Detail label="Program" value={kyc.programName} />
              <Detail label="Submitted" value={formatDate(kyc.submittedAt)} />
              {kyc.approvedAt ? <Detail label="Approved" value={formatDate(kyc.approvedAt)} /> : null}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Uploaded documents</h2>
            <p className="mt-1 text-sm text-gray-500">
              Documents you submitted during KYC verification.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ProfileDoc label="Photo" url={kyc.photoUrl || ""} />
              <ProfileDoc label="12th certificate" url={kyc.twelfthCertificateUrl || ""} />
              <ProfileDoc label="Aadhaar (front)" url={kyc.aadharFrontUrl || ""} />
              <ProfileDoc label="Aadhaar (back)" url={kyc.aadharBackUrl || ""} />
              <ProfileDoc label="College ID" url={kyc.collegeIdUrl || ""} />
            </div>
          </div>
        </>
      )}

      {(profile?.enrollments?.length || 0) > 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Enrollments</h2>
          <p className="mt-1 text-sm text-gray-500">Programs linked to your account.</p>
          <ul className="mt-5 space-y-3">
            {profile!.enrollments.map((row) => (
              <li
                key={row.internshipSlug}
                className="flex flex-col gap-1 rounded-2xl border border-gray-100 dark:border-gray-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{row.title}</p>
                  <p className="text-xs text-gray-500">{row.internshipSlug}</p>
                </div>
                {row.enrolledAt ? (
                  <p className="text-xs text-gray-500">Enrolled {formatDate(row.enrolledAt)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/my-offer-letters"
          className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          My offer letters
        </Link>
        <Link
          href="/my-certificates"
          className="inline-flex items-center rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          My certificates
        </Link>
      </div>
    </div>
  );
}
