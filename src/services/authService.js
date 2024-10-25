import axios from 'axios';

// Função de login
const login = async (username, password) => {
    const response = await axios.post('/api/auth/login/', { username, password });
    
    console.log("Resposta do backend:", response.data); // Verifique o que o backend está retornando
  
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('is_staff', response.data.is_staff);  
      localStorage.setItem('user_id', response.data.user_id);    // Tenta armazenar o ID do usuário
    }
    return response.data;
  };

// Função para obter o token armazenado
const getToken = () => {
  return localStorage.getItem('token');
};

// Função para verificar se o usuário é admin
const isAdmin = () => {
  return localStorage.getItem('is_staff') === 'true';  // Verifica se é admin
};

// Função para obter o ID do usuário logado
const getUserId = () => {
  return localStorage.getItem('user_id');  // Retorna o ID do usuário logado
};

// Função para logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('is_staff');  // Remove o status de admin no logout
  localStorage.removeItem('user_id');   // Remove o ID do usuário no logout
};

export default { login, getToken, isAdmin, getUserId, logout };
