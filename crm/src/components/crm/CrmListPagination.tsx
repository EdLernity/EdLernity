"use client";

import React, { useEffect, useMemo, useState } from "react";

export const CRM_PAGE_SIZE = 20;

export function useClientPagination<T>(
  items: T[],
  pageSize = CRM_PAGE_SIZE,
  resetKey: string | number = ""
) {
  const [page, setPage] = useState(1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  useEffect(() => {
    setPage(1);
  }, [pageSize, resetKey, total]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return { page, setPage, pageItems, total, totalPages, from, to, pageSize };
}

type Props = {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function CrmListPagination({
  page,
  totalPages,
  total,
  from,
  to,
  onPageChange,
  className = "",
}: Props) {
  if (total === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 dark:border-gray-800 ${className}`}
    >
      <p className="text-xs text-gray-500">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{from}</span>
        –<span className="font-medium text-gray-700 dark:text-gray-300">{to}</span> of{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span>
      </p>
      {totalPages > 1 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-50 dark:border-gray-700"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-50 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
