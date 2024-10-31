import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import './Admin2.css';

const Admin2 = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Estágio");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEmployee = {
        username,
        email,
        name,
        password,
        role,
        is_admin: isAdmin,
    };

    api.post("/users/", newEmployee)
        .then(response => {
            console.log("Funcionário registrado com sucesso!", response.data);
            alert("Funcionário registrado com sucesso!");
            navigate("/dashboard");
        })
        .catch(error => {
            console.error("Erro ao registrar funcionário:", error.response ? error.response.data : error.message);
            alert(`Erro ao registrar funcionário: ${JSON.stringify(error.response.data)}`);
        });
    };
  return (
    <div className="admin2-container">
      <h1>Registrar Funcionário</h1>
      <button onClick={() => navigate("/dashboard")} className="btn btn-secondary back-button">Voltar</button>
      <form onSubmit={handleSubmit} className="admin2-form">
        <div className="form-group">
          <label>Usuário:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Nome:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Cargo:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="Estágio">Estágio</option>
            <option value="1">Nível 1</option>
            <option value="2">Nível 2</option>
            <option value="3">Nível 3</option>
          </select>
        </div>
        <div className="form-group">
          <label>Administrador:</label>
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
};

export default Admin2;
