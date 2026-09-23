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
} from "lucide-react";

/**
 * Intelligent parser that extracts semantic sections from both
 * rich HTML and legacy plain-text descriptions.
 */
function parseShopifyContent(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { isHtml: false, isEmpty: true };
  }

  const trimmed = rawText.trim();
  if (!trimmed) {
    return { isHtml: false, isEmpty: true };
  }

  // 1. If content is HTML (from ShopifyRichTextEditor)
  const hasHtml = /<[a-z][\s\S]*>/i.test(trimmed);
  if (hasHtml) {
    // Extract plain text for the compact summary
    const textOnly = trimmed
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Extract bullet points from <li> elements
    const liMatches = [...trimmed.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    const htmlHighlights = liMatches
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      .filter(Boolean)
      .slice(0, 4);

    return {
      isHtml: true,
      html: trimmed,
      leadText: textOnly,
      highlights: htmlHighlights,
      isEmpty: false,
    };
  }

  // 2. Plain Text structured parsing
  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const isHeading = (line) => {
    const l = line.toLowerCase().replace(/[:\?]/g, "").trim();
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
      l === "compatibility"
    );
  };

  const getHeadingType = (line) => {
    const l = line.toLowerCase().replace(/[:\?]/g, "").trim();
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check Question marker
    if (isFaqQuestion(line)) {
      if (pendingQuestion) {
        faqs.push({ q: pendingQuestion, a: "" });
      }
      pendingQuestion = line.replace(/^q\d*[:\.\-]\s*/i, "").trim();
      currentSection = "faq";
      continue;
    }

    // Check Answer marker
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

    // Check Section Heading
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

  const highlights = features.slice(0, 4);

  return {
    isHtml: false,
    lead: leadParagraphs.join("\n\n"),
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
      generalSections.length > 0,
  };
}

/**
 * Truncates text cleanly at a word boundary without cutting words.
 */
function cleanExcerpt(text, maxChars = 190) {
  if (!text || text.length <= maxChars) return text;
  const sub = text.slice(0, maxChars);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > 120 ? sub.slice(0, lastSpace) : sub).trim() + "...";
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
        No description available.
      </div>
    );
  }

  // =========================================================================
  // COMPACT VARIANT (Right Column Buy-Box)
  // Clean overview snippet + top 3-4 highlights + smooth view full button
  // =========================================================================
  if (variant === "compact") {
    const rawNarrative = parsed.isHtml
      ? parsed.leadText
      : parsed.leadParagraphs?.[0] || parsed.lead || "";

    const isLongText = rawNarrative.length > 210;
    const displayText =
      !expanded && isLongText ? cleanExcerpt(rawNarrative, 190) : rawNarrative;

    const highlightsList = parsed.highlights || [];

    return (
      <div className={`text-left ${className}`}>
        {/* Narrative Overview */}
        {rawNarrative && (
          <div className="text-[14px] sm:text-[15px] text-neutral-700 leading-relaxed font-normal">
            <span>{displayText}</span>
            {isLongText && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:text-blue-700 ml-1.5 cursor-pointer underline decoration-blue-200 hover:decoration-blue-600 transition-colors"
              >
                {expanded ? (
                  <>
                    Show less <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Key Highlights Card (if available) */}
        {highlightsList.length > 0 && (
          <div className="mt-3.5 space-y-2 bg-neutral-50/90 rounded-2xl p-3.5 border border-neutral-200/75">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Key Highlights</span>
            </div>
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
        )}

        {/* View Full Specifications & Details Button */}
        {onViewFull && (
          <button
            type="button"
            onClick={onViewFull}
            className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-neutral-100/90 hover:bg-neutral-200/80 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-neutral-200/80 group shadow-2xs"
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

  // If Rich HTML (generated from ShopifyRichTextEditor)
  if (parsed.isHtml) {
    return (
      <div className={`max-w-4xl text-left shopify-rte ${className}`}>
        <div dangerouslySetInnerHTML={{ __html: parsed.html }} />
      </div>
    );
  }

  // Plain Text with Structured Sections
  const toggleFaq = (idx) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className={`max-w-4xl text-left space-y-8 ${className}`}>
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
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 hover:border-indigo-200 hover:bg-white hover:shadow-xs transition-all"
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

      {/* 3. What’s In The Box Section */}
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
                className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/40 border border-amber-200/60"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center flex-shrink-0">
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

      {/* 4. Frequently Asked Questions (Interactive Accordion) */}
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
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. General / Named Sections (e.g. Performance Excellence, User Benefits) */}
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
    </div>
  );
}
