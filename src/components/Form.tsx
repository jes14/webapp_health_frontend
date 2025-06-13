import React, { useState } from 'react';
import { sendReport } from '../api';

interface FormData {
  name: string;
  age: number;
  gender: 'male' | 'female';
  fever: boolean;
  testResult: 'positive' | 'negative';
  treatmentDate: string;
}

const Form = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    age: 0,
    gender: 'male',
    fever: false,
    testResult: 'positive',
    treatmentDate: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement; // 타입 단언
  
    const { name, value, type, checked } = target; // target에서 꺼냄
  
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendReport(form);
    alert('보고 완료!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="이름" onChange={handleChange} />
      <input name="age" type="number" placeholder="나이" onChange={handleChange} />
      <select name="gender" onChange={handleChange}>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>
      <label>
        <input name="fever" type="checkbox" onChange={handleChange} />
        발열 있음
      </label>
      <select name="testResult" onChange={handleChange}>
        <option value="positive">양성</option>
        <option value="negative">음성</option>
      </select>
      <input name="treatmentDate" type="date" onChange={handleChange} />
      <button type="submit">전송</button>
    </form>
  );
};

export default Form;
