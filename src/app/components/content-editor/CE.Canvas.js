"use client";

import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from "react";

const CECanvas = forwardRef(function CECanvas(
  { title = "Untitled", content = "", setContent },
  ref
) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null); // remember selection inside the editor

  // Convert plain text once; reuse HTML as-is
  function sanitizeToHtml(input) {
    const str = String(input || "");
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(str);
    if (looksLikeHtml) return str;
    const esc = (s) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return str
      .split(/\n{2,}/)
      .map((p) => `<p>${esc(p).replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }

  // Set initial / external content directly on the DOM node.
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = sanitizeToHtml(content);
    if (el.innerHTML !== html) el.innerHTML = html;
  }, [content]);

  // Expose a command API to the toolbar.
  useImperativeHandle(ref, () => ({
    exec: (cmd, value) => execCommand(cmd, value),
  }));

  // Save selection whenever the user changes it inside the editor
  function saveSelectionSnapshot() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const container = editorRef.current;
    const anchor = sel.anchorNode;
    // Only store if selection lives inside our editor
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

  function saveBack() {
    const el = editorRef.current;
    const htmlNow = el?.innerHTML || "";
    // Do NOT set component state here—just bubble up to parent;
    // this keeps caret & undo stack intact.
    setContent?.(htmlNow);
    // Keep latest selection after DOM mutations
    saveSelectionSnapshot();
  }

  // Robust execCommand with selection restore and common commands
  function execCommand(cmd, value) {
    const el = editorRef.current;
    if (!el) return;

    // Ensure focus and restore the last in-editor selection
    el.focus();
    restoreSelectionSnapshot();

    // Some browsers need this to get CSS styling for foreColor/fontSize
    try {
      document.execCommand("styleWithCSS", false, true);
    } catch {}

    switch (cmd) {
      case "formatBlock": {
        // Try both modern and legacy values for broader support
        const tag = (value || "p").toUpperCase();
        if (!document.execCommand("formatBlock", false, tag)) {
          document.execCommand("formatBlock", false, `<${tag}>`);
        }
        break;
      }
      case "undo":
      case "redo":
        document.execCommand(cmd, false, null);
        break;

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
        document.execCommand("fontSize", false, value || 3); // legacy 1..7 scale
        break;

      case "insertImage":
        if (value) {
          const url = String(value).match(/^https?:\/\//i) ? value : `https://${value}`;
          document.execCommand("insertImage", false, url);
        }
        break;

      case "code": {
        // Inline <code> wrapper for current selection
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

    // Persist after command
    saveBack();
  }

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
      <h2 className="text-[26px] md:text-[28px] font-bold text-[var(--text-primary)] mb-4">
        {title}
      </h2>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="
          min-h-[420px]
          rounded-md border border-[var(--border)]
          bg-white p-4 text-[14px] leading-7
          focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
          prose prose-neutral max-w-none
        "
        onInput={saveBack}
        onKeyUp={saveSelectionSnapshot}
        onMouseUp={saveSelectionSnapshot}
      />
    </section>
  );
});

export default CECanvas;
