import AdminNavbar from "@/features/admin/components/AdminNavbar";
import DashboardHeader from "./components/DashboardHeader";
import DashboardContent from "./components/DashboardContent";

export default function AdminDashboardPage() {
  return (
    <div>
      <AdminNavbar />
      <div className="bg-[#F5F5F4] h-full">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </div>
  );
}
