export interface Extension { url: string; valueString: string; }
export interface Patient { id: string; name: { given: string[]; family: string }[]; extension: Extension[]; }
export interface Condition { id: string; code: { coding: { system: string; code: string; display: string }[] }; subject: { reference: string }; }
export interface Encounter { id: string; period: { start: string; end?: string }; subject: { reference: string }; diagnosis: { condition: { reference: string } }[]; }
