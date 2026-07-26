import { AllocationRecord } from "./allocation";
import { ClientRecord } from "./client";

export interface DuplicateResolution {

  client: ClientRecord;

  selectedAllocation: AllocationRecord;

}