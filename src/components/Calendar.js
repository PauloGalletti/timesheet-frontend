import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import './Calendar.css';

const Calendar = ({ onDayClick, filledDays }) => { 
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const nextMonth = () => {
    if (currentMonth.month() < 11 || currentMonth.year() < 2024) {
      setCurrentMonth(currentMonth.add(1, "month"));
    }
  };

  const previousMonth = () => {
    if (currentMonth.month() > 0 || currentMonth.year() > 2023) {
      setCurrentMonth(currentMonth.subtract(1, "month"));
    }
  };

  const generateDays = () => {
    const daysInMonth = currentMonth.daysInMonth();
    const firstDayOfMonth = currentMonth.startOf("month").day();
    const today = dayjs().format("YYYY-MM-DD");
    const daysArray = [];

    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = currentMonth.date(day).format('YYYY-MM-DD');
      const dayOfWeek = currentMonth.date(day).day(); // Obtendo o dia da semana (0 para Domingo, 6 para Sábado)

      let dayStatus = '';
      if (fullDate < today && dayOfWeek !== 0 && dayOfWeek !== 6) { // Verifica se não é sábado ou domingo
        dayStatus = filledDays[fullDate] ? '✔️' : '❌';
      }

      daysArray.push(
        <div key={day} className="calendar-day" onClick={() => onDayClick(fullDate)}>
          {day} {dayStatus && <span className={`day-status ${filledDays[fullDate] ? 'filled' : 'unfilled'}`}>{dayStatus}</span>}
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={previousMonth}>{"<"}</button>
        <h2>{currentMonth.format("MMMM YYYY")}</h2>
        <button onClick={nextMonth}>{">"}</button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day-name">Domingo</div>
        <div className="calendar-day-name">Segunda-Feira</div>
        <div className="calendar-day-name">Terça-Feira</div>
        <div className="calendar-day-name">Quarta-Feira</div>
        <div className="calendar-day-name">Quinta-Feira</div>
        <div className="calendar-day-name">Sexta-Feira</div>
        <div className="calendar-day-name">Sábado</div>
        {generateDays()}
      </div>
    </div>
  );
};

export default Calendar;
