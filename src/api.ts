import axios from 'axios';

export const sendReport = (data: any) => {
  return axios.post('/api/report', data);
};
