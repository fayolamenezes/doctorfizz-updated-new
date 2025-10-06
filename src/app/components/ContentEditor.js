"use client";

import React from "react";
import { ArrowLeft, Save, FileText } from "lucide-react";

export default function ContentEditor({ onBackToDashboard }) {
  const handleBack = () => {
    // Fire global event (works even if parent forgot to pass the prop)
    try { window.dispatchEvent(new Event("content-editor:back")); } catch {}
    // Call parent prop if provided
    if (typeof onBackToDashboard === "function") onBackToDashboard();
  };

  return (
    <main className="min-h-screen bg-[var(--bg-panel)] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--input)] transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-[18px] font-bold">Content Editor</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-[14px] px-4 py-2 text-[13px] font-semibold text-white shadow-sm bg-[image:var(--infoHighlight-gradient)] hover:opacity-90 transition">
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Editor panel */}
      <section className="rounded-[18px] border border-[var(--border)] bg-[var(--input)] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-[var(--accent)]" />
          <h2 className="text-[16px] font-semibold">Edit Page Content</h2>
        </div>

        <textarea
          placeholder="Start editing your optimized content here..."
          className="w-full min-h-[300px] rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] text-[14px] text-[var(--text-primary)] p-4 outline-none focus:border-[var(--accent)] resize-y"
        />

        <div className="mt-4 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-[14px] px-4 py-2 text-[13px] font-semibold text-white shadow-sm bg-[image:var(--infoHighlight-gradient)] hover:opacity-90 transition">
            <Save size={16} /> Save Draft
          </button>
        </div>
      </section>
    </main>
  );
}
