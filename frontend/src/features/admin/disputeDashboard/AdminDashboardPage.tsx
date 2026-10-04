import { useState } from "react";
import AdminNavbar from "@/features/admin/components/AdminNavbar";
import DashboardHeader from "./components/DashboardHeader";
import DashboardContent from "./components/DashboardContent";

export default function AdminDashboardPage() {
  const [filterDays, setFilterDays] = useState<string>("30 days");

  return (
    <div className="min-h-screen bg-page-secondary flex flex-col">
      <AdminNavbar />
      <main className="flex-1 w-full bg-page-secondary">
        <DashboardHeader
          filterDays={filterDays}
          onFilterChange={setFilterDays}
        />
        <DashboardContent filterDays={filterDays} />
      </main>
    </div>
  );
}
