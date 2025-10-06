"use client";

import React from "react";
import { FileText, Sparkles, ClipboardList, Link as LinkIcon, PanelsTopLeft } from "lucide-react";

export default function CECanvas({ title }) {
  return (
    <div className="rounded-b-[12px] border border-[var(--border)] bg-white/70 p-8 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <ul className="space-y-3 text-[14px] text-[var(--text-primary)]">
        <li className="flex items-center gap-3"><FileText size={16} className="text-[var(--muted)]"/> Empty page</li>
        <li className="flex items-center gap-3"><Sparkles size={16} className="text-[var(--muted)]"/> Start with AI…</li>
        <li className="flex items-center gap-3"><ClipboardList size={16} className="text-[var(--muted)]"/> Generate content brief</li>
        <li className="flex items-center gap-3"><LinkIcon size={16} className="text-[var(--muted)]"/> Import content from URL</li>
        <li className="flex items-center gap-3"><PanelsTopLeft size={16} className="text-[var(--muted)]"/> Import template</li>
      </ul>
    </div>
  );
}