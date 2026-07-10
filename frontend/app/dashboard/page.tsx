"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getLinks } from "@/services/link";
import { Link } from "@/types/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LinkTable from "@/components/LinkTable";
import {
  Link2,
  AlertCircle,
  Inbox,
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
  TrendingUp,
  Plus,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);
  const { logout, user } = useAuth() as { logout: () => void; user?: any };
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // TODO: move to custom hook for pagination
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(totalLinks / pageSize));

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;
  async function loadLinks() {
    try {
      setLoading(true);
      setError("");
      const result = await getLinks(page, 10);
      setLinks(result.items);
      setTotalLinks(result.total ?? 0);
    } catch (err) {
      setError("Failed to load links. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const displayName = user?.name || user?.email?.split("@")[0] || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Gradient header banner */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  Link Dashboard
                </h1>
                <p className="mt-1 text-sm text-indigo-100">
                  Manage and track all your shortened links in one place.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                {/* Create Link button */}
                <button
                  onClick={() => router.push("/dashboard/create")}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50"
                >
                  <Plus className="h-4 w-4" />
                  Create Link
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-lg border border-white/25 py-1.5 pl-1.5 pr-3 transition hover:bg-white/10"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
                      {initial}
                    </span>
                    <span className="hidden max-w-[120px] truncate text-sm font-medium text-white sm:inline">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-white/70 transition-transform ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 text-left shadow-lg">
                      <div className="border-b border-gray-100 px-4 py-2.5">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {displayName}
                        </p>
                        {user?.email && (
                          <p className="truncate text-xs text-gray-400">
                            {user.email}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Link2 className="h-5 w-5 text-indigo-600" />}
              iconBg="bg-indigo-50"
              label="Links on this page"
              value={links.length}
            />
            <StatCard
              icon={<MousePointerClick className="h-5 w-5 text-emerald-600" />}
              iconBg="bg-emerald-50"
              label="Total clicks"
              value={totalClicks.toLocaleString()}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
              iconBg="bg-amber-50"
              label="Current page"
              value={page}
            />
          </div>

          {/* Content card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">All Links</h2>
            </div>

            {error && (
              <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-6 py-4 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {loading && (
              <div className="animate-pulse divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <div className="h-4 w-1/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && links.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                <div className="rounded-full bg-gray-100 p-3">
                  <Inbox className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">No links found</p>
                <p className="text-sm text-gray-500">
                  Create a new link to see it listed here.
                </p>
              </div>
            )}

            {!loading && !error && links.length > 0 && <LinkTable links={links} />}

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <button
                disabled={!hasPrevious}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <span className="text-sm text-gray-500">
                Page <span className="font-semibold text-gray-900">{page}</span>
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}