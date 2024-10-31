import React, { useState, useEffect } from "react";
import api from "../services/api";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import dayjs from "dayjs";
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [client, setClient] = useState(null);
  const [project, setProject] = useState(null);
  const [atendimento, setAtendimento] = useState("Sustentação");
  const [detalhes, setDetalhes] = useState("");
  const [obs, setObs] = useState("");
  const [entrada, setEntrada] = useState("");
  const [intervalo, setIntervalo] = useState("");
  const [saida, setSaida] = useState("");
  const [filledDays, setFilledDays] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAdmin()) {
      api.get("/users/")
        .then(response => setUsers(response.data))
        .catch(error => console.error("Erro ao carregar usuários:", error));
    }
    api.get("/clients/")
      .then(response => setClients(response.data))
      .catch(error => console.error("Erro ao carregar clientes:", error));

    api.get("/projects/")
      .then(response => setProjects(response.data))
      .catch(error => console.error("Erro ao carregar projetos:", error));

    fetchFilledDays();
  }, []);

  const fetchFilledDays = (userId = null) => {
    const id = userId || parseInt(authService.getUserId(), 10);
    api.get(`/timesheet/?user=${id}`)
      .then(response => {
        const days = {};
        response.data.forEach(entry => {
          if (entry.user === id) {
            days[entry.date] = entry;
          }
        });
        setFilledDays(days);
      })
      .catch(error => console.error("Erro ao carregar os dias preenchidos:", error));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (filledDays[day]) {
      const entry = filledDays[day];
      setEntrada(entry.entrada);
      setIntervalo(entry.intervalo);
      setSaida(entry.saida);
      setClient(entry.client);
      setProject(entry.project);
      setAtendimento(entry.atendimento);
      setDetalhes(entry.detalhes);
      setObs(entry.obs);
    } else {
      setEntrada("");
      setIntervalo("");
      setSaida("");
      setClient(null);
      setProject(null);
      setAtendimento("Sustentação");
      setDetalhes("");
      setObs("");
    }
  };

  const handleSave = () => {
    const formattedDate = dayjs(selectedDay).format('YYYY-MM-DD');
    const userId = selectedUser ? selectedUser.id : parseInt(authService.getUserId(), 10);

    if (!userId) {
      console.error("Erro: userId está nulo ou indefinido.");
      alert("Erro ao salvar os horários: Usuário não identificado.");
      return;
    }

    if (!client) {
      alert("Por favor, selecione um cliente.");
      return;
    }

    if (!project) {
      alert("Por favor, selecione um projeto.");
      return;
    }

    const timesheet = {
      date: formattedDate,
      user: userId,
      client,
      project,
      atendimento,
      detalhes,
      obs,
      entrada,
      intervalo,
      saida,
    };

    api.post('/timesheet/', timesheet)
      .then(response => {
        console.log("Horários salvos com sucesso!");
        alert("Horários salvos com sucesso!");
        fetchFilledDays(selectedUser ? selectedUser.id : null);
        setEntrada("");
        setIntervalo("");
        setSaida("");
        setClient(null);
        setProject(null);
        setAtendimento("Sustentação");
        setDetalhes("");
        setObs("");
      })
      .catch(error => {
        console.error("Erro ao salvar os horários", error.response ? error.response.data : error.message);
        alert("Erro ao salvar os horários.");
      });
  };

  const handleUserSelection = () => {
    if (selectedUser) {
      fetchFilledDays(selectedUser.id);
    } else {
      alert("Por favor, selecione um funcionário.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bem Vindo! -Variavel pendente ou não-</h1>
        <button onClick={() => {
          authService.logout();
          navigate("/login");
        }} className="btn btn-danger">Logout</button>
      </div>

      {authService.isAdmin() && (
        <div className="admin-tools">
          <button onClick={() => navigate('/admin')} className="btn btn-primary">Acessar Administração</button>
          <button onClick={() => navigate('/admin2')} className="btn btn-secondary">Registrar Funcionário</button>
          <h2>Gerenciar Usuários</h2>
          <div className="form-group">
            <label>Selecionar Funcionário:</label>
            <select
              className="input-select"
              value={selectedUser ? selectedUser.id : ""}
              onChange={(e) => {
                const userId = parseInt(e.target.value, 10);
                const user = users.find(u => u.id === userId);
                setSelectedUser(user || null);
              }}
            >
              <option value="">Selecione um funcionário</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>
          <button onClick={handleUserSelection} className="btn btn-secondary">Ver Planilha</button>
        </div>
      )}

      <Calendar onDayClick={handleDayClick} filledDays={filledDays} />

      {selectedDay && (
        <div className="time-form">
          <h3>Horários para o dia {selectedDay}</h3>
          <div className="form-group">
            <label>Cliente:</label>
            <select className="input-select" value={client || ""} onChange={(e) => {
              const selectedClient = parseInt(e.target.value, 10);
              setClient(selectedClient);
              setProject(null);
            }}>
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Projeto:</label>
            <select className="input-select" value={project || ""} onChange={(e) => setProject(parseInt(e.target.value, 10))}>
              <option value="">Selecione um projeto</option>
              {projects.filter(proj => proj.client === client).map(proj => (
                <option key={proj.id} value={proj.id}>{proj.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Atendimento:</label>
            <select className="input-select" value={atendimento} onChange={(e) => setAtendimento(e.target.value)}>
              <option value="Sustentação">Sustentação</option>
              <option value="Projetos">Projetos</option>
              <option value="Atividades Internas">Atividades Internas</option>
            </select>
          </div>
          <div className="form-group">
            <label>Detalhes:</label>
            <textarea className="input-textarea" value={detalhes} onChange={(e) => setDetalhes(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Observações:</label>
            <textarea className="input-textarea" value={obs} onChange={(e) => setObs(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Horário de Entrada:</label>
            <input className="input-time" type="time" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Intervalo (mínimo de 1h):</label>
            <input className="input-time" type="time" value={intervalo} onChange={(e) => setIntervalo(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Horário de Saída:</label>
            <input className="input-time" type="time" value={saida} onChange={(e) => setSaida(e.target.value)} />
          </div>
          <button onClick={handleSave} className="btn btn-success">Salvar Horários</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
