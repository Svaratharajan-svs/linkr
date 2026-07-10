"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted) {
    return <Loading />;
  }

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}