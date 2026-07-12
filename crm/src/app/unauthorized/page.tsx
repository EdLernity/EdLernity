"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function UnauthorizedPage() {
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {user?.email
          ? `Signed in as ${user.email}, but admin access is required for EdLernity CRM.`
          : "You need an admin account to access EdLernity CRM."}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={logout}
          className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
        >
          Sign out
        </button>
        <Link
          href="http://localhost:3000/mycourses"
          className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium"
        >
          Back to EdLernity
        </Link>
      </div>
    </div>
  );
}
