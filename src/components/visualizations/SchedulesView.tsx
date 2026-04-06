import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User, Phone, Mail, Loader2 } from "lucide-react";
import { useSchedules } from "@/hooks/useSchedules";

const SchedulesView = () => {
  const { schedules, loading, error } = useSchedules();

  if (loading) {
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
                <div key={schedule.id} className="border border-border/50 rounded-xl p-5 bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-200 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                        <AvatarImage src={schedule.members?.photo_url} />
                        <AvatarFallback>
                          <div className={`w-12 h-12 ${scheduleColors[schedule.schedule_type as keyof typeof scheduleColors]} rounded-lg flex items-center justify-center shadow-inner`}>
                            <User className="w-6 h-6 text-white" />
                          </div>
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg text-foreground leading-tight">
                            {schedule.members ? `${schedule.members.first_name} ${schedule.members.last_name}` : (schedule.external_person_name || "Pessoa não identificada")}
                          </h4>
                          {!schedule.members?.user_id && schedule.member_id && (
                            <Badge variant="outline" className="text-[10px] h-4 bg-muted/30 text-muted-foreground border-muted-foreground/20">
                              Sem conta
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${scheduleColors[schedule.schedule_type as keyof typeof scheduleColors]}`} />
                          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {scheduleLabels[schedule.schedule_type as keyof typeof scheduleLabels]}
                          </p>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(schedule.date)}
                  </div>
                  
                  {(schedule.members?.whatsapp || schedule.notes) && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-2 text-sm">
                      {schedule.members?.whatsapp && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <a 
                            href={`https://wa.me/55${schedule.members.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {schedule.members.whatsapp}
                          </a>
                        </div>
                      )}
                      {schedule.notes && (
                        <div className="bg-muted/50 p-2 rounded-md text-xs text-muted-foreground">
                          <strong>Observações:</strong> {schedule.notes}
                        </div>
                      )}
                    </div>
                  )}
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