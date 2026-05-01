import Sidebar from "@/components/Sidebar";

import "./admin.css";

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
    </body>
    </html>
  );
}