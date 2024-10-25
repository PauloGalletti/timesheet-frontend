import React, { useState, useEffect } from "react";
import api from "../services/api"; // Importa a instância do Axios configurada em api.js
import authService from "../services/authService"; // Importa o authService para logout
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar"; // Importa o componente de calendário
import dayjs from "dayjs"; // Importando o dayjs para formatar a data

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // Armazena o dia selecionado
  const [entrada, setEntrada] = useState("");
  const [intervalo, setIntervalo] = useState("");
  const [saida, setSaida] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);  // Para definir se o novo usuário será admin
  const navigate = useNavigate(); // Define navigate para redirecionamento

  // Carrega a lista de usuários
  useEffect(() => {
    if (authService.isAdmin()) {
      api.get("/users/")
        .then(response => setUsers(response.data))
        .catch(error => console.error("Erro ao carregar usuários:", error));
    }
  }, []);

  // Adicionar usuário
  const addUser = async () => {
    try {
      await api.post("/users/", { username: newUsername, password: newPassword, is_staff: newIsAdmin });
      setUsers([...users, { username: newUsername }]);
      setNewUsername("");
      setNewPassword("");
      setNewIsAdmin(false);  // Reseta a opção de admin
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  // Remover usuário
  const deleteUser = async (username) => {
    try {
      await api.delete(`/users/${username}/`);
      setUsers(users.filter(user => user.username !== username));
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  // Função para lidar com o clique em um dia no calendário
  const handleDayClick = (day) => {
    setSelectedDay(day); // Armazena o dia selecionado
  };

  // Função para salvar os horários
    const handleSave = () => {
    if (!selectedDay) {
      alert("Por favor, selecione um dia válido.");
      return;
    }
  
    // Verificar o valor de selectedDay antes da formatação
    console.log("selectedDay antes da formatação:", selectedDay);
  
    // Formatando a data no formato esperado
    const formattedDate = dayjs(selectedDay).format('YYYY-MM-DD');
    console.log("Data formatada para salvar:", formattedDate);
  
    // Verificar o userId
    const userId = parseInt(authService.getUserId(), 10);
    if (!userId) {
      console.error("Erro: userId está nulo ou indefinido.");
      alert("Erro ao salvar os horários: Usuário não identificado.");
      return;
    }
  
    // Convertendo o intervalo em minutos para o formato hh:mm
    const [hours, minutes] = intervalo.split(":").map(Number);
    const intervaloEmMinutos = hours * 60 + minutes;
    const intervaloFormatado = `${Math.floor(intervaloEmMinutos / 60).toString().padStart(2, '0')}:${(intervaloEmMinutos % 60).toString().padStart(2, '0')}`;
  
    const timesheet = {
      date: formattedDate,
      user: userId,
      entrada,
      intervalo: intervaloFormatado,
      saida,
    };
  
    if (intervaloEmMinutos < 60) {
      alert("O intervalo deve ser no mínimo de 1 hora.");
      return;
    }
  
    // Enviando os dados para o backend
    api.post('/timesheet/', timesheet)
      .then(response => {
        console.log("Horários salvos com sucesso!");
        alert("Horários salvos com sucesso!");
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
    navigate("/login"); // Redireciona para a página de login
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard de Administração</h2>

      {/* Botão de Logout */}
      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>

      {/* Gerenciamento de Contas - Aparece apenas para Admin */}
      {authService.isAdmin() && (
        <section style={{ marginBottom: "40px" }}>
          <h3>Gerenciar Usuários</h3>
          <input
            type="text"
            placeholder="Novo Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={newIsAdmin}
              onChange={() => setNewIsAdmin(!newIsAdmin)}
            />
            Administrador
          </label>
          <button onClick={addUser}>Adicionar Usuário</button>
          <ul>
            {users.map(user => (
              <li key={user.username}>
                {user.username} <button onClick={() => deleteUser(user.username)}>Excluir</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Calendário principal */}
      <Calendar onDayClick={handleDayClick} /> {/* Passando a função de clique como prop */}

      {/* Mostrar o formulário de horários quando um dia for clicado */}
      {selectedDay && (
        <div style={{ marginTop: "20px" }}>
          <h3>Horários para o dia {selectedDay}</h3>
          <label>
            Horário de Entrada:
            <input type="time" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
          </label>
          <br />
          <label>
            Intervalo (mínimo de 1h):
            <input type="time" value={intervalo} onChange={(e) => setIntervalo(e.target.value)} />
          </label>
          <br />
          <label>
            Horário de Saída:
            <input type="time" value={saida} onChange={(e) => setSaida(e.target.value)} />
          </label>
          <br />
          <button onClick={handleSave}>Salvar Horários</button>
        </div>
      )}
    </div>
  );
};

// Estilo do botão de logout
const logoutButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#d9534f",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

export default Dashboard;
