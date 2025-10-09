"use client";

import React, { useRef, useState } from "react";
import {
  Menu,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code2,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  MessageSquare,
  SquareStack,
  ChevronDown,
  Dot,
  Paintbrush,
} from "lucide-react";

export default function CEToolbar({
  activeTab,
  onTabChange,
  lastEdited,
  editorRef,
}) {
  const [headOpen, setHeadOpen] = useState(false);
  const [insOpen, setInsOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [customSize, setCustomSize] = useState("");

  const colorInputRef = useRef(null);
  const highlightInputRef = useRef(null);

  const noFocus = (e) => e.preventDefault();
  const exec = (cmd, val) => editorRef?.current?.exec?.(cmd, val);

  const Tab = ({ id, children }) => {
    const is = activeTab === id;
    return (
      <button
        onClick={() => onTabChange?.(id)}
        className={`h-[34px] px-3 text-[13px] border-b-2 -mb-px transition-colors ${
          is
            ? "border-black text-black font-medium"
            : "border-transparent text-gray-500 hover:text-black"
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
      className="h-7 w-7 grid place-items-center rounded hover:bg-gray-100 text-gray-700"
    >
      {children}
    </button>
  );

  const pxToLegacy = (px) =>
    px <= 12 ? 2 : px <= 14 ? 3 : px <= 16 ? 4 : px <= 18 ? 5 : 6;

  const textSizes = [12, 14, 16, 18, 20, 24];

  // ---- Color handlers ----
  let colorPreviewTimer;
  const handleColorDrag = (type, val) => {
    if (!val) return;
    clearTimeout(colorPreviewTimer);
    colorPreviewTimer = setTimeout(() => {
      exec(`${type}_preview`, val);
    }, 30); // fast throttle
  };

  const handleColorCommit = (type, val) => {
    exec(type, val);
  };

  const openColorPicker = (ref, type) => {
    exec("saveSelection");
    setTimeout(() => ref.current?.click(), 30);
  };

  return (
    <div className="w-full bg-white/70 border border-[var(--border)] border-b-0 border-r-0 rounded-tl-[12px]">
      {/* Tabs Row */}
      <div className="flex items-center justify-between px-2 pt-[3px]">
        <div className="flex items-center gap-1">
          <IconBtn title="Menu" onClick={() => console.log("Menu clicked")}>
            <Menu size={15} />
          </IconBtn>

          <Tab id="content">Content</Tab>
          <Tab id="summary">Article Summary</Tab>
          <Tab id="final">Final Content</Tab>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pr-2">
          <span>Edited {lastEdited}</span>
          <SquareStack size={13} className="opacity-70" />
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center gap-[2px] px-2 py-[3px] border-t border-[var(--border)] bg-white/70">
        {/* Undo / Redo */}
        <IconBtn title="Undo" onClick={() => exec("undo")}>
          <Undo2 size={14} />
        </IconBtn>
        <IconBtn title="Redo" onClick={() => exec("redo")}>
          <Redo2 size={14} />
        </IconBtn>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Heading Dropdown */}
        <div className="relative">
          <button
            className="px-2 h-7 rounded border border-[var(--border)] text-[13px] hover:bg-gray-100 inline-flex items-center gap-1"
            onMouseDown={noFocus}
            onClick={() => setHeadOpen((s) => !s)}
          >
            Heading 3 <ChevronDown size={12} />
          </button>
          {headOpen && (
            <div className="absolute z-10 mt-1 min-w-[150px] rounded-md border border-[var(--border)] bg-white shadow-sm">
              {[
                { label: "Paragraph", block: "p" },
                { label: "Heading 1", block: "h1" },
                { label: "Heading 2", block: "h2" },
                { label: "Heading 3", block: "h3" },
              ].map((it) => (
                <button
                  key={it.block}
                  className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-100"
                  onMouseDown={noFocus}
                  onClick={() => {
                    exec("formatBlock", it.block);
                    setHeadOpen(false);
                  }}
                >
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Inline formatting */}
        <IconBtn title="Bold" onClick={() => exec("bold")}>
          <Bold size={14} />
        </IconBtn>
        <IconBtn title="Italic" onClick={() => exec("italic")}>
          <Italic size={14} />
        </IconBtn>
        <IconBtn title="Underline" onClick={() => exec("underline")}>
          <Underline size={14} />
        </IconBtn>
        <IconBtn title="Strikethrough" onClick={() => exec("strikeThrough")}>
          <Strikethrough size={14} />
        </IconBtn>
        <IconBtn title="Inline code" onClick={() => exec("code")}>
          <Code2 size={14} />
        </IconBtn>

        {/* Link */}
        <IconBtn
          title="Insert Link"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) exec("createLink", url);
          }}
        >
          <LinkIcon size={14} />
        </IconBtn>

        {/* Alignment + Lists */}
        <IconBtn title="Align left" onClick={() => exec("justifyLeft")}>
          <AlignLeft size={14} />
        </IconBtn>
        <IconBtn title="Align center" onClick={() => exec("justifyCenter")}>
          <AlignCenter size={14} />
        </IconBtn>
        <IconBtn title="Align right" onClick={() => exec("justifyRight")}>
          <AlignRight size={14} />
        </IconBtn>
        <IconBtn title="Bulleted List" onClick={() => exec("insertUnorderedList")}>
          <List size={14} />
        </IconBtn>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Text color */}
        <IconBtn title="Text color" onClick={() => openColorPicker(colorInputRef, "foreColor")}>
          <Dot size={14} />
        </IconBtn>
        <input
          ref={colorInputRef}
          type="color"
          className="hidden"
          onInput={(e) => handleColorDrag("foreColor", e.target.value)}
          onChange={(e) => handleColorCommit("foreColor", e.target.value)}
        />

        {/* Highlight */}
        <IconBtn
          title="Highlight color"
          onClick={() => openColorPicker(highlightInputRef, "hiliteColor")}
        >
          <Paintbrush size={14} />
        </IconBtn>
        <input
          ref={highlightInputRef}
          type="color"
          className="hidden"
          onInput={(e) => handleColorDrag("hiliteColor", e.target.value)}
          onChange={(e) => handleColorCommit("hiliteColor", e.target.value)}
        />

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Insert */}
        <div className="relative">
          <button
            className="px-2 h-7 rounded border border-[var(--border)] text-[13px] hover:bg-gray-100 inline-flex items-center gap-1"
            onMouseDown={noFocus}
            onClick={() => setInsOpen((s) => !s)}
          >
            Insert <ChevronDown size={12} />
          </button>
          {insOpen && (
            <div className="absolute z-10 mt-1 min-w-[160px] rounded-md border border-[var(--border)] bg-white shadow-sm">
              <button
                className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-100"
                onMouseDown={noFocus}
                onClick={() => {
                  exec("insertHorizontalRule");
                  setInsOpen(false);
                }}
              >
                Horizontal Rule
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-100"
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
                className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-100"
                onMouseDown={noFocus}
                onClick={() => {
                  exec("formatBlock", "blockquote");
                  setInsOpen(false);
                }}
              >
                Quote
              </button>
            </div>
          )}
        </div>

        {/* Text size (dropdown + custom input) */}
        <div className="relative">
          <button
            title="Text size"
            onMouseDown={noFocus}
            onClick={() => setSizeOpen((s) => !s)}
            className="ml-1 h-7 px-1.5 rounded hover:bg-gray-100 text-gray-700 text-[12px] font-medium inline-flex items-center gap-1"
          >
            T<span className="text-[10px] align-super">x</span> <ChevronDown size={12} />
          </button>

          {sizeOpen && (
            <div className="absolute z-10 mt-1 min-w-[130px] rounded-md border border-[var(--border)] bg-white shadow-sm p-1">
              {textSizes.map((px) => (
                <button
                  key={px}
                  className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-100"
                  onMouseDown={noFocus}
                  onClick={() => {
                    exec("fontSizePx", px);
                    setSizeOpen(false);
                  }}
                >
                  {px}px
                </button>
              ))}

              <div className="border-t border-gray-200 my-1" />
              <div className="flex items-center gap-1 px-2 pb-1">
                <input
                  type="number"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="Custom"
                  className="w-[60px] border border-gray-200 rounded px-1 text-[12px]"
                />
                <button
                  onClick={() => {
                    if (customSize) {
                      exec("fontSizePx", Number(customSize));
                      setCustomSize("");
                      setSizeOpen(false);
                    }
                  }}
                  className="text-[12px] px-1.5 py-[2px] border border-gray-300 rounded hover:bg-gray-100"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comment (placeholder) */}
        <IconBtn title="Comment">
          <MessageSquare size={14} />
        </IconBtn>
      </div>
    </div>
  );
}
