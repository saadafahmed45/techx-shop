"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Check,
  Sparkles,
  HelpCircle,
  Package,
  ArrowDown,
  FileText,
  ShieldCheck,
  Truck,
  RotateCcw,
  Copy,
} from "lucide-react";
import { toast } from "react-toastify";

/**
 * Intelligent parser that extracts semantic sections from:
 * 1. Semantic rich HTML (generated from ShopifyRichTextEditor with <h3>, <table>, <ul>)
 * 2. Pseudo-HTML with <p>-wrapped lines (legacy products in database)
 * 3. Plain text with section markers
 */
export function parseShopifyContent(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { isHtml: false, isEmpty: true };
  }

  const trimmed = rawText.trim();
  if (!trimmed) {
    return { isHtml: false, isEmpty: true };
  }

  const hasHtml = /<[a-z][\s\S]*>/i.test(trimmed);

  // Check if it has true structural HTML elements like <h3>, <h4>, <table>, <ul>, <ol>
  const hasStructuralHtml = /<(?:h[1-6]|table|ul|ol|blockquote|div)[\s\S]*>/i.test(trimmed);

  // Helper to strip tags and decode HTML entities
  const cleanHtmlString = (str) => {
    if (!str) return "";
    return str
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Case A: Rich Semantic HTML (has <h3>, <table>, <ul>, etc.)
  if (hasStructuralHtml) {
    // Extract first genuine paragraph (<p>) before any <h3> or <table> as lead narrative
    let leadParagraph = "";
    const pMatches = [...trimmed.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    for (const match of pMatches) {
      const cleanP = cleanHtmlString(match[1]);
      if (cleanP.length > 20 && !/^(key features|specifications|faq|what's in the box)/i.test(cleanP)) {
        leadParagraph = cleanP;
        break;
      }
    }
    if (!leadParagraph && pMatches[0]) {
      leadParagraph = cleanHtmlString(pMatches[0][1]);
    }

    // Extract bullet points from <li> elements
    const liMatches = [...trimmed.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    const htmlHighlights = liMatches
      .map((m) => cleanHtmlString(m[1]))
      .filter((text) => text.length > 3)
      .slice(0, 4);

    return {
      isHtml: true,
      hasStructuralHtml: true,
      html: trimmed,
      leadText: leadParagraph || cleanHtmlString(trimmed).slice(0, 200),
      highlights: htmlHighlights,
      isEmpty: false,
    };
  }

  // Case B: Pseudo-HTML or Plain Text (paragraphs wrapped in <p>, or split by newlines)
  let rawLines = [];
  if (hasHtml) {
    // Content is wrapped in <p> or <br> tags
    const pTagMatches = [...trimmed.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    if (pTagMatches.length > 0) {
      for (const m of pTagMatches) {
        const inner = m[1].replace(/<br\s*[\/]?>/gi, "\n");
        const subLines = inner.split(/\r?\n/).map((l) => cleanHtmlString(l)).filter(Boolean);
        rawLines.push(...subLines);
      }
    } else {
      const inner = trimmed.replace(/<br\s*[\/]?>/gi, "\n");
      rawLines = inner.split(/\r?\n/).map((l) => cleanHtmlString(l)).filter(Boolean);
    }
  } else {
    // Plain text
    rawLines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  }

  const isHeading = (line) => {
    const l = line.toLowerCase().replace(/[:\?#]/g, "").trim();
    return (
      l === "key features" ||
      l === "main features" ||
      l === "features" ||
      l === "highlights" ||
      l === "key highlights" ||
      l === "specifications" ||
      l === "specs" ||
      l === "technical specifications" ||
      l === "faq" ||
      l === "faqs" ||
      l === "frequently asked questions" ||
      l === "q&a" ||
      l === "q & a" ||
      l === "what’s in the box" ||
      l === "what's in the box" ||
      l === "package contents" ||
      l === "package includes" ||
      l === "in the box" ||
      l === "performance excellence" ||
      l === "user benefits" ||
      l === "product overview" ||
      l === "overview" ||
      l === "how to use" ||
      l === "compatibility" ||
      l === "warranty"
    );
  };

  const getHeadingType = (line) => {
    const l = line.toLowerCase().replace(/[:\?#]/g, "").trim();
    if (/feature|highlight/i.test(l)) return "features";
    if (/faq|question|q&a|q & a/i.test(l)) return "faq";
    if (/box|package/i.test(l)) return "box";
    if (/spec/i.test(l)) return "specs";
    return "general";
  };

  const isFaqQuestion = (line) => {
    return /^q\d*[:\.\-]/i.test(line) || /^question\d*[:\.\-]/i.test(line);
  };

  const isFaqAnswer = (line) => {
    return /^a\d*[:\.\-]/i.test(line) || /^answer\d*[:\.\-]/i.test(line);
  };

  let currentSection = "lead";
  const leadParagraphs = [];
  const features = [];
  const faqs = [];
  const boxItems = [];
  const specs = [];
  const generalSections = [];
  let pendingQuestion = null;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Check Question marker (e.g. Q1: Can I charge...)
    if (isFaqQuestion(line)) {
      if (pendingQuestion) {
        faqs.push({ q: pendingQuestion, a: "" });
      }
      pendingQuestion = line.replace(/^q\d*[:\.\-]\s*/i, "").trim();
      currentSection = "faq";
      continue;
    }

    // Check Answer marker (e.g. A: Yes...)
    if (isFaqAnswer(line)) {
      const ans = line.replace(/^a\d*[:\.\-]\s*/i, "").trim();
      if (pendingQuestion) {
        faqs.push({ q: pendingQuestion, a: ans });
        pendingQuestion = null;
      } else if (faqs.length > 0) {
        faqs[faqs.length - 1].a += " " + ans;
      }
      currentSection = "faq";
      continue;
    }

    // Check Section Heading (e.g. "Key Features", "What's In The Box")
    if (isHeading(line)) {
      if (pendingQuestion) {
        faqs.push({ q: pendingQuestion, a: "" });
        pendingQuestion = null;
      }
      currentSection = getHeadingType(line);
      if (currentSection === "general") {
        generalSections.push({ title: line, paragraphs: [] });
      }
      continue;
    }

    const cleanLine = line.replace(/^[•\-*✔✓▪►]\s*|^\d+[\.\)]\s+/, "").trim();

    if (currentSection === "lead") {
      leadParagraphs.push(line);
    } else if (currentSection === "features") {
      features.push(cleanLine);
    } else if (currentSection === "box") {
      boxItems.push(cleanLine);
    } else if (currentSection === "specs") {
      specs.push(cleanLine);
    } else if (currentSection === "faq") {
      if (pendingQuestion) {
        faqs.push({ q: pendingQuestion, a: cleanLine });
        pendingQuestion = null;
      } else if (faqs.length > 0) {
        faqs[faqs.length - 1].a += " " + cleanLine;
      } else {
        faqs.push({ q: cleanLine, a: "" });
      }
    } else if (currentSection === "general") {
      const active = generalSections[generalSections.length - 1];
      if (active) {
        active.paragraphs.push(line);
      }
    }
  }

  if (pendingQuestion) {
    faqs.push({ q: pendingQuestion, a: "" });
  }

  // Highlights for compact buy-box: prefer features, else take first few clean points
  const highlights = features.slice(0, 4);

  return {
    isHtml: false,
    hasStructuralHtml: false,
    lead: leadParagraphs.join("\n\n"),
    leadText: leadParagraphs[0] || "",
    leadParagraphs,
    features,
    highlights,
    faqs,
    boxItems,
    specs,
    generalSections,
    isEmpty: false,
    hasStructuredData:
      features.length > 0 ||
      faqs.length > 0 ||
      boxItems.length > 0 ||
      specs.length > 0 ||
      generalSections.length > 0,
  };
}

/**
 * Truncates text cleanly at a word boundary without cutting words.
 */
function cleanExcerpt(text, maxChars = 210) {
  if (!text || text.length <= maxChars) return text;
  const sub = text.slice(0, maxChars);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > 140 ? sub.slice(0, lastSpace) : sub).trim() + "...";
}

export default function ProductDescription({
  description = "",
  variant = "full", // "compact" | "full"
  onViewFull,
  className = "",
}) {
  const [expanded, setExpanded] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({ 0: true });

  const parsed = useMemo(
    () => parseShopifyContent(description),
    [description]
  );

  if (parsed.isEmpty) {
    return (
      <div className={`text-neutral-400 italic text-sm ${className}`}>
        No detailed description provided for this product.
      </div>
    );
  }

  // =========================================================================
  // COMPACT VARIANT (Right Column Buy-Box)
  // Clean overview snippet + top 3-4 highlights + smooth view full button
  // =========================================================================
  if (variant === "compact") {
    const rawNarrative = parsed.leadText || parsed.lead || "";
    const isLongText = rawNarrative.length > 220;
    const displayText =
      !expanded && isLongText ? cleanExcerpt(rawNarrative, 210) : rawNarrative;

    const highlightsList = parsed.highlights || [];

    return (
      <div className={`text-left space-y-3.5 ${className}`}>
        {/* Narrative Overview Hook */}
        {rawNarrative && (
          <div className="text-[14px] text-neutral-700 leading-relaxed font-normal">
            <span>{displayText}</span>
            {isLongText && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 ml-1.5 cursor-pointer underline decoration-blue-200 hover:decoration-blue-600 transition-colors"
              >
                {expanded ? (
                  <>
                    Show less <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Key Highlights Card (if available) */}
        {highlightsList.length > 0 && (
          <div className="space-y-2 bg-gradient-to-br from-neutral-50/90 to-slate-50/80 rounded-2xl p-3.5 border border-neutral-200/80 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Key Highlights
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-neutral-200 font-semibold text-neutral-600">
                Verified
              </span>
            </div>
            <div className="space-y-1.5">
              {highlightsList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-[13px] text-neutral-800 font-medium leading-snug"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Micro Trust Pills */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-neutral-200/70 text-[11px] text-neutral-700 font-medium shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Official BD Warranty</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-neutral-200/70 text-[11px] text-neutral-700 font-medium shadow-2xs">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">7-Day Replacement</span>
          </div>
        </div>

        {/* View Full Specifications & Details Button */}
        {onViewFull && (
          <button
            type="button"
            onClick={onViewFull}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200/90 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-neutral-200 group shadow-2xs active:scale-[0.99]"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-600 transition-colors" />
            <span>View Full Details & Specifications</span>
            <ArrowDown className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-y-0.5 group-hover:text-blue-600 transition-transform" />
          </button>
        )}
      </div>
    );
  }

  // =========================================================================
  // FULL VARIANT (Lower Tabbed Suite: activeTab === "description")
  // =========================================================================

  const handleCopyDetails = () => {
    if (typeof window !== "undefined") {
      const cleanContent = description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      navigator.clipboard?.writeText(cleanContent);
      toast.success("Description copied to clipboard!");
    }
  };

  // Case 1: Semantic Rich HTML (generated from ShopifyRichTextEditor with <h3>, <table>, <ul>, etc.)
  if (parsed.isHtml && parsed.hasStructuralHtml) {
    return (
      <div className={`max-w-4xl text-left space-y-8 ${className}`}>
        {/* Top utility bar */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Verified Product Specifications & Overview
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyDetails}
            className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-neutral-100"
            title="Copy plain text description"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Text</span>
          </button>
        </div>

        {/* Rich HTML Viewport */}
        <div className="shopify-rte">
          <div dangerouslySetInnerHTML={{ __html: parsed.html }} />
        </div>

        {/* TechX Official Buyer Protection Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-slate-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                100% Authentic TechX Guarantee
              </h4>
              <p className="text-xs text-neutral-600 mt-0.5">
                Every unit is sealed with official brand warranty credentials and prompt customer support.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 shadow-2xs flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600" /> Fast Delivery
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 shadow-2xs flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" /> Easy 7-Day Return
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Structured / Pseudo-HTML / Plain Text
  const toggleFaq = (idx) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className={`max-w-4xl text-left space-y-8 ${className}`}>
      {/* Top utility bar */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
            Comprehensive Product Details & Specifications
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyDetails}
          className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-lg hover:bg-neutral-100"
          title="Copy plain text description"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Copy Text</span>
        </button>
      </div>

      {/* 1. Lead Overview Narrative */}
      {parsed.leadParagraphs && parsed.leadParagraphs.length > 0 && (
        <div className="space-y-4">
          {parsed.leadParagraphs.map((para, idx) => (
            <p
              key={idx}
              className="text-[15px] sm:text-base text-neutral-800 leading-[1.8] font-normal"
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {/* 2. Key Features & Capabilities Grid */}
      {parsed.features && parsed.features.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2.5 text-neutral-950 font-bold text-lg mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3>Key Features & Highlights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {parsed.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 hover:border-indigo-200 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-800 leading-relaxed pt-0.5">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Technical Specifications (if present in lines) */}
      {parsed.specs && parsed.specs.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2.5 text-neutral-950 font-bold text-lg mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <h3>Technical Specifications</h3>
          </div>
          <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs sm:text-sm">
            {parsed.specs.map((item, idx) => {
              const parts = item.split(/[:\-–—]\s*/);
              const label = parts[0]?.trim();
              const value = parts.slice(1).join(": ").trim() || label;
              const hasSplit = parts.length > 1;

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-3 p-3.5 ${
                    idx % 2 === 0 ? "bg-neutral-50/70" : "bg-white"
                  }`}
                >
                  <span className="font-semibold text-neutral-800">
                    {hasSplit ? label : `Spec #${idx + 1}`}
                  </span>
                  <span className="col-span-2 text-neutral-600 font-medium">
                    {hasSplit ? value : item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. What’s In The Box Section */}
      {parsed.boxItems && parsed.boxItems.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2.5 text-neutral-950 font-bold text-lg mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <h3>What’s In The Box</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {parsed.boxItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Frequently Asked Questions (Interactive Accordion) */}
      {parsed.faqs && parsed.faqs.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5 text-neutral-950 font-bold text-lg">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3>Frequently Asked Questions</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70">
              {parsed.faqs.length} Questions
            </span>
          </div>

          <div className="space-y-3">
            {parsed.faqs.map((faq, idx) => {
              const isOpen = Boolean(openFaqs[idx]);
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? "bg-slate-50/70 border-blue-200 shadow-xs"
                      : "bg-white border-neutral-200/80 hover:border-neutral-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        Q
                      </span>
                      <span className="text-sm font-bold text-neutral-900">
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform flex-shrink-0 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 flex items-start gap-3 border-t border-blue-100/70 mt-1">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        A
                      </span>
                      <p className="text-sm text-neutral-700 leading-relaxed pt-0.5">
                        {faq.a || "Please refer to the manufacturer user manual for specific inquiries."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. General / Named Sections (e.g. User Benefits, Overview) */}
      {parsed.generalSections &&
        parsed.generalSections.map((sec, idx) => (
          <div key={idx} className="pt-2 border-t border-neutral-100">
            <h4 className="text-base sm:text-lg font-bold text-neutral-950 mb-3">
              {sec.title}
            </h4>
            <div className="space-y-3">
              {sec.paragraphs.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[15px] sm:text-base text-neutral-800 leading-[1.8] font-normal"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}

      {/* 7. Official TechX Buyer Protection Footer */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-slate-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900">
              100% Authentic TechX Guarantee
            </h4>
            <p className="text-xs text-neutral-600 mt-0.5">
              Direct official manufacturer warranty and guaranteed genuine hardware across Bangladesh.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 shadow-2xs flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-600" /> Fast Delivery
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 shadow-2xs flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" /> Easy 7-Day Return
          </span>
        </div>
      </div>
    </div>
  );
}
