"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import StatCard from "@/components/crm/StatCard";
import {
  fetchTransactions,
  MonthlySalesRow,
  TransactionRow,
  TransactionsResponse,
} from "@/lib/crmApi";
import { formatCurrency, formatDate, inputClass, selectClass } from "@/lib/crmUtils";

const SOURCE_OPTIONS = [
  { value: "", label: "All sources" },
  { value: "internship", label: "Internships" },
  { value: "course", label: "Courses" },
  { value: "membership", label: "Membership" },
];

export default function CrmTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlySalesRow[]>([]);
  const [summary, setSummary] = useState<TransactionsResponse["summary"] | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTransactions({
        year: filterYear || undefined,
        month: filterMonth || undefined,
        source: filterSource || undefined,
        date: searchDate || undefined,
        search: searchName || undefined,
      });
      setTransactions(data.transactions || []);
      setMonthlyBreakdown(data.monthlyBreakdown || []);
      setSummary(data.summary || null);
      setAvailableYears(data.availableYears || []);
    } catch {
      setError("Failed to load transactions. Check backend connection and admin session.");
      setTransactions([]);
      setMonthlyBreakdown([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [filterYear, filterMonth, filterSource, searchDate, searchName]);

  useEffect(() => {
    load();
  }, [load]);

  const monthOptions = useMemo(() => {
    const rows = filterYear
      ? monthlyBreakdown.filter((row) => String(row.year) === filterYear)
      : monthlyBreakdown;
    return rows.map((row) => ({ value: row.key, label: row.label }));
  }, [monthlyBreakdown, filterYear]);

  const clearFilters = () => {
    setFilterYear("");
    setFilterMonth("");
    setFilterSource("");
    setSearchDate("");
    setSearchName("");
  };

  const selectMonth = (key: string) => {
    setFilterMonth((prev) => (prev === key ? "" : key));
    if (key) {
      const [y] = key.split("-");
      setFilterYear(y);
    }
    setSearchDate("");
  };

  const scopeLabel = filterMonth
    ? monthlyBreakdown.find((row) => row.key === filterMonth)?.label || filterMonth
    : filterYear
      ? filterYear
      : "All time";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Payment records with monthly sales breakdown
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Filtered revenue"
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          hint={`${summary?.transactionCount ?? 0} payments · ${scopeLabel}`}
        />
        <StatCard
          label="Breakdown total"
          value={formatCurrency(summary?.breakdownRevenue ?? 0)}
          hint={`${summary?.breakdownCount ?? 0} payments in chart scope`}
        />
        <StatCard label="Months tracked" value={monthlyBreakdown.length} hint={filterYear ? `Year ${filterYear}` : "All years"} />
        <StatCard
          label="Avg per month"
          value={
            monthlyBreakdown.length
              ? formatCurrency((summary?.breakdownRevenue ?? 0) / monthlyBreakdown.length)
              : formatCurrency(0)
          }
          hint="Based on visible months"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1 block">Year</span>
          <select
            value={filterYear}
            onChange={(e) => {
              setFilterYear(e.target.value);
              setFilterMonth("");
              setSearchDate("");
            }}
            className={selectClass() + " min-w-[120px]"}
          >
            <option value="">All years</option>
            {availableYears.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1 block">Month</span>
          <select
            value={filterMonth}
            onChange={(e) => {
              const value = e.target.value;
              setFilterMonth(value);
              if (value) {
                const [y] = value.split("-");
                setFilterYear(y);
              }
              setSearchDate("");
            }}
            className={selectClass() + " min-w-[160px]"}
          >
            <option value="">All months</option>
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1 block">Source</span>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className={selectClass() + " min-w-[150px]"}
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1 block">Specific date</span>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => {
              setSearchDate(e.target.value);
              if (e.target.value) setFilterMonth("");
            }}
            className={inputClass()}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1 block">Search name/email/payment ID</span>
          <input
            type="search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search..."
            className={inputClass() + " min-w-[200px]"}
          />
        </label>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="h-11 px-5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="h-11 px-5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
        >
          Clear filters
        </button>
      </div>

      {error && <p className="text-sm text-error-500">{error}</p>}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Monthly sales breakdown</h2>
            <p className="text-xs text-gray-500 mt-1">Click a month to filter payment records below</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Month</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Payments</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Internships</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Courses</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Membership</th>
                <th className="px-5 py-3 text-right font-medium text-gray-500">Total sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Loading monthly breakdown...
                  </td>
                </tr>
              ) : monthlyBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No sales data for the selected filters
                  </td>
                </tr>
              ) : (
                monthlyBreakdown.map((row) => {
                  const selected = filterMonth === row.key;
                  return (
                    <tr
                      key={row.key}
                      onClick={() => selectMonth(row.key)}
                      className={`cursor-pointer transition-colors ${
                        selected
                          ? "bg-brand-50 dark:bg-brand-500/10"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      }`}
                    >
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                        {row.label}
                        {selected && (
                          <span className="ml-2 text-xs font-normal text-brand-600 dark:text-brand-400">
                            selected
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">{row.count}</td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {formatCurrency(row.bySource.internship.total)}
                        <span className="block text-xs text-gray-400">{row.bySource.internship.count} txns</span>
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {formatCurrency(row.bySource.course.total)}
                        <span className="block text-xs text-gray-400">{row.bySource.course.count} txns</span>
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600">
                        {formatCurrency(row.bySource.membership.total)}
                        <span className="block text-xs text-gray-400">{row.bySource.membership.count} txns</span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(row.total)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {!loading && monthlyBreakdown.length > 0 && (
              <tfoot className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
                <tr>
                  <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">Total</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    {summary?.breakdownCount ?? 0}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      monthlyBreakdown.reduce((sum, row) => sum + row.bySource.internship.total, 0)
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      monthlyBreakdown.reduce((sum, row) => sum + row.bySource.course.total, 0)
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      monthlyBreakdown.reduce((sum, row) => sum + row.bySource.membership.total, 0)
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-brand-600 dark:text-brand-400">
                    {formatCurrency(summary?.breakdownRevenue ?? 0)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Payment records</h2>
          <p className="text-xs text-gray-500 mt-1">
            {transactions.length} record{transactions.length === 1 ? "" : "s"} matching current filters
          </p>
        </div>
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Payment ID</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Amount</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Source</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{t.name}</td>
                  <td className="px-5 py-3 text-gray-600">{t.email}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">{t.paymentId}</td>
                  <td className="px-5 py-3 text-gray-900 dark:text-white">{formatCurrency(Number(t.amount) || 0)}</td>
                  <td className="px-5 py-3 text-gray-600 capitalize">{t.source || "—"}</td>
                  <td className="px-5 py-3 text-gray-600">{formatDate(t.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
