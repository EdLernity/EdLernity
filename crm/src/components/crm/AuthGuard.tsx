"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, isStaff, isIntern, isTrainer, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user || (!isStaff && !isIntern && !isTrainer)) {
    return null;
  }

  return <>{children}</>;
}
