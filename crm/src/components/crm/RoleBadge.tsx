import React from "react";

const styles: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
  trainer: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  student: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  verified: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  blocked: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

export default function RoleBadge({ role }: { role: string }) {
  const key = role in styles ? role : "student";
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[key]}`}>
      {role}
    </span>
  );
}
