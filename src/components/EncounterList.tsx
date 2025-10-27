import React from "react";
import { Encounter, Condition } from "../types/fhir";
interface Props { encounters: Encounter[]; conditions: Condition[]; }
const EncounterList: React.FC<Props> = ({ encounters, conditions }) => (
  <div>
    <h3>Encounters</h3>
    <ul>{encounters.map(enc => {
      const condId = enc.diagnosis[0].condition.reference.split("/")[1];
      const condName = conditions.find(c => c.id === condId)?.code.coding[0].display;
      return <li key={enc.id}>{enc.period.start} - {condName}</li>;
    })}</ul>
  </div>
);
export default EncounterList;
