import React from "react";
import { Condition } from "../types/fhir";
interface Props { conditions: Condition[]; }
const ConditionList: React.FC<Props> = ({ conditions }) => (
  <div><h3>Conditions</h3>
  <ul>{conditions.map(c => <li key={c.id}>{c.code.coding[0].display}</li>)}</ul></div>
);
export default ConditionList;
