import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; 
import { Patient, Condition, Encounter } from "./types/fhir";
import PatientList from "./components/PatientList";
import PatientDetail from "./components/PatientDetail";
import ConditionList from "./components/ConditionList";
import EncounterList from "./components/EncounterList";

const API = "http://localhost:3001";

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [newPatientGiven, setNewPatientGiven] = useState("");
  const [newPatientFamily, setNewPatientFamily] = useState("");
  const [newPatientOccupation, setNewPatientOccupation] = useState("");

  const [newConditionCode, setNewConditionCode] = useState("");
  const [newConditionDisplay, setNewConditionDisplay] = useState("");

  const [newEncounterDate, setNewEncounterDate] = useState("");
  const [selectedConditionId, setSelectedConditionId] = useState("");

  useEffect(() => {
    axios.get(`${API}/patients`).then(res => setPatients(res.data));
    axios.get(`${API}/conditions`).then(res => setConditions(res.data));
    axios.get(`${API}/encounters`).then(res => setEncounters(res.data));
  }, []);

  const handleAddPatient = () => {
    if (!newPatientGiven || !newPatientFamily) return alert("Enter first name and last name");
    axios.post(`${API}/patients`, {
      name: [{ given: [newPatientGiven], family: newPatientFamily }],
      extension: newPatientOccupation
        ? [{ url: "http://example.org/fhir/StructureDefinition/occupation", valueString: newPatientOccupation }]
        : []
    }).then(res => {
      setPatients([...patients, res.data]);
      setNewPatientGiven(""); setNewPatientFamily(""); setNewPatientOccupation("");
    });
  };

  const handleAddCondition = () => {
    if (!selectedPatient) return alert("Select a patient first");
    if (!newConditionCode || !newConditionDisplay) return alert("Enter code and display");
    axios.post(`${API}/conditions`, {
      code: { coding: [{ system: "http://snomed.info/sct", code: newConditionCode, display: newConditionDisplay }] },
      subject: { reference: `Patient/${selectedPatient.id}` }
    }).then(res => {
      setConditions([...conditions, res.data]);
      setNewConditionCode(""); setNewConditionDisplay("");
    });
  };

  const handleAddEncounter = () => {
    if (!selectedPatient) return alert("Select a patient first");
    if (!selectedConditionId || !newEncounterDate) return alert("Select a condition and date");
    axios.post(`${API}/encounters`, {
      period: { start: newEncounterDate },
      subject: { reference: `Patient/${selectedPatient.id}` },
      diagnosis: [{ condition: { reference: `Condition/${selectedConditionId}` } }]
    }).then(res => {
      setEncounters([...encounters, res.data]);
      setNewEncounterDate(""); setSelectedConditionId("");
    });
  };

  return (
    <div className="app-container">
      {/* <h1 className="app-title">FHIR CRUD Dashboard</h1> */}

      <section className="card">
        <h2>Add Patient</h2>
        <div className="form-row">
          <input placeholder="First Name" value={newPatientGiven} onChange={e => setNewPatientGiven(e.target.value)} />
          <input placeholder="Surname" value={newPatientFamily} onChange={e => setNewPatientFamily(e.target.value)} />
          <input placeholder="Occupation" value={newPatientOccupation} onChange={e => setNewPatientOccupation(e.target.value)} />
          <button onClick={handleAddPatient}>Add</button>
        </div>
      </section>

      <section className="card">
        <h2>Patients</h2>
        <PatientList patients={patients} onSelect={setSelectedPatient} />
      </section>

      {selectedPatient && (
        <section className="detail-section">
          <PatientDetail patient={selectedPatient} />

          <div className="two-column">
            <div className="card">
              <h3>Add Condition</h3>
              <div className="form-row">
                <input placeholder="Code" value={newConditionCode} onChange={e => setNewConditionCode(e.target.value)} />
                <input placeholder="Display" value={newConditionDisplay} onChange={e => setNewConditionDisplay(e.target.value)} />
                <button onClick={handleAddCondition}>Add</button>
              </div>
              <ConditionList conditions={conditions.filter(c => c.subject.reference === `Patient/${selectedPatient.id}`)} />
            </div>

            <div className="card">
              <h3>Add Encounter</h3>
              <div className="form-row">
                <input type="date" value={newEncounterDate} onChange={e => setNewEncounterDate(e.target.value)} />
                <select value={selectedConditionId} onChange={e => setSelectedConditionId(e.target.value)}>
                  <option value="">Select Condition</option>
                  {conditions
                    .filter(c => c.subject.reference === `Patient/${selectedPatient.id}`)
                    .map(c => <option key={c.id} value={c.id}>{c.code.coding[0].display}</option>)}
                </select>
                <button onClick={handleAddEncounter}>Add</button>
              </div>
              <EncounterList
                encounters={encounters.filter(e => e.subject.reference === `Patient/${selectedPatient.id}`)}
                conditions={conditions}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default App;
