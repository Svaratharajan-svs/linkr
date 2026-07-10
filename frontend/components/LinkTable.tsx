"use client";

import { useState } from "react";
import { Link } from "@/types/link";
import { Copy, Check, ExternalLink, MousePointerClick } from "lucide-react";

interface Props {
  links: Link[];
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8080";

export default function LinkTable({ links }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function copyLink(code: string) {
    navigator.clipboard.writeText(`${BASE_URL}/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Short Link
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Original URL
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-500">
              Clicks
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Created
            </th>
            <th className="px-6 py-3 text-center font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {links.map((link:Link) => (
            <tr
              key={link.id}
              className="group transition-colors hover:bg-indigo-50/40"
            >
              {/* Short link */}
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-col">
                    <a
                      href={`${BASE_URL}/${link.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      /{link.code}
                    </a>
                    {link.alias && (
                      <span className="text-xs text-gray-400">
                        alias: {link.alias}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Original URL */}
              <td className="max-w-xs px-6 py-4">
                <p
                  className="truncate text-gray-600"
                  title={link.original_url}
                >
                  {link.original_url}
                </p>
              </td>

              {/* Clicks — right aligned, numeric */}
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  <MousePointerClick className="h-3 w-3" />
                  {(link.clicks ?? 0).toLocaleString()}
                </span>
              </td>

              {/* Created date */}
              <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                {formatDate(link.created_at)}
              </td>

              {/* Actions — centered */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => copyLink(link.code)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      copiedCode === link.code
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                        : "border-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                    }`}
                  >
                    {copiedCode === link.code ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}