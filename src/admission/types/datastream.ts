export interface StudentRecord {
  serialNumber: number;
  admissionNumber: string;
  fullName: string;
  sex: string;
  feederSchool: string;
}

export interface AdmissionDatastream {
  [zoneName: string]: {
    [schoolName: string]: StudentRecord[];
  };
}
