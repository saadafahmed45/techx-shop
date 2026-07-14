"use client";

import dynamic from "next/dynamic";

const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), {
  ssr: false,
});

export default function ClientPopups() {
  return <WelcomePopup />;
}
