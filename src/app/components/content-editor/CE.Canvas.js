"use client";

import React, { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { FileText, Sparkles, ScrollText, Link2, Shapes } from "lucide-react";

const CECanvas = forwardRef(function CECanvas(
  { title = "Untitled", content = "", setContent },
  ref
) {
  const editorRef = useRef(null);

  // ---- selection, history, autosave ----
  const savedRangeRef = useRef(null);
  const undoStack = useRef([]);   // array of HTML strings
  const redoStack = useRef([]);   // array of HTML strings
  const seededRef = useRef(false);

  const autosaveTimer = useRef(null);
  const AUTOSAVE_MS = 800;
  const AUTOSAVE_KEY = `ce:autosave:${title || "untitled"}`;

  // ---- helpers ----
  function sanitizeToHtml(input) {
    const str = String(input || "");
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(str);
    if (looksLikeHtml) return str;
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return str.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, "<br/>")}</p>`).join("");
  }

  const isTrulyEmpty = () => {
    const plain = String(content || "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    return plain.length === 0;
  };

  // mount: hydrate editor, seed history, try restore autosave
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    if (isTrulyEmpty()) {
      const saved = typeof window !== "undefined" ? localStorage.getItem(AUTOSAVE_KEY) : null;
      if (saved) {
        el.innerHTML = saved;
        setContent?.(saved);
      }
    } else {
      const html = sanitizeToHtml(content);
      if (el.innerHTML !== html) el.innerHTML = html;
    }

    if (!seededRef.current) {
      undoStack.current = [el.innerHTML];
      redoStack.current = [];
      seededRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // external content changes (if any) -> sync & seed history
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = sanitizeToHtml(content);
    if (el.innerHTML !== html) {
      el.innerHTML = html;
      if (seededRef.current) {
        undoStack.current.push(html);
        redoStack.current = [];
      }
    }
  }, [content]);

  useImperativeHandle(ref, () => ({
    exec: (cmd, value) => execCommand(cmd, value),
  }));

  // ---- selection management ----
  function saveSelectionSnapshot() {
    const sel = window.getSelection?.();
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
    const sel = window.getSelection?.();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(r);
  }

  // ---- autosave ----
  function scheduleAutosave(html) {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, html);
      } catch {}
    }, AUTOSAVE_MS);
  }

  // bubble changes upward, optionally pushing history & notifying parent
  function bubble({ pushHistory = true, notifyParent = true } = {}) {
    const el = editorRef.current;
    const html = el?.innerHTML || "";
    if (notifyParent) setContent?.(html);

    if (pushHistory) {
      const last = undoStack.current[undoStack.current.length - 1];
      if (last !== html) {
        undoStack.current.push(html);
        redoStack.current = []; // new edit invalidates redo
      }
    }

    scheduleAutosave(html);
    saveSelectionSnapshot();
  }

  // ---- coloring / highlight ----
  function applyHilite(value) {
    let ok = false;
    try { ok = document.execCommand("hiliteColor", false, value); } catch {}
    if (!ok) {
      try { document.execCommand("backColor", false, value); } catch {}
    }
  }

  // ---- exact px font-size ----
  function setFontSizePx(px) {
    const sel = window.getSelection?.();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = `${px}px`;

    if (range.collapsed) {
      // insert placeholder char inside a styled span so typing continues at that size
      span.appendChild(document.createTextNode("\u200D"));
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.setStart(span.firstChild, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      try {
        range.surroundContents(span);
      } catch {
        const frag = range.extractContents();
        span.appendChild(frag);
        range.insertNode(span);
      }
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }

  // ---- main command switch ----
  function execCommand(cmd, value) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    // keep the last user selection active for toolbar-triggered commands
    restoreSelectionSnapshot();
    try { document.execCommand("styleWithCSS", false, true); } catch {}

    switch (cmd) {
      // selection utilities (call from toolbar before opening color pickers)
      case "saveSelection":
        saveSelectionSnapshot();
        return;

      // history
      case "undo": {
        if (undoStack.current.length > 1) {
          const current = undoStack.current.pop();
          redoStack.current.push(current);
          const prev = undoStack.current[undoStack.current.length - 1];
          el.innerHTML = prev;
          setContent?.(prev);
          scheduleAutosave(prev);
          saveSelectionSnapshot();
        }
        return;
      }
      case "redo": {
        if (redoStack.current.length > 0) {
          const next = redoStack.current.pop();
          undoStack.current.push(next);
          el.innerHTML = next;
          setContent?.(next);
          scheduleAutosave(next);
          saveSelectionSnapshot();
        }
        return;
      }

      // paragraph / alignment / lists
      case "justifyLeft":
      case "justifyCenter":
      case "justifyRight":
      case "justifyFull":
      case "insertUnorderedList":
      case "insertHorizontalRule":
        document.execCommand(cmd, false, null);
        break;

      case "formatBlock": {
        const tag = (value || "p").toUpperCase();
        if (!document.execCommand("formatBlock", false, `<${tag}>`)) {
          document.execCommand("formatBlock", false, tag);
        }
        break;
      }

      // inline styles
      case "bold":
      case "italic":
      case "underline":
      case "strikeThrough":
        document.execCommand(cmd, false, null);
        break;

      case "code": {
        const sel = window.getSelection?.();
        if (sel && sel.rangeCount) {
          const range = sel.getRangeAt(0).cloneRange();
          // toggle if inside <code>
          let n = range.startContainer;
          while (n && n !== el) {
            if (n.nodeType === 1 && n.nodeName === "CODE") {
              const codeEl = n;
              const parent = codeEl.parentNode;
              while (codeEl.firstChild) parent.insertBefore(codeEl.firstChild, codeEl);
              parent.removeChild(codeEl);
              bubble({ pushHistory: true, notifyParent: true });
              return;
            }
            n = n.parentNode;
          }
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

      // colors (final commit)
      case "foreColor":
        if (value) document.execCommand("foreColor", false, value);
        break;
      case "hiliteColor":
      case "highlight":
        if (value) applyHilite(value);
        break;

      // fast preview while dragging the picker (no history, no setContent)
      case "foreColor_preview":
        if (value) document.execCommand("foreColor", false, value);
        bubble({ pushHistory: false, notifyParent: false });
        return;
      case "hiliteColor_preview":
        if (value) applyHilite(value);
        bubble({ pushHistory: false, notifyParent: false });
        return;

      // font sizes
      case "fontSize":
        // legacy scale 1..7 (toolbar maps presets to this)
        document.execCommand("fontSize", false, value || 3);
        break;
      case "fontSizePx":
        if (value) setFontSizePx(Number(value));
        break;

      // links / media
      case "createLink":
        if (value) {
          const url = String(value).match(/^https?:\/\//i) ? value : `https://${value}`;
          document.execCommand("createLink", false, url);
        }
        break;
      case "insertImage":
        if (value) {
          const url = String(value).match(/^https?:\/\//i) ? value : `https://${value}`;
          document.execCommand("insertImage", false, url);
        }
        break;

      default:
        break;
    }

    // default: push to history & notify parent
    bubble({ pushHistory: true, notifyParent: true });
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
        onInput={() => bubble({ pushHistory: true, notifyParent: true })}
        onKeyUp={saveSelectionSnapshot}
        onMouseUp={saveSelectionSnapshot}
      />
    </section>
  );
});

export default CECanvas;
