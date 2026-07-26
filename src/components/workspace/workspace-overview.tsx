import {
  Database,
  Users,
} from "lucide-react";

import { WorkspaceCard } from "./workspace-card";
import { WorkspaceStatus } from "./workspace-status";

interface WorkspaceOverviewProps {
  allocationRecords: number;
  clientRecords: number;
}

export function WorkspaceOverview({
  allocationRecords,
  clientRecords,
}: WorkspaceOverviewProps) {
  return (
    <section className="space-y-6">

      <WorkspaceStatus
        allocationReady
        clientReady
      />

      <div className="grid gap-6 lg:grid-cols-2">

        <WorkspaceCard
          icon={<Database className="h-6 w-6" />}
          title="Allocation Dataset"
          subtitle={`${allocationRecords.toLocaleString()} records`}
        />

        <WorkspaceCard
          icon={<Users className="h-6 w-6" />}
          title="Client List"
          subtitle={`${clientRecords.toLocaleString()} records`}
        />

      </div>

    </section>
  );
}