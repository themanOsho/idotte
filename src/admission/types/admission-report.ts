import { FlatAdmissionMatch } from "./admission-result";

export interface AdmissionReportSchoolGroup {
  schoolName: string;
  lga: string;
  records: FlatAdmissionMatch[];
}

export interface AdmissionReportData {
  generatedOn: string;
  session: string;
  clientFileName: string;
  clientSheetCount: number;
  clientRecordCount: number;
  total: number;
  admitted: number;
  redirected: number;
  notAdmitted: number;
  admittedGroups: AdmissionReportSchoolGroup[];
  redirectedGroups: AdmissionReportSchoolGroup[];
  notAdmittedGroups: AdmissionReportSchoolGroup[];
}