import DashboardClientLayout from "./DashboardClientLayout";

export const metadata = {
  title: "Admin Dashboard | TechX Shop",
  description: "TechX Shop Management & Administration Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}