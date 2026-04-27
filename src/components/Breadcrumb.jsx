"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChevronRight } from "react-icons/fa";

export default function Breadcrumb({ customLast }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center py-4 text-sm overflow-x-auto whitespace-nowrap">
      
      {/* Home */}
      <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
        <FaHome />
      </Link>

      {segments.map((segment, index) => {
        const isNumeric = !isNaN(segment);
        const isLast = index === segments.length - 1;

        // Skip numeric segments (like product ID)
        if (isNumeric) {
          // 👉 Only show customLast if it's the last segment
          if (isLast && customLast) {
            return (
              <div key="custom-last" className="flex items-center">
                <FaChevronRight className="mx-3 text-gray-400" />
                <span className="text-blue-600 font-medium">
                  {customLast}
                </span>
              </div>
            );
          }
          return null;
        }

        const href = "/" + segments.slice(0, index + 1).join("/");

        // Format name
        const name = decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <div key={href} className="flex items-center">
            <FaChevronRight className="mx-3 text-gray-400" />

            {isLast ? (
              <span className="text-blue-600 font-medium">
                {customLast || name}
              </span>
            ) : (
              <Link href={href} className="text-gray-500 hover:text-gray-700">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}