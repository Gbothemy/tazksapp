import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminAuth";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-login");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f2f2f2" }}>
      <AdminSidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: "32px 40px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
