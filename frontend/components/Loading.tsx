"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Logo / Brand mark */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer pulsing ring */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500/30"></span>
        {/* Static ring */}
        <span className="absolute inline-flex h-16 w-16 rounded-full border border-indigo-400/40"></span>
        {/* Spinner */}
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" strokeWidth={2.5} />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium tracking-wide text-slate-200">
          Loading your experience
        </p>
        <p className="text-xs text-slate-500">Please wait a moment...</p>
      </div>

      {/* Animated progress bar */}
      <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-1/3 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
      </div>
    </div>
  );
}