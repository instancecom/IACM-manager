import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface EventStatus {
  status: 'upcoming' | 'active' | 'finished';
  label: string;
  color: string;
}

export const getEventStatus = (startDate: string, startTime: string, endDate: string, endTime: string): EventStatus => {
  const now = new Date();
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);
  
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

export const formatEventDateTime = (date: string, time: string) => {
  const dateTime = new Date(`${date}T${time}`);
  return {
    date: format(parseISO(date), "dd 'de' MMMM, yyyy", { locale: ptBR }),
    time: format(parseISO(`1970-01-01T${time}`), "HH:mm"),
    dateTime: dateTime
  };
};

export const formatEventDateTimeRange = (startDate: string, startTime: string, endDate: string, endTime: string) => {
  const start = formatEventDateTime(startDate, startTime);
  const end = formatEventDateTime(endDate, endTime);
  
  // Se for o mesmo dia
  if (startDate === endDate) {
    return `${start.date} das ${start.time} às ${end.time}`;
  } else {
    return `${start.date} ${start.time} até ${end.date} ${end.time}`;
  }
};