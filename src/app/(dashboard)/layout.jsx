import Sidebar from "@/components/Sidebar";
import "./admin.css";
// import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
    // redirect("/login");
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