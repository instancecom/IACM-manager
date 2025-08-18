import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User, Phone, Mail, Loader2 } from "lucide-react";
import { useSchedules } from "@/hooks/useSchedules";

const SchedulesView = () => {
  const { data: schedules = [], isLoading, error } = useSchedules();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Carregando escalas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium text-destructive mb-2">
            Erro ao carregar escalas
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Tente novamente mais tarde.
          </p>
        </CardContent>
      </Card>
    );
  }

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

  const getStatusBadge = (scheduleDate: string) => {
    const today = new Date();
    const scheduleDay = new Date(scheduleDate);
    
    if (scheduleDay < today) {
      return <Badge variant="secondary">Realizada</Badge>;
    } else if (scheduleDay.toDateString() === today.toDateString()) {
      return <Badge variant="default">Hoje</Badge>;
    } else {
      return <Badge variant="outline">Agendada</Badge>;
    }
  };

  // Agrupar escalas por data
  const schedulesByDate = schedules.reduce((acc, schedule) => {
    const dateKey = format(new Date(schedule.date), "yyyy-MM-dd");
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
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={schedule.members?.photo_url} />
                        <AvatarFallback>
                          <div className={`w-10 h-10 ${scheduleColors[schedule.schedule_type as keyof typeof scheduleColors]} rounded-lg flex items-center justify-center`}>
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">
                          {schedule.members?.first_name} {schedule.members?.last_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {scheduleLabels[schedule.schedule_type as keyof typeof scheduleLabels]}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(schedule.date)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {schedule.members?.whatsapp && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a 
                          href={`https://wa.me/55${schedule.members.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                        >
                          {schedule.members.whatsapp}
                        </a>
                      </div>
                    )}
                    {schedule.notes && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Observações:</strong> {schedule.notes}
                      </div>
                    )}
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