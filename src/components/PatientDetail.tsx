import React from "react";
import { Patient } from "../types/fhir";
interface Props { patient: Patient; }
const PatientDetail: React.FC<Props> = ({ patient }) => {
  const occupation = patient.extension.find(e => e.url.includes("occupation"))?.valueString;
  const exposures = patient.extension.filter(e => e.url.includes("exposure-history"));
  return <div>
    <h3>Patient Detail</h3>
    <p>Name: {patient.name[0].given[0]} {patient.name[0].family}</p>
    <p>Occupation: {occupation}</p>
    <ul>{exposures.map((e,i)=> <li key={i}>{e.valueString}</li>)}</ul>
  </div>
};
export default PatientDetail;
