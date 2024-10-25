import React, { useState } from "react";

const DayDetails = ({ selectedDay, onSave }) => {
  const [entrada, setEntrada] = useState("");
  const [intervalo, setIntervalo] = useState("");
  const [saida, setSaida] = useState("");

  const handleSubmit = () => {
    onSave({
      day: selectedDay,
      entrada,
      intervalo,
      saida,
    });
    // Limpa os campos após salvar
    setEntrada("");
    setIntervalo("");
    setSaida("");
  };

  return (
    <div className="day-details">
      <h3>Horários para o dia {selectedDay}</h3>
        <label>
            Horário de Entrada:
            <input type="time" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
        </label>
        <label>
            Intervalo (mínimo de 1h):
            <input type="text" placeholder="01:00" value={intervalo} onChange={(e) => setIntervalo(e.target.value)} />
        </label>
        <label>
            Horário de Saída:
            <input type="time" value={saida} onChange={(e) => setSaida(e.target.value)} />
        </label>
      <button onClick={handleSubmit}>Salvar</button>
    </div>
  );
};

export default DayDetails;
