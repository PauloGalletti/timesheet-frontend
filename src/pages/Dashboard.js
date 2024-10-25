import React, { useState, useEffect } from "react";
import api from "../services/api";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import dayjs from "dayjs";
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Armazena o usuário selecionado para análise
  const [selectedDay, setSelectedDay] = useState(null);
  const [entrada, setEntrada] = useState("");
  const [intervalo, setIntervalo] = useState("");
  const [saida, setSaida] = useState("");
  const [filledDays, setFilledDays] = useState({});
  const navigate = useNavigate();

  // Carrega a lista de usuários se for admin
  useEffect(() => {
    if (authService.isAdmin()) {
      api.get("/users/")
        .then(response => setUsers(response.data))
        .catch(error => console.error("Erro ao carregar usuários:", error));
    }
    fetchFilledDays(); // Carrega os dias preenchidos para o usuário logado ou o selecionado
  }, []);

  // Carrega os dias preenchidos para um usuário específico (ou o logado)
  const fetchFilledDays = (userId = null) => {
    const id = userId || parseInt(authService.getUserId(), 10); // Pega o ID correto (logado ou selecionado)
    
    api.get(`/timesheet/?user=${id}`)
      .then(response => {
        const days = {};
        response.data.forEach(entry => {
          // Armazena os dados do timesheet apenas para o usuário selecionado ou logado
          if (entry.user === id) {
            days[entry.date] = entry;
          }
        });
        setFilledDays(days);
      })
      .catch(error => console.error("Erro ao carregar os dias preenchidos:", error));
  };

  // Função para analisar as horas de outro usuário (somente admin)
  const handleAnalyzeHours = (user) => {
    setSelectedUser(user); // Seleciona o usuário
    fetchFilledDays(user.id); // Carrega os dias preenchidos daquele usuário
  };

  // Função para retornar ao calendário do usuário logado
  const handleReturnToMyCalendar = () => {
    setSelectedUser(null); // Define como nulo para voltar ao próprio calendário
    fetchFilledDays(); // Recarrega os dias do usuário logado
  };

  // Função para carregar as horas do dia clicado no calendário
  const handleDayClick = (day) => {
    setSelectedDay(day);

    if (filledDays[day]) {
      setEntrada(filledDays[day].entrada);
      setIntervalo(filledDays[day].intervalo);
      setSaida(filledDays[day].saida);
    } else {
      // Limpa os campos se o dia não estiver preenchido
      setEntrada("");
      setIntervalo("");
      setSaida("");
    }
  };

  // Função para salvar os horários no backend
  const handleSave = () => {
    const formattedDate = dayjs(selectedDay).format('YYYY-MM-DD');
    const userId = selectedUser ? selectedUser.id : parseInt(authService.getUserId(), 10);

    if (!userId) {
      console.error("Erro: userId está nulo ou indefinido.");
      alert("Erro ao salvar os horários: Usuário não identificado.");
      return;
    }

    const timesheet = {
      date: formattedDate,
      user: userId,
      entrada,
      intervalo,
      saida,
    };

    // Verifica se o intervalo tem pelo menos 1 hora
    const [hours, minutes] = intervalo.split(":").map(Number);
    if (hours * 60 + minutes < 60) {
      alert("O intervalo deve ser no mínimo de 1 hora.");
      return;
    }

    api.post('/timesheet/', timesheet)
      .then(response => {
        console.log("Horários salvos com sucesso!");
        alert("Horários salvos com sucesso!");
        fetchFilledDays(selectedUser ? selectedUser.id : null);  // Atualiza os dias preenchidos após salvar
        setEntrada("");
        setIntervalo("");
        setSaida("");
      })
      .catch(error => {
        console.error("Erro ao salvar os horários", error.response ? error.response.data : error.message);
        alert("Erro ao salvar os horários.");
      });
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const deleteUser = (username) => {
    api.delete(`/users/${username}/`)
      .then(() => {
        setUsers(users.filter(user => user.username !== username));
      })
      .catch(error => console.error("Erro ao deletar usuário:", error));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard de Administração</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {/* Gerenciamento de Contas - Aparece apenas para Admin */}
      {authService.isAdmin() && (
        <section className="user-management">
          <h2>Gerenciar Usuários</h2>
          <ul className="user-list">
            {users.map(user => (
              <li key={user.username} className="user-item">
                <span>{user.username}</span>
                <button className="btn btn-primary" onClick={() => handleAnalyzeHours(user)}>Analisar Horas</button>
                <button className="btn btn-danger" onClick={() => deleteUser(user.username)}>Excluir</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Botão para retornar ao próprio calendário (aparece apenas ao analisar outro usuário) */}
      {selectedUser && (
        <button onClick={handleReturnToMyCalendar} className="btn btn-secondary">
          Voltar ao meu calendário
        </button>
      )}

      {/* Exibe o nome do usuário cujas horas estão sendo analisadas */}
      {selectedUser && (
        <div className="user-hours">
          <h3>Planilha de Horas: {selectedUser.username}</h3>
        </div>
      )}

      {/* Exibe o calendário para o usuário logado ou o selecionado */}
      <Calendar onDayClick={handleDayClick} filledDays={filledDays} />

      {/* Formulário de horários para o dia selecionado */}
      {selectedDay && (
        <div className="time-form">
          <h3>Horários para o dia {selectedDay}</h3>
          <label>
            Horário de Entrada:
            <input type="time" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
          </label>
          <label>
            Intervalo (mínimo de 1h):
            <input type="time" value={intervalo} onChange={(e) => setIntervalo(e.target.value)} />
          </label>
          <label>
            Horário de Saída:
            <input type="time" value={saida} onChange={(e) => setSaida(e.target.value)} />
          </label>
          <button onClick={handleSave} className="btn btn-success">Salvar Horários</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
