"use client";

import React, { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { FileText, Sparkles, ScrollText, Link2, Shapes } from "lucide-react";

const CECanvas = forwardRef(function CECanvas(
  { title = "Untitled", content = "", setContent },
  ref
) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  function sanitizeToHtml(input) {
    const str = String(input || "");
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(str);
    if (looksLikeHtml) return str;
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return str.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, "<br/>")}</p>`).join("");
  }

  // consider empty even if it's only spaces or empty tags
  const isTrulyEmpty = () => {
    const plain = String(content || "")
      .replace(/<[^>]*>/g, "")   // strip tags
      .replace(/&nbsp;/g, " ")   // normalize nbsp
      .trim();
    return plain.length === 0;
  };

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = sanitizeToHtml(content);
    if (el.innerHTML !== html) el.innerHTML = html;
  }, [content]);

  useImperativeHandle(ref, () => ({
    exec: (cmd, value) => execCommand(cmd, value),
  }));

  function saveSelectionSnapshot() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const container = editorRef.current;
    const anchor = sel.anchorNode;
    if (container && anchor && container.contains(anchor)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelectionSnapshot() {
    const r = savedRangeRef.current;
    if (!r) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }

  function bubble() {
    const el = editorRef.current;
    const html = el?.innerHTML || "";
    setContent?.(html);
    saveSelectionSnapshot();
  }

  function execCommand(cmd, value) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    restoreSelectionSnapshot();
    try { document.execCommand("styleWithCSS", false, true); } catch {}

    switch (cmd) {
      case "formatBlock": {
        const tag = (value || "p").toUpperCase();
        if (!document.execCommand("formatBlock", false, tag)) {
          document.execCommand("formatBlock", false, `<${tag}>`);
        }
        break;
      }
      case "undo":
      case "redo":
      case "bold":
      case "italic":
      case "underline":
      case "strikeThrough":
      case "insertUnorderedList":
      case "justifyLeft":
      case "insertHorizontalRule":
        document.execCommand(cmd, false, null);
        break;
      case "createLink":
        if (value) {
          const url = String(value).match(/^https?:\/\//i) ? value : `https://${value}`;
          document.execCommand("createLink", false, url);
        }
        break;
      case "foreColor":
        if (value) document.execCommand("foreColor", false, value);
        break;
      case "fontSize":
        document.execCommand("fontSize", false, value || 3);
        break;
      case "insertImage":
        if (value) {
          const url = String(value).match(/^https?:\/\//i) ? value : `https://${value}`;
          document.execCommand("insertImage", false, url);
        }
        break;
      case "code": {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          const range = sel.getRangeAt(0).cloneRange();
          const node = document.createElement("code");
          node.appendChild(range.extractContents());
          range.insertNode(node);
          range.setStartAfter(node);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        break;
      }
      default:
        break;
    }
    bubble();
  }

  const showStarter = isTrulyEmpty();

  return (
    <section
      className="rounded-b-[12px] border border-t-0 border-[var(--border)] bg-white/70 px-6 md:px-8 py-6"
      aria-label="Editor canvas"
    >
      <h2 className="text-[26px] md:text-[28px] font-bold text-[var(--text-primary)] mb-4">
        {title}
      </h2>

      {/* Starter list — matches your screenshot */}
      {showStarter && (
        <div className="mb-6 text-[var(--text)]">
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[15px]">
              <FileText size={18} className="opacity-70" />
              <span>Empty page</span>
            </li>
            <li className="flex items-center gap-3 text-[15px]">
              <Sparkles size={18} className="opacity-70" />
              <span>Start with AI...</span>
            </li>
            <li className="flex items-center gap-3 text-[15px]">
              <ScrollText size={18} className="opacity-70" />
              <span>Generate content brief</span>
            </li>
            <li className="flex items-center gap-3 text-[15px]">
              <Link2 size={18} className="opacity-70" />
              <span>Import content from URL</span>
            </li>
            <li className="flex items-center gap-3 text-[15px]">
              <Shapes size={18} className="opacity-70" />
              <span>Import template</span>
            </li>
          </ul>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[420px] rounded-md border border-[var(--border)] bg-white px-4 py-4 leading-7 text-[15px] text-[var(--text)] focus:outline-none prose prose-p:my-3 prose-h1:text-2xl prose-h2:text-xl prose-ul:list-disc prose-ul:pl-6"
        onInput={bubble}
        onKeyUp={saveSelectionSnapshot}
        onMouseUp={saveSelectionSnapshot}
      />
    </section>
  );
});

export default CECanvas;
