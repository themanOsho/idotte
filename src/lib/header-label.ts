export function getHeaderLabel(header:string){

  const labels:Record<string,string>={
    sn:"S/N",
    name:"Name",

    candidateid:"CandidateID",
    fullname:"FullName",
    ledname:"LEDName",
    schoolname:"SchoolName",
    centrename:"CentreName",
  };

  return labels[header] ?? header;

}