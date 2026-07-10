"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getStats } from "@/services/link";
import { StatsResponse } from "@/types/link";
import {
  ArrowLeft,
  AlertCircle,
  MousePointerClick,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;

    setLoading(true);

    async function load() {
      try {
        const result = await getStats(code);
        setStats(result);
      } catch {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [code]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-slate-50">
        {/* Decorative background glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/dashboard");
            }
          }}
          className="fixed left-6 top-6 z-10 flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition-all hover:border-slate-300 hover:bg-white hover:text-slate-900 sm:left-10 sm:top-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="relative mx-auto max-w-4xl px-6 py-16 sm:py-24">
          {/* Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Link Statistics
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Performance data for{" "}
              <span className="font-mono font-medium text-indigo-600">
                /{code}
              </span>
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-sm text-slate-500">Loading statistics...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-3.5 w-3.5 text-red-600" strokeWidth={2.5} />
              </div>
              <p className="flex-1 text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {stats && (
            <div className="space-y-8">
              {/* Total Clicks Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-200">
                    <MousePointerClick className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Total Clicks
                  </h2>
                </div>
                <p className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
                  {stats.total_clicks.toLocaleString()}
                </p>
              </div>

              {/* Daily Clicks Chart */}
              {(stats.daily ?? []).length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Daily Clicks
                    </h2>
                  </div>

                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={stats.daily}>
                      <defs>
                        <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        }}
                        labelStyle={{ fontWeight: 600, color: "#0f172a" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#clickGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Daily Clicks Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 font-semibold text-slate-600">Date</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(stats.daily ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-slate-400">
                          No click data yet
                        </td>
                      </tr>
                    ) : (
                      (stats.daily ?? []).map((item) => (
                        <tr key={item.date} className="transition-colors hover:bg-slate-50">
                          <td className="px-6 py-3 font-medium text-slate-700">{item.date}</td>
                          <td className="px-6 py-3 text-slate-600">{item.count}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}