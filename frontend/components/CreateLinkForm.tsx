"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link2, Sparkles, Loader2, AlertCircle, X } from "lucide-react";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect } from "react";

const schema = z.object({
    original_url: z
        .string()
        .min(1, "URL is required")
        .url("Please enter a valid URL (e.g. https://example.com)"),
    alias: z
        .string()
        .max(30, "Alias must be under 30 characters")
        .regex(/^[a-zA-Z0-9-_]*$/, "Only letters, numbers, - and _ allowed")
        .optional()
        .or(z.literal("")),
});

export type CreateLinkFormData = z.infer<typeof schema>;

interface Props {
    onSubmit: (data: CreateLinkFormData) => void;
    setError: Dispatch<SetStateAction<string>>;
    loading?: boolean;
    error?: string;
}

export default function CreateLinkForm({ onSubmit, loading = false, error, setError }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateLinkFormData>({
        resolver: zodResolver(schema),
        defaultValues: { original_url: "", alias: "" },
    });

    function clearError() {
        if (error) {
            setError("");
        }
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6"
        >
            {/* Header */}
            <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">Create a short link</h2>
                <p className="text-sm text-slate-500">
                    Paste a long URL and optionally customize its alias.
                </p>
            </div>
            {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-3.5 w-3.5 text-red-600" strokeWidth={2.5} />
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                </div>
            )}
            {/* Original URL */}
            <div className="space-y-1.5">
                <label
                    htmlFor="original_url"
                    className="block text-sm font-medium text-slate-700"
                >
                    Original URL
                </label>

                <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                    <input
                        id="original_url"
                        {...register("original_url", {
                            onChange: clearError,
                        })}
                        placeholder="https://example.com/very-long-link"
                        className={clsx(
                            "w-full rounded-xl border bg-slate-50/50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all",
                            "placeholder:text-slate-400",
                            "focus:bg-white focus:ring-2 focus:ring-offset-0",
                            errors.original_url
                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                        )}
                    />
                </div>

                {errors.original_url && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.original_url.message}
                    </p>
                )}
            </div>

            {/* Alias */}
            <div className="space-y-1.5">
                <label htmlFor="alias" className="block text-sm font-medium text-slate-700">
                    Custom Alias{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                </label>

                <div className="relative">
                    <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                    <input
                        id="alias"
                        {...register("alias", {
                            onChange: clearError,
                        })}
                        placeholder="my-custom-link"
                        className={clsx(
                            "w-full rounded-xl border bg-slate-50/50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all",
                            "placeholder:text-slate-400",
                            "focus:bg-white focus:ring-2 focus:ring-offset-0",
                            errors.alias
                                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                        )}
                    />
                </div>

                {errors.alias && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.alias.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className={clsx(
                    "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all",
                    "bg-gradient-to-r from-indigo-600 to-purple-600",
                    "hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98]",
                    "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                )}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <Link2 className="h-4 w-4" />
                        Create Link
                    </>
                )}
            </button>
        </form>
    );
}