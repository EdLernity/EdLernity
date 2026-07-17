"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchMyProfile, MyProfile } from "@/lib/crmApi";
import { formatDate } from "@/lib/crmUtils";

function isImageUrl(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(url) || url.includes("image");
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
            {kyc?.collegeName ? (
              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  {kyc.collegeName}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {!kyc ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          No onboarding profile found yet. Complete internship onboarding to build your profile here.
        </div>
      ) : (
        <>
          {kyc.approvalStatus === "rejected" && kyc.rejectionReason ? (
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
