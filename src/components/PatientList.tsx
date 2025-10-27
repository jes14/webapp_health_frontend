import React from "react";
import { Patient } from "../types/fhir";
interface Props { patients: Patient[]; onSelect: (p: Patient) => void; }
const PatientList: React.FC<Props> = ({ patients, onSelect }) => (
  <ul>{patients.map(p => <li key={p.id} onClick={() => onSelect(p)} style={{cursor:"pointer"}}>{p.name[0].given[0]} {p.name[0].family}</li>)}</ul>
);
export default PatientList;
