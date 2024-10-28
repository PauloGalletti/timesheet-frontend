import React, { useState, useEffect } from "react";
import api from "../services/api";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import './Admin.css';

const Admin = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();

  // Carrega a lista de clientes e projetos ao montar o componente
  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  const fetchClients = () => {
    api.get("/clients/")
      .then(response => setClients(response.data))
      .catch(error => console.error("Erro ao carregar clientes:", error));
  };

  const fetchProjects = () => {
    api.get("/projects/")
      .then(response => setProjects(response.data))
      .catch(error => console.error("Erro ao carregar projetos:", error));
  };

  // Cria um novo cliente
  const handleCreateClient = () => {
    if (!clientName) {
      alert("Por favor, insira o nome do cliente.");
      return;
    }

    api.post("/clients/", { name: clientName })
      .then(response => {
        setClients([...clients, response.data]);
        setClientName("");
      })
      .catch(error => console.error("Erro ao criar cliente:", error));
  };

  // Cria um novo projeto
  const handleCreateProject = () => {
    if (!selectedClient || !projectName) {
      alert("Por favor, selecione um cliente e insira o nome do projeto.");
      return;
    }

    const newProject = {
      name: projectName,
      description: projectDescription,
      client: selectedClient.id,
    };

    api.post("/projects/", newProject)
      .then(response => {
        setProjects([...projects, response.data]);
        setProjectName("");
        setProjectDescription("");
      })
      .catch(error => console.error("Erro ao criar projeto:", error));
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel de Administração</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      <section className="client-management">
        <h2>Criar Cliente</h2>
        <input
          type="text"
          placeholder="Nome do Cliente"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="input"
        />
        <button onClick={handleCreateClient} className="btn btn-success">Criar Cliente</button>
      </section>

      <section className="project-management">
        <h2>Criar Projeto</h2>
        <select
          value={selectedClient ? selectedClient.id : ""}
          onChange={(e) => setSelectedClient(clients.find(client => client.id === parseInt(e.target.value)))}
          className="input"
        >
          <option value="">Selecione um Cliente</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nome do Projeto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="input"
        />
        <button onClick={handleCreateProject} className="btn btn-success">Criar Projeto</button>
      </section>

      <section className="client-list">
        <h2>Clientes Existentes</h2>
        <ul>
          {clients.map(client => (
            <li key={client.id}>
              <strong>{client.name}</strong>
              <ul>
                {projects
                  .filter(project => project.client === client.id)
                  .map(project => (
                    <li key={project.id}>{project.name}</li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
