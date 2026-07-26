import { useWorkspaceContext } from "@/context/workspace-provider";

export function useWorkspace() {
  return useWorkspaceContext();
}