"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});

const FloatingWhatsApp = dynamic(
  () =>
    import("@digicroz/react-floating-whatsapp").then((mod) => ({
      default: mod.FloatingWhatsApp,
    })),
  { ssr: false }
);

export default function ClientOnlyWidgets() {
  return (
    <>
      <CartDrawer />
      <FloatingWhatsApp
        phoneNumber="1234567890"
        accountName="TechX Shop"
        avatar="techx-img.jpg"
        statusMessage="Typically replies within 1 hour"
        chatMessage="Hello! How can we help you today?"
        darkMode={false}
        allowClickAway={true}
        allowEsc={true}
        notification={true}
        notificationSound={true}
      />
    </>
  );
}
