import axios from 'axios';

// Criação de uma instância do Axios para facilitar as requisições
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL do seu backend
});

// Exemplo de como usar o token de autenticação (caso precise)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
