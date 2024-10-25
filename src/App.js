import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import authService from "./services/authService"; // Importa o authService para verificar autenticação

// Rota protegida, acessível apenas se o usuário estiver autenticado
const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!authService.getToken(); // Verifica se o token existe
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* Rota protegida para o dashboard */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
