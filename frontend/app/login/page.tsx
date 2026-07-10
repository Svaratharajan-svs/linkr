"use client";

import { useState, FormEvent } from "react";
import NextLink from "next/link";
import { login } from "@/services/auth";
import {
  Link2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white lg:flex">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/30">
            <Link2 className="h-5 w-5" />
          </span>
          <span className="text-xl tracking-tight">Linkly</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Shorten, share, and track your links — all in one place.
          </h2>
          <p className="mt-4 text-indigo-100">
            Create branded short links, monitor click analytics in real time,
            and keep everything organized in a single dashboard.
          </p>
        </div>

        <p className="relative text-sm text-indigo-200">
          &copy; {new Date().getFullYear()} Linkly. All rights reserved.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full flex-col items-center justify-center bg-gray-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 font-bold text-gray-900 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <Link2 className="h-5 w-5" />
            </span>
            <span className="text-xl tracking-tight">Linkly</span>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Sign in to your account to continue.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <NextLink
                    href="/forgot-password"
                    className="text-xs font-medium text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </NextLink>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <NextLink
              href="/register"
              className="font-medium text-indigo-600 hover:underline"
            >
              Sign up
            </NextLink>
          </p>
        </div>
      </div>
    </div>
  );
}