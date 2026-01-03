import axios from 'axios';

const api = axios.create({
  //baseURL: 'https://tienda-eta-three.vercel.app/api/admin/',
  baseURL: 'http://localhost:3000/api/admin/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ¡Vital para que las cookies funcionen!
});

export default api;