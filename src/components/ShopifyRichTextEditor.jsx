"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
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
  Undo2,
  Redo2,
  Eye,
  Edit3,
  PlusCircle,
  Wand2,
  Layers,
  ShieldCheck,
  Smartphone,
  Cpu,
  Headphones,
  Shirt,
  Home,
  Zap,
  Trash2,
  Copy,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  TEMPLATE_CATEGORIES,
  MODULAR_BLOCKS,
  buildCompleteDescriptionHtml,
} from "@/components/description-templates/productTemplates";
import ProductDescription from "@/components/ProductDescription";

/**
 * Normalizes initial value (HTML or plain text) for display inside contentEditable.
 */
function normalizeHtmlForEditor(val) {
  if (!val || typeof val !== "string") return "";
  const trimmed = val.trim();
  if (!trimmed) return "";

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }

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

const CATEGORY_ICON_MAP = {
  Smartphone,
  Cpu,
  Headphones,
  Shirt,
  Home,
  Zap,
};

export default function ShopifyRichTextEditor({
  value = "",
  onChange,
  placeholder = "Write a comprehensive product description, highlights, and specifications...",
  className = "",
  productTitle = "",
  productCategory = "",
}) {
  const editorRef = useRef(null);
  const internalHtml = useRef(null);

  // View Mode: 'visual' | 'preview' | 'code'
  const [viewMode, setViewMode] = useState("visual");
  const [activeBlock, setActiveBlock] = useState("Paragraph");
  const [isFocused, setIsFocused] = useState(false);

  // Dropdown states
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [highlightMenuOpen, setHighlightMenuOpen] = useState(false);
  const [listMenuOpen, setListMenuOpen] = useState(false);
  const [tableMenuOpen, setTableMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [blockMenuOpen, setBlockMenuOpen] = useState(false);

  // Modals
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const [mediaModalOpen, setMediaModalOpen] = useState(null); // 'image' | 'video' | null
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");

  // Template Studio state
  const [selectedCategory, setSelectedCategory] = useState("electronics");
  const [templateForm, setTemplateForm] = useState({
    title: productTitle || "TechX Authentic Gear",
    brand: "TechX Official",
    tagline: "",
    features: [],
    specs: [],
    boxItems: [],
    warranty: "",
    faqs: [],
  });
  const [templatePreviewTab, setTemplatePreviewTab] = useState("customize"); // 'customize' | 'preview'

  // Initialize template form when category changes or modal opens
  const initTemplateForCategory = useCallback(
    (catId) => {
      const cat = TEMPLATE_CATEGORIES.find((c) => c.id === catId) || TEMPLATE_CATEGORIES[0];
      setSelectedCategory(cat.id);
      setTemplateForm({
        title: productTitle || "TechX Premium Product",
        brand: "TechX Authentic",
        tagline: cat.defaults.tagline,
        features: JSON.parse(JSON.stringify(cat.defaults.features)),
        specs: JSON.parse(JSON.stringify(cat.defaults.specs)),
        boxItems: [...cat.defaults.boxItems],
        warranty: cat.defaults.warranty,
        faqs: JSON.parse(JSON.stringify(cat.defaults.faqs)),
      });
    },
    [productTitle]
  );

  // Update title when productTitle prop arrives
  useEffect(() => {
    if (productTitle) {
      setTemplateForm((prev) => ({
        ...prev,
        title: productTitle,
      }));
    }
  }, [productTitle]);

  // Sync value from outside if it differs from current internal HTML
  useEffect(() => {
    if (!editorRef.current || viewMode !== "visual") return;
    if (internalHtml.current === null || value !== internalHtml.current) {
      const normalized = normalizeHtmlForEditor(value);
      editorRef.current.innerHTML = normalized;
      internalHtml.current = value || "";
    }
  }, [value, viewMode]);

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
    if (viewMode !== "visual") return;
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

  // Insert HTML into current editor position
  const insertHtmlAtCursor = (htmlToInsert) => {
    if (viewMode !== "visual") {
      // In code view, append or insert
      const updated = (value || "") + "\n" + htmlToInsert;
      internalHtml.current = updated;
      if (onChange) onChange(updated);
      return;
    }

    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("insertHTML", false, htmlToInsert);
    handleContentChange();
  };

  // Colors
  const textColors = [
    { label: "Default Slate", color: "#0f172a" },
    { label: "Muted Neutral", color: "#64748b" },
    { label: "Tech Blue", color: "#2563eb" },
    { label: "Emerald Green", color: "#059669" },
    { label: "Rose Red", color: "#e11d48" },
    { label: "Amber Orange", color: "#d97706" },
    { label: "Violet Purple", color: "#7c3aed" },
  ];

  const highlightColors = [
    { label: "None", color: "transparent" },
    { label: "Soft Yellow", color: "#fef08a" },
    { label: "Soft Emerald", color: "#bbf7d0" },
    { label: "Soft Blue", color: "#bfdbfe" },
    { label: "Soft Purple", color: "#e9d5ff" },
    { label: "Soft Rose", color: "#fecdd3" },
  ];

  // Insert Link
  const handleInsertLink = (e) => {
    e.preventDefault();
    if (!linkUrl) return;
    const formattedUrl =
      linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
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
    const imgHtml = `<img src="${mediaUrl}" alt="${mediaAlt || "Product image"}" style="max-width:100%; height:auto; border-radius:12px; margin:16px 0;" />`;
    insertHtmlAtCursor(imgHtml);
    setMediaUrl("");
    setMediaAlt("");
    setMediaModalOpen(null);
  };

  // Insert Video (YouTube embed)
  const handleInsertVideo = (e) => {
    e.preventDefault();
    if (!mediaUrl) return;
    let embedUrl = mediaUrl;

    const ytMatch = mediaUrl.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const videoHtml = `
<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:14px; margin:20px 0; border:1px solid #e2e8f0;">
  <iframe src="${embedUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>
</div>
<p></p>
`;
    insertHtmlAtCursor(videoHtml);
    setMediaUrl("");
    setMediaModalOpen(null);
  };

  // Insert Table
  const insertTable = (rows, cols, isSpecs = false) => {
    if (isSpecs) {
      const specBlock = MODULAR_BLOCKS.find((b) => b.id === "specs_table");
      if (specBlock) {
        insertHtmlAtCursor(specBlock.getHtml(productTitle));
      }
    } else {
      let tableHtml = `<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:14px;"><tbody>`;
      for (let r = 0; r < rows; r++) {
        tableHtml += `<tr style="border-bottom:1px solid #e2e8f0;">`;
        for (let c = 0; c < cols; c++) {
          tableHtml += `<td style="border:1px solid #e2e8f0; padding:10px 14px;">Cell ${r + 1},${c + 1}</td>`;
        }
        tableHtml += `</tr>`;
      }
      tableHtml += `</tbody></table><p></p>`;
      insertHtmlAtCursor(tableHtml);
    }
    setTableMenuOpen(false);
  };

  // Insert Modular Block
  const handleInsertModularBlock = (blockId) => {
    const block = MODULAR_BLOCKS.find((b) => b.id === blockId);
    if (block) {
      insertHtmlAtCursor(block.getHtml(productTitle));
      toast.success(`Inserted ${block.label}`);
    }
    setBlockMenuOpen(false);
  };

  // Apply Generated Complete Template
  const handleApplyTemplate = (mode = "replace") => {
    const generatedHtml = buildCompleteDescriptionHtml({
      title: templateForm.title,
      brand: templateForm.brand,
      category: selectedCategory,
      tagline: templateForm.tagline,
      features: templateForm.features,
      specs: templateForm.specs,
      boxItems: templateForm.boxItems,
      warranty: templateForm.warranty,
      faqs: templateForm.faqs,
    });

    if (mode === "replace") {
      internalHtml.current = generatedHtml;
      if (editorRef.current) {
        editorRef.current.innerHTML = generatedHtml;
      }
      if (onChange) onChange(generatedHtml);
      toast.success("Applied complete eCommerce template!");
    } else {
      insertHtmlAtCursor(generatedHtml);
      toast.success("Appended template to existing description!");
    }

    setTemplateModalOpen(false);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!e.target.closest(".shopify-editor-toolbar")) {
        setFormatMenuOpen(false);
        setColorMenuOpen(false);
        setHighlightMenuOpen(false);
        setListMenuOpen(false);
        setTableMenuOpen(false);
        setMoreMenuOpen(false);
        setBlockMenuOpen(false);
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // Compute Word & Character counts
  const textContent = (value || "").replace(/<[^>]+>/g, " ").trim();
  const wordCount = textContent ? textContent.split(/\s+/).filter(Boolean).length : 0;
  const charCount = textContent.length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  // Current generated preview in template studio
  const currentStudioHtml = buildCompleteDescriptionHtml({
    title: templateForm.title,
    brand: templateForm.brand,
    category: selectedCategory,
    tagline: templateForm.tagline,
    features: templateForm.features,
    specs: templateForm.specs,
    boxItems: templateForm.boxItems,
    warranty: templateForm.warranty,
    faqs: templateForm.faqs,
  });

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 bg-white ${
        isFocused
          ? "border-indigo-400 ring-4 ring-indigo-500/10 shadow-md"
          : "border-slate-200/90 shadow-xs"
      } ${className}`}
    >
      {/* ============================================================== */}
      {/* SHOPIFY STYLE TOOLBAR                                         */}
      {/* ============================================================== */}
      <div className="shopify-editor-toolbar flex items-center justify-between flex-wrap gap-1.5 px-3 py-2.5 bg-slate-50/90 border-b border-slate-200 rounded-t-3xl relative select-none">
        {/* Left Toolbar Items */}
        <div className="flex items-center flex-wrap gap-1">
          {/* 1. PRIMARY AI / TEMPLATE STUDIO BUTTON */}
          <button
            type="button"
            onClick={() => {
              initTemplateForCategory(selectedCategory);
              setTemplateModalOpen(true);
            }}
            title="Open Smart Templates & AI Writer Studio"
            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>Templates & AI Writer</span>
          </button>

          {/* 2. MODULAR BLOCK INSERT BUTTON */}
          <div className="relative">
            <button
              type="button"
              disabled={viewMode === "preview"}
              onClick={(e) => {
                e.stopPropagation();
                setBlockMenuOpen(!blockMenuOpen);
              }}
              title="Insert Pre-styled Modular Block"
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer disabled:opacity-40 shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Insert Block</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {blockMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100">
                <div className="px-3.5 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Quick Modular Blocks
                </div>
                <div className="p-1 space-y-0.5">
                  {MODULAR_BLOCKS.map((block) => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => handleInsertModularBlock(block.id)}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/80 rounded-xl flex items-center gap-2.5 cursor-pointer font-medium text-slate-700 hover:text-indigo-900 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        {block.id === "specs_table" && <TableIcon className="w-3.5 h-3.5" />}
                        {block.id === "feature_grid" && <Sparkles className="w-3.5 h-3.5" />}
                        {block.id === "box_checklist" && <Layers className="w-3.5 h-3.5" />}
                        {block.id === "warranty_badge" && <ShieldCheck className="w-3.5 h-3.5" />}
                        {block.id === "faq_section" && <Wand2 className="w-3.5 h-3.5" />}
                        {block.id === "pro_tip" && <Zap className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-[12px]">
                          {block.label}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal truncate max-w-44">
                          {block.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 3. History: Undo & Redo */}
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => executeCommand("undo")}
            title="Undo (Ctrl+Z)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-30"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => executeCommand("redo")}
            title="Redo (Ctrl+Y)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-30"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 4. Format Dropdown (Paragraph, Heading 1, 2, 3...) */}
          <div className="relative">
            <button
              type="button"
              disabled={viewMode !== "visual"}
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
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-normal text-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span>Paragraph</span>
                  {activeBlock === "Paragraph" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleBlockFormat("h1", "Heading 1")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-bold text-slate-900 text-sm flex items-center justify-between cursor-pointer"
                >
                  <span>Heading 1</span>
                  {activeBlock === "Heading 1" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleBlockFormat("h2", "Heading 2")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-bold text-slate-900 flex items-center justify-between cursor-pointer"
                >
                  <span>Heading 2</span>
                  {activeBlock === "Heading 2" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleBlockFormat("h3", "Heading 3")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span>Heading 3</span>
                  {activeBlock === "Heading 3" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleBlockFormat("h4", "Heading 4")}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 font-semibold text-slate-700 text-[11px] flex items-center justify-between cursor-pointer"
                >
                  <span>Heading 4</span>
                  {activeBlock === "Heading 4" && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 5. Bold, Italic, Underline, Strike */}
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => executeCommand("bold")}
            title="Bold (Ctrl+B)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => executeCommand("italic")}
            title="Italic (Ctrl+I)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => executeCommand("underline")}
            title="Underline (Ctrl+U)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => executeCommand("strikeThrough")}
            title="Strikethrough"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          {/* 6. Text Color & Highlight */}
          <div className="relative">
            <button
              type="button"
              disabled={viewMode !== "visual"}
              onClick={(e) => {
                e.stopPropagation();
                setColorMenuOpen(!colorMenuOpen);
              }}
              title="Text Color"
              className="px-2 py-1.5 rounded-lg flex items-center gap-1 text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
            >
              <span className="font-bold font-serif text-sm">A</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {colorMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Text Color
                </div>
                {textColors.map(({ label, color }) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      executeCommand("foreColor", color);
                      setColorMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              disabled={viewMode !== "visual"}
              onClick={(e) => {
                e.stopPropagation();
                setHighlightMenuOpen(!highlightMenuOpen);
              }}
              title="Highlight Background Color"
              className="px-2 py-1.5 rounded-lg flex items-center gap-1 text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
            >
              <span className="bg-yellow-200 px-1 rounded font-bold text-xs">H</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {highlightMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Highlight Color
                </div>
                {highlightColors.map(({ label, color }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      executeCommand("hiliteColor", color);
                      setHighlightMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded border border-slate-300 shrink-0"
                      style={{ backgroundColor: color === "transparent" ? "#fff" : color }}
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 7. Lists (Bullets & Numbers) */}
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => executeCommand("insertUnorderedList")}
            title="Bulleted List"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => executeCommand("insertOrderedList")}
            title="Numbered List"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Alignment */}
          <div className="relative">
            <button
              type="button"
              disabled={viewMode !== "visual"}
              onClick={(e) => {
                e.stopPropagation();
                setListMenuOpen(!listMenuOpen);
              }}
              title="Text Alignment"
              className="px-2 py-1.5 rounded-lg flex items-center gap-1 text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
            >
              <AlignLeft className="w-4 h-4" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {listMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
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
                <button
                  type="button"
                  onClick={() => {
                    executeCommand("justifyFull");
                    setListMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <AlignJustify className="w-4 h-4 text-slate-500" /> Justify
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* 8. Media & Tables */}
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => setLinkModalOpen(true)}
            title="Insert Link"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => setMediaModalOpen("image")}
            title="Insert Image"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={viewMode !== "visual"}
            onClick={() => setMediaModalOpen("video")}
            title="Embed YouTube Video"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Table */}
          <div className="relative">
            <button
              type="button"
              disabled={viewMode !== "visual"}
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
              <div className="absolute left-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => insertTable(0, 0, true)}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-indigo-700 font-semibold cursor-pointer"
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

          {/* More Options */}
          <div className="relative">
            <button
              type="button"
              disabled={viewMode !== "visual"}
              onClick={(e) => {
                e.stopPropagation();
                setMoreMenuOpen(!moreMenuOpen);
              }}
              title="More Formatting"
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

        {/* Right Toolbar Items: Mode Switchers (Visual | Preview | Code) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              if (viewMode === "code" && editorRef.current) {
                editorRef.current.innerHTML = value || "";
              }
              setViewMode("visual");
            }}
            title="Visual WYSIWYG Editor"
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "visual"
                ? "bg-slate-900 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visual</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("preview")}
            title="Storefront Customer Preview"
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "preview"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Store Preview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (viewMode === "code") {
                setViewMode("visual");
              } else {
                setViewMode("code");
              }
            }}
            title="HTML Source Code (<>)"
            className={`px-2 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === "code"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>&lt;&gt;</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* EDITOR CONTENT VIEWPORT                                       */}
      {/* ============================================================== */}
      <div className="relative min-h-[220px]">
        {viewMode === "code" && (
          /* HTML Code Editor View */
          <textarea
            value={value || ""}
            onChange={(e) => {
              internalHtml.current = e.target.value;
              if (onChange) onChange(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={12}
            placeholder="<p>Write your raw HTML here...</p>"
            className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50/60 outline-none resize-y min-h-[240px]"
          />
        )}

        {viewMode === "preview" && (
          /* Live Storefront Preview (How customer sees it on Product Details Page) */
          <div className="p-5 sm:p-7 bg-slate-50/40">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Live Customer Storefront Preview
                </span>
              </div>
              <span className="text-[11px] text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200 font-medium">
                Full Details Tab Rendering
              </span>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs">
              <ProductDescription description={value} variant="full" />
            </div>
          </div>
        )}

        {viewMode === "visual" && (
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
              className="shopify-rte p-5 sm:p-6 outline-none min-h-[240px] max-h-[500px] overflow-y-auto text-sm text-[#1e293b]"
            />

            {/* Placeholder overlay when empty */}
            {(!value || value === "<p><br></p>" || value.trim() === "") && (
              <div
                onClick={() => {
                  if (editorRef.current) editorRef.current.focus();
                }}
                className="absolute top-6 left-6 text-slate-400 text-sm pointer-events-none select-none flex items-center gap-2"
              >
                <span>{placeholder}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* FOOTER BAR (Stats, Reading Time & Clear)                       */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 rounded-b-3xl text-[11px] text-slate-500 select-none">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-semibold text-slate-700">
            {viewMode === "visual"
              ? "Visual WYSIWYG Mode"
              : viewMode === "preview"
              ? "Customer Storefront Preview"
              : "HTML Source Mode"}
          </span>
          <span>•</span>
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
          <span>•</span>
          <span className="text-indigo-600 font-medium">~{readTimeMin} min read</span>
        </div>

        <div className="flex items-center gap-3">
          {value && value.trim() !== "" && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard?.writeText(value);
                    toast.success("HTML copied to clipboard!");
                  }
                }}
                className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              >
                <Copy className="w-3 h-3" /> Copy HTML
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear all product description content?")) {
                    if (editorRef.current) editorRef.current.innerHTML = "";
                    internalHtml.current = "";
                    if (onChange) onChange("");
                    toast.success("Cleared description content");
                  }
                }}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SMART TEMPLATES & AI WRITER STUDIO MODAL                       */}
      {/* ============================================================== */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Product Description Templates & Writer Studio
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pick a specialized eCommerce template or customize structured fields to generate high-converting copy.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTemplateModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Selector Tabs */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {TEMPLATE_CATEGORIES.map((cat) => {
                const IconComponent = CATEGORY_ICON_MAP[cat.icon] || Sparkles;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => initTemplateForCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body: Switch between Customize & Live Preview */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTemplatePreviewTab("customize")}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    templatePreviewTab === "customize"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  1. Customize Content Fields
                </button>
                <button
                  type="button"
                  onClick={() => setTemplatePreviewTab("preview")}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    templatePreviewTab === "preview"
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  2. Live Template Preview
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Category: <strong>{TEMPLATE_CATEGORIES.find((c) => c.id === selectedCategory)?.name}</strong>
              </span>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto max-h-[55vh] space-y-5">
              {templatePreviewTab === "customize" ? (
                <>
                  {/* General Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={templateForm.title}
                        onChange={(e) =>
                          setTemplateForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="e.g. Joyroom JR-W020 Magnetic Power Bank"
                        className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Brand / Manufacturer
                      </label>
                      <input
                        type="text"
                        value={templateForm.brand}
                        onChange={(e) =>
                          setTemplateForm((prev) => ({ ...prev, brand: e.target.value }))
                        }
                        placeholder="e.g. Joyroom / TechX Official"
                        className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Hook / Tagline */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Lead Value Proposition & Hook
                    </label>
                    <textarea
                      rows={2}
                      value={templateForm.tagline}
                      onChange={(e) =>
                        setTemplateForm((prev) => ({ ...prev, tagline: e.target.value }))
                      }
                      placeholder="High-converting introductory hook..."
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                  {/* Key Features (Editable List) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Key Features & Highlights ({templateForm.features.length})
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setTemplateForm((prev) => ({
                            ...prev,
                            features: [
                              ...prev.features,
                              { title: "New Feature", desc: "Detailed benefit description." },
                            ],
                          }))
                        }
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Feature
                      </button>
                    </div>

                    <div className="space-y-2">
                      {templateForm.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat.title}
                            onChange={(e) => {
                              const newF = [...templateForm.features];
                              newF[idx].title = e.target.value;
                              setTemplateForm((prev) => ({ ...prev, features: newF }));
                            }}
                            placeholder="Feature Title"
                            className="w-1/3 h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            value={feat.desc}
                            onChange={(e) => {
                              const newF = [...templateForm.features];
                              newF[idx].desc = e.target.value;
                              setTemplateForm((prev) => ({ ...prev, features: newF }));
                            }}
                            placeholder="Explanation of benefit..."
                            className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newF = templateForm.features.filter((_, i) => i !== idx);
                              setTemplateForm((prev) => ({ ...prev, features: newF }));
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Specifications (Editable Table Rows) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Specifications Matrix ({templateForm.specs.length} rows)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setTemplateForm((prev) => ({
                            ...prev,
                            specs: [...prev.specs, { label: "Spec Label", value: "Value / Details" }],
                          }))
                        }
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Row
                      </button>
                    </div>

                    <div className="space-y-2">
                      {templateForm.specs.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={spec.label}
                            onChange={(e) => {
                              const newS = [...templateForm.specs];
                              newS[idx].label = e.target.value;
                              setTemplateForm((prev) => ({ ...prev, specs: newS }));
                            }}
                            placeholder="Label (e.g. Battery Life)"
                            className="w-1/3 h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => {
                              const newS = [...templateForm.specs];
                              newS[idx].value = e.target.value;
                              setTemplateForm((prev) => ({ ...prev, specs: newS }));
                            }}
                            placeholder="Value (e.g. Up to 30 Hours)"
                            className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newS = templateForm.specs.filter((_, i) => i !== idx);
                              setTemplateForm((prev) => ({ ...prev, specs: newS }));
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warranty & Guarantee */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Warranty & Authenticity Guarantee Statement
                    </label>
                    <input
                      type="text"
                      value={templateForm.warranty}
                      onChange={(e) =>
                        setTemplateForm((prev) => ({ ...prev, warranty: e.target.value }))
                      }
                      placeholder="e.g. 1 Year Official TechX Warranty with 7-Day Replacement Policy."
                      className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                    />
                  </div>
                </>
              ) : (
                /* Live Preview Mode inside Modal */
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Rendered Storefront Preview
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <ProductDescription description={currentStudioHtml} variant="full" />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTemplateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate("append")}
                  className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-50 cursor-pointer shadow-2xs"
                >
                  + Append to Current Text
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate("replace")}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-xs font-bold text-white hover:brightness-110 cursor-pointer shadow-xs"
                >
                  ⚡ Apply & Replace Description
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                placeholder="e.g. Official Warranty Page"
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
                    <Video className="w-4 h-4 text-indigo-600" /> Embed Video (YouTube)
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
                {mediaModalOpen === "image" ? "Image URL" : "YouTube Video Link"}
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
                  placeholder="e.g. Side profile angle view"
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
