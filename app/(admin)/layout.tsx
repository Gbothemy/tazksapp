import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminAuth";
import AdminSidebar from "./AdminSidebar";
import "./admin.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-login");

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
