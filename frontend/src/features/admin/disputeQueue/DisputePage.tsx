import AdminNavbar from "@/features/admin/components/AdminNavbar";
import DisputeHeader from "./compoentns/DisputeHeader";
import DisputeTable from "./compoentns/DisputeTable";

export default function DisputePage() {
  return (
    <div className="min-h-screen bg-page-secondary flex flex-col">
      <AdminNavbar />
      <main className="flex-1 w-full">
        <DisputeHeader />
        <DisputeTable />
      </main>
    </div>
  );
}
