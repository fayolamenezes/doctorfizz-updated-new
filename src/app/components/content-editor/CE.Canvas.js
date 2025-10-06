"use client";

import React from "react";
import {
  FileText,
  Sparkles,
  ClipboardList,
  Link as LinkIcon,
  PanelsTopLeft,
} from "lucide-react";

export default function CECanvas({ title = "Untitled" }) {
  return (
    <section
      className="
        rounded-b-[12px]
        border border-t-0 border-[var(--border)]
        bg-white/70
        px-6 md:px-8 py-6
      "
      aria-label="Editor canvas"
    >
      {/* Title */}
      <h2 className="text-[26px] md:text-[28px] font-bold text-[var(--text-primary)] mb-6">
        {title}
      </h2>

      {/* Starter actions */}
      <ul className="space-y-4 text-[14px] text-[var(--text-primary)]">
        <li className="flex items-center gap-3">
          <FileText size={18} className="text-[var(--muted)]" />
          <span>Empty page</span>
        </li>
        <li className="flex items-center gap-3">
          <Sparkles size={18} className="text-[var(--muted)]" />
          <span>Start with AI…</span>
        </li>
        <li className="flex items-center gap-3">
          <ClipboardList size={18} className="text-[var(--muted)]" />
          <span>Generate content brief</span>
        </li>
        <li className="flex items-center gap-3">
          <LinkIcon size={18} className="text-[var(--muted)]" />
          <span>Import content from URL</span>
        </li>
        <li className="flex items-center gap-3">
          <PanelsTopLeft size={18} className="text-[var(--muted)]" />
          <span>Import template</span>
        </li>
      </ul>
    </section>
  );
}
