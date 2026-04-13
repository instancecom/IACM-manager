import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface EventStatus {
  status: 'upcoming' | 'active' | 'finished';
  label: string;
  color: string;
}

export const getEventStatus = (startDate: string, startTime?: string, endDate?: string, endTime?: string): EventStatus => {
  const now = new Date();
  
  // Use start of day if startTime is missing
  const startDateTime = startTime 
    ? new Date(`${startDate}T${startTime}`)
    : new Date(`${startDate}T00:00:00`);
    
  // Use startDate and end of day if endDate/endTime are missing
  const effectiveEndDate = endDate || startDate;
  const endDateTime = endTime
    ? new Date(`${effectiveEndDate}T${endTime}`)
    : new Date(`${effectiveEndDate}T23:59:59`);
  
  if (endDateTime < now) {
    return {
      status: 'finished',
      label: 'Finalizado',
      color: 'bg-gray-600'
    };
  } else if (startDateTime <= now && endDateTime >= now) {
    return {
      status: 'active',
      label: 'Acontecendo agora',
      color: 'bg-green-600'
    };
  } else {
    return {
      status: 'upcoming',
      label: 'Próximo',
      color: 'bg-blue-600'
    };
  }
};

export const formatEventDateTime = (date: string, time?: string) => {
  const dateObj = parseISO(date);
  
  if (!time) {
    return {
      date: format(dateObj, "dd 'de' MMMM, yyyy", { locale: ptBR }),
      time: null,
      dateTime: dateObj
    };
  }

  const dateTime = new Date(`${date}T${time}`);
  return {
    date: format(dateObj, "dd 'de' MMMM, yyyy", { locale: ptBR }),
    time: format(new Date(`1970-01-01T${time}`), "HH:mm"),
    dateTime: dateTime
  };
};

export const formatEventDateTimeRange = (startDate: string, startTime?: string, endDate?: string, endTime?: string) => {
  const start = formatEventDateTime(startDate, startTime);
  const effectiveEndDate = endDate || startDate;
  const end = formatEventDateTime(effectiveEndDate, endTime);
  
  // Se for o mesmo dia
  if (startDate === effectiveEndDate) {
    if (!startTime && !endTime) {
      return start.date;
    }
    if (startTime && !endTime) {
      return `${start.date} às ${start.time}`;
    }
    if (!startTime && endTime) {
      return `${start.date} até às ${end.time}`;
    }
    return `${start.date} das ${start.time} às ${end.time}`;
  } else {
    const startTimeStr = startTime ? ` ${start.time}` : '';
    const endTimeStr = endTime ? ` ${end.time}` : '';
    return `${start.date}${startTimeStr} até ${end.date}${endTimeStr}`;
  }
};