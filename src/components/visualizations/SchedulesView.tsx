import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User, Phone, Mail } from "lucide-react";

const SchedulesView = () => {
  // Mock data - será substituído pela integração com o banco de dados
  const schedules = [
    {
      id: 1,
      scheduleType: "louvor",
      date: new Date("2025-08-24T19:00:00"),
      personName: "João Silva",
      phone: "(11) 99999-1111",
      email: "joao@email.com",
      status: "confirmed"
    },
    {
      id: 2,
      scheduleType: "recepcao",
      date: new Date("2025-08-25T09:00:00"),
      personName: "Maria Santos",
      phone: "(11) 99999-2222",
      email: "maria@email.com",
      status: "confirmed"
    },
    {
      id: 3,
      scheduleType: "marketing",
      date: new Date("2025-08-27T15:00:00"),
      personName: "Pedro Costa",
      phone: "(11) 99999-3333",
      email: "pedro@email.com",
      status: "pending"
    },
    {
      id: 4,
      scheduleType: "obreiros",
      date: new Date("2025-08-30T18:00:00"),
      personName: "Ana Silva",
      phone: "(11) 99999-4444",
      email: "ana@email.com",
      status: "confirmed"
    },
    {
      id: 5,
      scheduleType: "louvor",
      date: new Date("2025-08-31T19:00:00"),
      personName: "Carlos Oliveira",
      phone: "(11) 99999-5555",
      email: "carlos@email.com",
      status: "confirmed"
    }
  ];

  const scheduleLabels = {
    louvor: "Louvor",
    marketing: "Marketing",
    recepcao: "Recepção",
    obreiros: "Obreiros"
  };

  const scheduleColors = {
    louvor: "bg-blue-500",
    marketing: "bg-purple-500",
    recepcao: "bg-green-500",
    obreiros: "bg-orange-500"
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default" className="bg-green-600">Confirmado</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">Não definido</Badge>;
    }
  };

  // Agrupar escalas por data
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    const dateKey = format(schedule.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(schedule);
    return acc;
  }, {} as Record<string, typeof schedules>);

  // Ordenar datas
  const sortedDates = Object.keys(schedulesByDate).sort();

  return (
    <div className="space-y-6">
      {/* Escalas Próximas por Data */}
      {sortedDates.map((dateKey) => (
        <Card key={dateKey}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {format(new Date(dateKey), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              {schedulesByDate[dateKey].length} pessoa(s) escalada(s) para este dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedulesByDate[dateKey].map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${scheduleColors[schedule.scheduleType as keyof typeof scheduleColors]} rounded-lg flex items-center justify-center`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{schedule.personName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {scheduleLabels[schedule.scheduleType as keyof typeof scheduleLabels]}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(schedule.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{format(schedule.date, "HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={`https://wa.me/55${schedule.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                      >
                        {schedule.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">{schedule.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {schedules.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma escala encontrada</h3>
          <p className="text-muted-foreground">
            Não há escalas cadastradas para os próximos dias.
          </p>
        </div>
      )}
    </div>
  );
};

export default SchedulesView;