import { useState, useMemo } from "react";
import AdminNavbar from "@/features/admin/components/AdminNavbar";
import DisputeHeader, { type DisputeCounts } from "./compoentns/DisputeHeader";
import DisputeTable from "./compoentns/DisputeTable";
import { useDisputeQueue } from "@/services/disputeService";
import {
  getDisputeStage,
  isDisputeResolved,
  isResolvedThisMonth,
} from "@/utils/disputeUtils";

export default function DisputePage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const { data: disputes } = useDisputeQueue();

  const counts = useMemo<DisputeCounts>(() => {
    const list = disputes || [];
    const all = list.length;
    let pendingReview = 0;
    let underInvestigation = 0;
    let resolved = 0;
    let resolvedThisMonth = 0;

    for (const order of list) {
      const isResolved = isDisputeResolved(order);
      if (isResolved) {
        resolved++;
        if (isResolvedThisMonth(order)) {
          resolvedThisMonth++;
        }
      } else {
        const stage = getDisputeStage(order);
        if (stage === "Under Investigation") {
          underInvestigation++;
        } else {
          pendingReview++;
        }
      }
    }

    const open = pendingReview + underInvestigation;

    return {
      all,
      open,
      pendingReview,
      underInvestigation,
      resolved,
      resolvedThisMonth,
    };
  }, [disputes]);

  return (
    <div className="min-h-screen bg-page-secondary flex flex-col">
      <AdminNavbar />
      <main className="flex-1 w-full">
        <DisputeHeader
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
        <DisputeTable
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          disputes={disputes}
        />
      </main>
    </div>
  );
}
