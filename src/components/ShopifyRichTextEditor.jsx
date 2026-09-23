"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Table as TableIcon,
  MoreHorizontal,
  Code,
  Quote,
  Minus,
  RemoveFormatting,
  X,
  Check,
} from "lucide-react";

/**
 * Normalizes initial value (HTML or plain text) for display inside contentEditable.
 * Plain text with newlines is cleanly converted to <p> paragraphs so it doesn't collapse.
 */
function normalizeHtmlForEditor(val) {
  if (!val || typeof val !== "string") return "";
  const trimmed = val.trim();
  if (!trimmed) return "";

  // If already contains HTML markup, return as-is
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }

  // Convert plain text into standard HTML paragraphs
  const paragraphs = trimmed
    .split(/\r?\n\r?\n+/)
    .map((block) => {
      const cleanBlock = block.trim();
      if (!cleanBlock) return "";
      const withBr = cleanBlock.split(/\r?\n/).join("<br>");
      return `<p>${withBr}</p>`;
    })
    .filter(Boolean);

  return paragraphs.length > 0 ? paragraphs.join("") : `<p>${trimmed}</p>`;
}

export default function ShopifyRichTextEditor({
  value = "",
  onChange,
  placeholder = "Write a detailed product description, key features, and specifications...",
  className = "",
}) {
  const editorRef = useRef(null);
  const internalHtml = useRef(null); // Initialize to null so first mount ALWAYS populates innerHTML
  const [isCodeView, setIsCodeView] = useState(false);
  const [activeBlock, setActiveBlock] = useState("Paragraph");
  const [isFocused, setIsFocused] = useState(false);

  // Dropdown states
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [listMenuOpen, setListMenuOpen] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  // Modal / prompt states
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const [mediaModalOpen, setMediaModalOpen] = useState(null); // 'image' | 'video' | null
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  // Sync value from outside if it differs from current internal HTML or on initial mount
  useEffect(() => {
    if (!editorRef.current) return;
    if (internalHtml.current === null || value !== internalHtml.current) {
      const normalized = normalizeHtmlForEditor(value);
      editorRef.current.innerHTML = normalized;
      internalHtml.current = value || "";
    }
  }, [value, isCodeView]);

  // Handle typing & edits
  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    internalHtml.current = html;
    if (onChange) {
      onChange(html);
    }
  }, [onChange]);

  const updateActiveBlock = () => {
    if (typeof document === "undefined") return;
    try {
      const block = document.queryCommandValue("formatBlock");
      if (block) {
        const b = String(block).toLowerCase();
        if (b === "h1") setActiveBlock("Heading 1");
        else if (b === "h2") setActiveBlock("Heading 2");
        else if (b === "h3") setActiveBlock("Heading 3");
        else if (b === "h4") setActiveBlock("Heading 4");
        else setActiveBlock("Paragraph");
      }
    } catch {}
  };

  // Execute standard formatting command
  const executeCommand = (command, val = null) => {
    if (isCodeView) return;
    document.execCommand(command, false, val);
    handleContentChange();
    if (editorRef.current) {
      editorRef.current.focus();
    }
    updateActiveBlock();
  };

  // Block format (Paragraph, Heading 1, 2, 3, etc.)
  const handleBlockFormat = (tag, label) => {
    executeCommand("formatBlock", `<${tag}>`);
    setActiveBlock(label);
    setFormatMenuOpen(false);
  };

  // Text color palette
  const textColors = [
    { label: "Default Dark", color: "#111827" },
    { label: "Muted Slate", color: "#64748b" },
    { label: "Tech Blue", color: "#2563eb" },
    { label: "Emerald Green", color: "#059669" },
    { label: "Rose Red", color: "#e11d48" },
    { label: "Amber Orange", color: "#d97706" },
    { label: "Violet Purple", color: "#7c3aed" },
  ];

  const handleTextColor = (color) => {
    executeCommand("foreColor", color);
    setColorMenuOpen(false);
  };

  // Insert Link
  const handleInsertLink = (e) => {
    e.preventDefault();
    if (!linkUrl) return;
    const formattedUrl = linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
      ? linkUrl
      : `https://${linkUrl}`;

    if (linkText) {
      const linkHtml = `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      executeCommand("insertHTML", linkHtml);
    } else {
      executeCommand("createLink", formattedUrl);
    }

    setLinkUrl("");
    setLinkText("");
    setLinkModalOpen(false);
  };

  // Insert Image
  const handleInsertImage = (e) => {
    e.preventDefault();
    if (!mediaUrl) return;
    const imgHtml = `<img src="${mediaUrl}" alt="${mediaAlt || "Product image"}" style="max-width:100%; height:auto; border-radius:8px; margin:16px 0;" />`;
    executeCommand("insertHTML", imgHtml);
    setMediaUrl("");
    setMediaAlt("");
    setMediaModalOpen(null);
  };

  // Insert Video (YouTube embed)
  const handleInsertVideo = (e) => {
    e.preventDefault();
    if (!mediaUrl) return;
    let embedUrl = mediaUrl;

    // Convert standard youtube link to embed link
    const ytMatch = mediaUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const videoHtml = `
      <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; margin:16px 0;">
        <iframe src="${embedUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>
      </div>
    `;
    executeCommand("insertHTML", videoHtml);
    setMediaUrl("");
    setMediaModalOpen(null);
  };

  // Insert Table
  const insertTable = (rows, cols, isSpecs = false) => {
    let tableHtml = `<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:14px;"><tbody>`;
    if (isSpecs) {
      tableHtml = `
        <table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:14px; border:1px solid #e5e7eb;">
          <thead>
            <tr style="background-color:#f9fafb; border-bottom:2px solid #e5e7eb;">
              <th style="padding:10px 14px; text-align:left; font-weight:600; color:#111827;">Specification</th>
              <th style="padding:10px 14px; text-align:left; font-weight:600; color:#111827;">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px 14px; font-weight:500;">Brand / Model</td><td style="padding:8px 14px;">Pro Edition</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px 14px; font-weight:500;">Connectivity</td><td style="padding:8px 14px;">Wireless / Bluetooth 5.3</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px 14px; font-weight:500;">Battery Life</td><td style="padding:8px 14px;">Up to 30 Hours</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px 14px; font-weight:500;">Warranty</td><td style="padding:8px 14px;">1 Year Official Replacement</td></tr>
          </tbody>
        </table><p></p>
      `;
    } else {
      for (let r = 0; r < rows; r++) {
        tableHtml += `<tr style="border-bottom:1px solid #e5e7eb;">`;
        for (let c = 0; c < cols; c++) {
          tableHtml += `<td style="border:1px solid #e5e7eb; padding:8px 12px;">Cell ${r + 1},${c + 1}</td>`;
        }
        tableHtml += `</tr>`;
      }
      tableHtml += `</tbody></table><p></p>`;
    }

    executeCommand("insertHTML", tableHtml);
    setTableMenuOpen(false);
  };

  // AI Templates
  const applyAiTemplate = (type) => {
    let templateHtml = "";
    if (type === "full") {
      templateHtml = `
<p>Crafted with premium materials and cutting-edge engineering, this product delivers exceptional performance and unmatched reliability for everyday use. Designed to blend seamlessly into your setup while offering professional-grade durability.</p>
<h3>Key Features</h3>
<ul>
  <li><strong>Engineered for Performance:</strong> Built with high-grade components ensuring long-lasting efficiency and rapid response.</li>
  <li><strong>Ergonomic & Modern Aesthetics:</strong> Sleek minimalist profile that elevates your workspace and comfort.</li>
  <li><strong>Universal Compatibility:</strong> Works seamlessly across multiple operating systems and modern devices.</li>
  <li><strong>All-Day Endurance:</strong> Optimized power management providing continuous, worry-free operation.</li>
</ul>
<h3>Technical Specifications</h3>
<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:14px; border:1px solid #e5e7eb;">
  <thead>
    <tr style="background-color:#f9fafb; border-bottom:2px solid #e5e7eb;">
      <th style="padding:10px 14px; text-align:left; font-weight:600; color:#111827;">Feature</th>
      <th style="padding:10px 14px; text-align:left; font-weight:600; color:#111827;">Specification</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px 14px; font-weight:500;">Build Quality</td><td style="padding:8px 14px;">Aerospace-grade Aluminum & Matte Polymer</td></tr>
    <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px 14px; font-weight:500;">Connection</td><td style="padding:8px 14px;">Ultra-low latency 2.4GHz & USB Type-C</td></tr>
    <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px 14px; font-weight:500;">Warranty</td><td style="padding:8px 14px;">12 Months Manufacturer Warranty</td></tr>
  </tbody>
</table>
<h3>What's in the Box</h3>
<ul>
  <li>1 x Premium Device</li>
  <li>1 x High-speed Braided Type-C Cable</li>
  <li>1 x User Manual & Warranty Card</li>
</ul>
<p></p>`;
    } else if (type === "features") {
      templateHtml = `
<h3>Key Highlights & Features</h3>
<ul>
  <li><strong>Superior Build Quality:</strong> Rigorously tested for durability, heat dissipation, and long lifespan.</li>
  <li><strong>Seamless Connectivity:</strong> Instant pairing with minimal latency for high-demand workflows.</li>
  <li><strong>Energy Efficient:</strong> Smart standby mode saves power and extends operating cycles.</li>
  <li><strong>Certified Safety:</strong> Multi-layer circuit protection against over-voltage and short-circuits.</li>
</ul>
<p></p>`;
    } else if (type === "specs") {
      insertTable(0, 0, true);
      setAiMenuOpen(false);
      return;
    } else if (type === "box") {
      templateHtml = `
<h3>What's In The Box</h3>
<ul>
  <li>1 x Main Product Unit</li>
  <li>1 x Fast Charging Adapter & Cable</li>
  <li>1 x Quick Start Guide</li>
  <li>1 x Official Warranty Certificate</li>
</ul>
<p></p>`;
    }

    executeCommand("insertHTML", templateHtml);
    setAiMenuOpen(false);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!e.target.closest(".shopify-editor-toolbar")) {
        setFormatMenuOpen(false);
        setColorMenuOpen(false);
        setListMenuOpen(false);
        setTableMenuOpen(false);
        setMoreMenuOpen(false);
        setAiMenuOpen(false);
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // Compute Word & Character counts
  const textContent = (value || "").replace(/<[^>]+>/g, " ").trim();
  const wordCount = textContent ? textContent.split(/\s+/).filter(Boolean).length : 0;
  const charCount = textContent.length;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white ${
        isFocused
          ? "border-indigo-400 ring-2 ring-indigo-500/10 shadow-sm"
          : "border-slate-200 shadow-xs"
      } ${className}`}
    >
      {/* ============================================================== */}
      {/* SHOPIFY STYLE TOOLBAR                                         */}
      {/* ============================================================== */}
      <div className="shopify-editor-toolbar flex items-center justify-between flex-wrap gap-1 px-3 py-2 bg-slate-50/90 border-b border-slate-200 rounded-t-2xl relative select-none">
        
        {/* Left Toolbar Items */}
        <div className="flex items-center flex-wrap gap-1">
          
          {/* 1. AI Sparkle Button */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAiMenuOpen(!aiMenuOpen);
              }}
              title="Smart AI Templates"
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                aiMenuOpen
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </button>

            {aiMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Smart Content Templates
                </div>
                <button
                  type="button"
                  onClick={() => applyAiTemplate("full")}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Complete Product Description
                </button>
                <button
                  type="button"
                  onClick={() => applyAiTemplate("features")}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <List className="w-3.5 h-3.5 text-indigo-500" /> Key Features & Highlights
                </button>
                <button
                  type="button"
                  onClick={() => applyAiTemplate("specs")}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <TableIcon className="w-3.5 h-3.5 text-indigo-500" /> Specifications Table
                </button>
                <button
                  type="button"
                  onClick={() => applyAiTemplate("box")}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Quote className="w-3.5 h-3.5 text-indigo-500" /> "What's In The Box" Section
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 2. Format Dropdown (Paragraph, Heading 1, 2, 3...) */}
          <div className="relative">
            <button
              type="button"
              disabled={isCodeView}
              onClick={(e) => {
                e.stopPropagation();
                setFormatMenuOpen(!formatMenuOpen);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/70 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <span>{activeBlock}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {formatMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => handleBlockFormat("p", "Paragraph")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-normal text-slate-800 flex items-center justify-between"
                >
                  <span>Paragraph</span>
                  {activeBlock === "Paragraph" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleBlockFormat("h1", "Heading 1")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-bold text-slate-900 text-sm flex items-center justify-between"
                >
                  <span>Heading 1</span>
                  {activeBlock === "Heading 1" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleBlockFormat("h2", "Heading 2")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-bold text-slate-900 flex items-center justify-between"
                >
                  <span>Heading 2</span>
                  {activeBlock === "Heading 2" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleBlockFormat("h3", "Heading 3")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-semibold text-slate-800 flex items-center justify-between"
                >
                  <span>Heading 3</span>
                  {activeBlock === "Heading 3" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleBlockFormat("h4", "Heading 4")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-semibold text-slate-700 text-[11px] flex items-center justify-between"
                >
                  <span>Heading 4</span>
                  {activeBlock === "Heading 4" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 3. Bold (B) */}
          <button
            type="button"
            disabled={isCodeView}
            onClick={() => executeCommand("bold")}
            title="Bold (Ctrl+B)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* 4. Italic (I) */}
          <button
            type="button"
            disabled={isCodeView}
            onClick={() => executeCommand("italic")}
            title="Italic (Ctrl+I)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* 5. Underline (U) */}
          <button
            type="button"
            disabled={isCodeView}
            onClick={() => executeCommand("underline")}
            title="Underline (Ctrl+U)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Underline className="w-4 h-4" />
          </button>

          {/* 6. Text Color (A ⌵) */}
          <div className="relative">
            <button
              type="button"
              disabled={isCodeView}
              onClick={(e) => {
                e.stopPropagation();
                setColorMenuOpen(!colorMenuOpen);
              }}
              title="Text Color"
              className="px-2 py-1.5 rounded-lg flex items-center gap-1 text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
            >
              <div className="flex flex-col items-center leading-none">
                <span className="font-bold text-xs">A</span>
                <span className="w-3 h-0.5 bg-indigo-600 rounded-full mt-0.5" />
              </div>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {colorMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 p-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1 w-40">
                <span className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                  Text Color
                </span>
                {textColors.map(({ label, color }) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleTextColor(color)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 text-xs text-left cursor-pointer"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-200 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-slate-700">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 7. Lists & Alignment (≡ ⌵) */}
          <div className="relative">
            <button
              type="button"
              disabled={isCodeView}
              onClick={(e) => {
                e.stopPropagation();
                setListMenuOpen(!listMenuOpen);
              }}
              title="Lists & Alignment"
              className="px-2 py-1.5 rounded-lg flex items-center gap-1 text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
            >
              <List className="w-4 h-4" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {listMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("insertUnorderedList");
                    setListMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <List className="w-4 h-4 text-slate-500" /> Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("insertOrderedList");
                    setListMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <ListOrdered className="w-4 h-4 text-slate-500" /> Numbered List
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("justifyLeft");
                    setListMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <AlignLeft className="w-4 h-4 text-slate-500" /> Align Left
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("justifyCenter");
                    setListMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <AlignCenter className="w-4 h-4 text-slate-500" /> Align Center
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("justifyRight");
                    setListMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <AlignRight className="w-4 h-4 text-slate-500" /> Align Right
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 8. Link (🔗) */}
          <button
            type="button"
            disabled={isCodeView}
            onClick={() => setLinkModalOpen(true)}
            title="Insert Link"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* 9. Image (🖼️) */}
          <button
            type="button"
            disabled={isCodeView}
            onClick={() => setMediaModalOpen("image")}
            title="Insert Image"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* 10. Video (▶️) */}
          <button
            type="button"
            disabled={isCodeView}
            onClick={() => setMediaModalOpen("video")}
            title="Insert Video (YouTube)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* 11. Table (⊞ ⌵) */}
          <div className="relative">
            <button
              type="button"
              disabled={isCodeView}
              onClick={(e) => {
                e.stopPropagation();
                setTableMenuOpen(!tableMenuOpen);
              }}
              title="Insert Table"
              className="px-2 py-1.5 rounded-lg flex items-center gap-1 text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
            >
              <TableIcon className="w-4 h-4" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {tableMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => insertTable(0, 0, true)}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-800 font-semibold cursor-pointer"
                >
                  <TableIcon className="w-4 h-4 text-indigo-600" /> Specifications Table
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  type="button"
                  onClick={() => insertTable(2, 2)}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  2 × 2 Grid
                </button>
                <button
                  type="button"
                  onClick={() => insertTable(3, 3)}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  3 × 3 Grid
                </button>
                <button
                  type="button"
                  onClick={() => insertTable(4, 2)}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  4 × 2 Grid
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 12. More Options (...) */}
          <div className="relative">
            <button
              type="button"
              disabled={isCodeView}
              onClick={(e) => {
                e.stopPropagation();
                setMoreMenuOpen(!moreMenuOpen);
              }}
              title="More Options"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {moreMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("formatBlock", "<blockquote>");
                    setMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <Quote className="w-4 h-4 text-slate-500" /> Blockquote
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("insertHorizontalRule");
                    setMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <Minus className="w-4 h-4 text-slate-500" /> Horizontal Rule
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("removeFormat");
                    setMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-rose-600 cursor-pointer font-medium"
                >
                  <RemoveFormatting className="w-4 h-4" /> Clear Formatting
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Toolbar Item: 13. HTML / Code View Toggle (</>) */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (isCodeView && editorRef.current) {
                // Switching from Code to Visual
                editorRef.current.innerHTML = value || "";
              }
              setIsCodeView(!isCodeView);
            }}
            title={isCodeView ? "Show Visual Editor" : "Show HTML Code (<>)"}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isCodeView
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{isCodeView ? "Visual" : "</>"}</span>
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* EDITOR CONTENT VIEWPORT                                       */}
      {/* ============================================================== */}
      <div className="relative">
        {isCodeView ? (
          /* HTML Code Editor View */
          <textarea
            value={value || ""}
            onChange={(e) => {
              internalHtml.current = e.target.value;
              if (onChange) onChange(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={10}
            placeholder="<p>Write your raw HTML here...</p>"
            className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50/50 outline-none resize-y min-h-55"
          />
        ) : (
          /* WYSIWYG Visual Editor View (Shopify .rte) */
          <>
            <div
              ref={editorRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onInput={handleContentChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyUp={updateActiveBlock}
              onMouseUp={updateActiveBlock}
              className="shopify-rte p-4 sm:p-5 outline-none min-h-55 max-h-125 overflow-y-auto text-sm text-[#2b2b2b]"
            />
            {/* Placeholder overlay when empty */}
            {(!value || value === "<p><br></p>" || value.trim() === "") && (
              <div
                onClick={() => {
                  if (editorRef.current) editorRef.current.focus();
                }}
                className="absolute top-5 left-5 text-slate-400 text-sm pointer-events-none select-none"
              >
                {placeholder}
              </div>
            )}
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* FOOTER BAR (Word Count & Status)                              */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50/60 border-t border-slate-100 rounded-b-2xl text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-500">
            {isCodeView ? "HTML Source Mode" : "Rich Text Editor"}
          </span>
          <span>•</span>
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>

        {value && value.trim() !== "" && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear all description content?")) {
                if (editorRef.current) editorRef.current.innerHTML = "";
                internalHtml.current = "";
                if (onChange) onChange("");
              }
            }}
            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* LINK INSERT MODAL                                             */}
      {/* ============================================================== */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form
            onSubmit={handleInsertLink}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 w-full max-w-sm space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-600" /> Insert Hyperlink
              </h3>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Link URL
              </label>
              <input
                type="text"
                autoFocus
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Display Text (Optional)
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. Visit Official Warranty Page"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!linkUrl}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Insert Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MEDIA (IMAGE / VIDEO) INSERT MODAL                            */}
      {/* ============================================================== */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form
            onSubmit={mediaModalOpen === "image" ? handleInsertImage : handleInsertVideo}
            className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 w-full max-w-sm space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {mediaModalOpen === "image" ? (
                  <>
                    <ImageIcon className="w-4 h-4 text-indigo-600" /> Insert Image
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 text-indigo-600" /> Embed Video
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setMediaModalOpen(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {mediaModalOpen === "image" ? "Image URL" : "YouTube / Video Link"}
              </label>
              <input
                type="text"
                autoFocus
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={
                  mediaModalOpen === "image"
                    ? "https://images.example.com/banner.jpg"
                    : "https://www.youtube.com/watch?v=..."
                }
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              />
            </div>

            {mediaModalOpen === "image" && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Alt Text / Caption
                </label>
                <input
                  type="text"
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  placeholder="e.g. Headphone side angle view"
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMediaModalOpen(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!mediaUrl}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
