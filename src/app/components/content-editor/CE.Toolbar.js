"use client";

import React from "react";
import { Undo2, Redo2, Bold, Italic, Underline, Strikethrough, Code2, Link, AlignLeft, List, Dot, Type, MessageSquare } from "lucide-react";

export default function CEToolbar({ activeTab, onTabChange, lastEdited }) {
  const Tab = ({ id, children }) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => onTabChange?.(id)}
        className={`px-3 py-2 text-sm border-b-2 ${
          active ? "border-black text-black" : "border-transparent text-[var(--muted)] hover:text-black"
        }`}
      >
        {children}
      </button>
    );
  };

  const IconBtn = ({ children, title }) => (
    <button
      title={title}
      className="h-9 w-9 grid place-items-center rounded hover:bg-[var(--input)] text-[var(--text-primary)]"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-t-[12px] border border-b-0 border-[var(--border)] bg-white/70">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center">
          <Tab id="content">Content</Tab>
          <Tab id="summary">Article Summery</Tab>
          <Tab id="final">Final Content</Tab>
        </div>
        <div className="text-[12px] text-[var(--muted)] pr-2">Edited {lastEdited}</div>
      </div>

      <div className="flex items-center gap-1 px-2 py-1 border-t border-[var(--border)]">
        <IconBtn title="Undo"><Undo2 size={16} /></IconBtn>
        <IconBtn title="Redo"><Redo2 size={16} /></IconBtn>

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        <button className="px-2 h-9 rounded border border-[var(--border)] text-sm hover:bg-[var(--input)]">Heading 3 ▾</button>

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        <IconBtn title="Bold"><Bold size={16} /></IconBtn>
        <IconBtn title="Italic"><Italic size={16} /></IconBtn>
        <IconBtn title="Underline"><Underline size={16} /></IconBtn>
        <IconBtn title="Strikethrough"><Strikethrough size={16} /></IconBtn>
        <IconBtn title="Code"><Code2 size={16} /></IconBtn>
        <IconBtn title="Link"><Link size={16} /></IconBtn>
        <IconBtn title="Align"><AlignLeft size={16} /></IconBtn>

        <IconBtn title="List"><List size={16} /></IconBtn>
        <IconBtn title="Color"><Dot size={16} /></IconBtn>

        <button className="px-2 h-9 rounded border border-[var(--border)] text-sm hover:bg-[var(--input)]">Insert ▾</button>
        <IconBtn title="Text size"><Type size={16} /></IconBtn>
        <IconBtn title="Comment"><MessageSquare size={16} /></IconBtn>
      </div>
    </div>
  );
}