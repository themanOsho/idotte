interface WorkspaceStatusProps {
  allocationReady: boolean;
  clientReady: boolean;
}
export function WorkspaceStatus({
  allocationReady,
  clientReady,
}: WorkspaceStatusProps) {
  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Status
          title="Allocation"
          ready={allocationReady}
        />
        <Status
          title="Client"
          ready={clientReady}
        />
        <Status
          title="Ready to Match"
          ready={allocationReady && clientReady}
        />
      </div>
    </div>
  );
}
function Status({
  title,
  ready,
}: {
  title: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          ready
            ? "bg-green-500"
            : "bg-muted"
        }`}
      />
      <span className="font-medium">
        {title}
      </span>
    </div>
  );
}