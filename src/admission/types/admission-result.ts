import { StudentRecord } from "./datastream";

export interface FlatAdmissionMatch {
  clientName: string;
  clientSchoolChoice: string;
  isAdmitted: boolean;
  
  // Data appended from the master JSON file if found
  zoneName?: string;
  schoolName?: string;
  admissionNumber?: string;
  sex?: string;
  feederSchool?: string;
}
