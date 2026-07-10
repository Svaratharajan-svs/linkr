"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CreateLinkForm, {
    CreateLinkFormData,
} from "@/components/CreateLinkForm";
import { ArrowLeft, Link2 } from "lucide-react";
import { createLink } from "@/services/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function CreateLinkPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function submit(data: CreateLinkFormData) {
        try {
            setLoading(true);
            setError("");

            const result = await createLink(data);

            toast.success(`Short URL created!\n\n${result.short_url}`);

            router.push("/dashboard");
        } catch (err: any) {
            const message =
                err.response?.data?.error
                ||
                "Unable to create link";


            setError(message);


            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

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
                    onClick={() => router.back()}
                    className="fixed left-6 top-6 z-10 flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition-all hover:border-slate-300 hover:bg-white hover:text-slate-900 sm:left-10 sm:top-10"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center px-6 py-16 sm:py-24">
                    {/* Icon badge */}
                    <div className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200">
                        <Link2 className="h-7 w-7 text-white" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Create Short Link
                    </h1>
                    <p className="mt-3 max-w-md text-center text-sm text-slate-500 sm:text-base">
                        Turn long, messy URLs into clean, shareable links in seconds.
                    </p>

                    {/* Form — centered regardless of its own max-width */}
                    <div className="mt-10 flex w-full justify-center">
                        <CreateLinkForm
                            onSubmit={submit}
                            loading={loading}
                            error={error}
                            setError={setError}
                        />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}