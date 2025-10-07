"use client";

import React, { useRef, useState } from "react";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code2,
  Link as LinkIcon,
  AlignLeft,
  List,
  Type,
  MessageSquare,
  SquareStack,
  ChevronDown,
  Dot
} from "lucide-react";

/**
 * Props:
 * - activeTab, onTabChange, lastEdited
 * - editorRef: ref forwarded from CE.Canvas (provides .exec(cmd, val))
 */
export default function CEToolbar({
  activeTab,
  onTabChange,
  lastEdited,
  editorRef,
}) {
  const [headOpen, setHeadOpen] = useState(false);
  const [insOpen, setInsOpen] = useState(false);
  const colorInputRef = useRef(null);

  // Prevent toolbar buttons from stealing focus (keeps selection in editor)
  const noFocus = (e) => e.preventDefault();

  const exec = (cmd, val) => editorRef?.current?.exec(cmd, val);

  const Tab = ({ id, children }) => {
    const is = activeTab === id;
    return (
      <button
        onClick={() => onTabChange?.(id)}
        className={`h-10 px-3 text-sm border-b-2 -mb-px ${
          is
            ? "border-black text-black"
            : "border-transparent text-[var(--muted)] hover:text-black"
        }`}
      >
        {children}
      </button>
    );
  };

  const IconBtn = ({ title, children, onClick }) => (
    <button
      title={title}
      onMouseDown={noFocus}
      onClick={onClick}
      className="h-9 w-9 grid place-items-center rounded hover:bg-[var(--input)] text-[var(--text-primary)]"
    >
      {children}
    </button>
  );

  return (
    <div
      className="
        w-full
        rounded-tl-[12px] rounded-tr-none
        border border-b-0 border-r-0 border-[var(--border)]
        bg-white/70
      "
    >
      {/* Tabs row */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-1">
          <Tab id="content">Content</Tab>
          <Tab id="summary">Article Summery</Tab>
          <Tab id="final">Final Content</Tab>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--muted)] pr-2">
          <span>Edited {lastEdited}</span>
          <SquareStack size={16} className="opacity-70" />
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-1 px-2 py-1 border-t border-[var(--border)]">
        <IconBtn title="Undo" onClick={() => exec("undo")}><Undo2 size={16} /></IconBtn>
        <IconBtn title="Redo" onClick={() => exec("redo")}><Redo2 size={16} /></IconBtn>

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        {/* Heading dropdown */}
        <div className="relative">
          <button
            className="px-2 h-9 rounded border border-[var(--border)] text-sm hover:bg-[var(--input)] inline-flex items-center gap-1"
            onMouseDown={noFocus}
            onClick={() => setHeadOpen((s) => !s)}
          >
            Heading 3 <ChevronDown size={14} />
          </button>
          {headOpen && (
            <div className="absolute z-10 mt-1 min-w-[160px] rounded-md border border-[var(--border)] bg-white shadow-sm">
              {[
                { label: "Paragraph", block: "p" },
                { label: "Heading 1", block: "h1" },
                { label: "Heading 2", block: "h2" },
                { label: "Heading 3", block: "h3" },
              ].map((it) => (
                <button
                  key={it.block}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--input)]"
                  onMouseDown={noFocus}
                  onClick={() => { exec("formatBlock", it.block); setHeadOpen(false); }}
                >
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        <IconBtn title="Bold" onClick={() => exec("bold")}><Bold size={16} /></IconBtn>
        <IconBtn title="Italic" onClick={() => exec("italic")}><Italic size={16} /></IconBtn>
        <IconBtn title="Underline" onClick={() => exec("underline")}><Underline size={16} /></IconBtn>
        <IconBtn title="Strikethrough" onClick={() => exec("strikeThrough")}><Strikethrough size={16} /></IconBtn>
        <IconBtn title="Inline code" onClick={() => exec("code")}><Code2 size={16} /></IconBtn>
        <IconBtn title="Link" onClick={() => {
          const url = prompt("Enter URL");
          if (url) exec("createLink", url);
        }}>
          <LinkIcon size={16} />
        </IconBtn>
        <IconBtn title="Align left" onClick={() => exec("justifyLeft")}><AlignLeft size={16} /></IconBtn>
        <IconBtn title="Bulleted List" onClick={() => exec("insertUnorderedList")}><List size={16} /></IconBtn>

        {/* divider after list (match design) */}
        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        {/* color dot */}
        <IconBtn title="Text color" onClick={() => colorInputRef.current?.click()}>
          <Dot size={16} />
        </IconBtn>
        <input
          ref={colorInputRef}
          type="color"
          className="hidden"
          onChange={(e) => exec("foreColor", e.target.value)}
        />

        {/* divider before Insert (match design) */}
        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        {/* Insert dropdown */}
        <div className="relative">
          <button
            className="px-2 h-9 rounded border border-[var(--border)] text-sm hover:bg-[var(--input)] inline-flex items-center gap-1"
            onMouseDown={noFocus}
            onClick={() => setInsOpen((s) => !s)}
          >
            Insert <ChevronDown size={14} />
          </button>
          {insOpen && (
            <div className="absolute z-10 mt-1 min-w-[180px] rounded-md border border-[var(--border)] bg-white shadow-sm">
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--input)]"
                onMouseDown={noFocus}
                onClick={() => { exec("insertHorizontalRule"); setInsOpen(false); }}
              >
                Horizontal Rule
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--input)]"
                onMouseDown={noFocus}
                onClick={() => {
                  const url = prompt("Image URL");
                  if (url) exec("insertImage", url);
                  setInsOpen(false);
                }}
              >
                Image (URL)
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--input)]"
                onMouseDown={noFocus}
                onClick={() => { exec("formatBlock", "blockquote"); setInsOpen(false); }}
              >
                Quote
              </button>
            </div>
          )}
        </div>

        {/* T x and comment (placeholders kept) */}
        <button
          title="Text size"
          onMouseDown={noFocus}
          onClick={() => {
            const size = prompt("Font size (px): 12, 14, 16, 18...");
            if (!size) return;
            const px = parseInt(size, 10);
            const scale = px <= 12 ? 2 : px <= 14 ? 3 : px <= 16 ? 4 : px <= 18 ? 5 : 6;
            exec("fontSize", scale);
          }}
          className="ml-2 h-9 px-2 rounded hover:bg-[var(--input)] text-[var(--text-primary)] text-[13px] font-medium"
        >
          T<span className="text-[11px] align-super">x</span>
        </button>

        <IconBtn title="Comment (placeholder)">
          <MessageSquare size={16} />
        </IconBtn>
      </div>
    </div>
  );
}
