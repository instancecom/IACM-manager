import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Music, CheckCircle } from "lucide-react";

const DashboardOverview = () => {
  // Mock data - será substituído pela integração com o banco de dados
  const stats = {
    totalMembers: 87,
    totalMinistries: 4,
    upcomingSchedules: 12,
    completedEvents: 8
  };

  const recentActivity = [
    { type: "schedule", message: "Nova escala de louvor criada para 24/08", time: "2 horas atrás" },
    { type: "member", message: "Maria Santos foi adicionada ao ministério de recepção", time: "5 horas atrás" },
    { type: "event", message: "Evento 'Culto da Família' foi criado", time: "1 dia atrás" },
    { type: "schedule", message: "Escala de obreiros atualizada", time: "2 dias atrás" }
  ];

  const ministries = [
    { name: "Louvor", members: 15, status: "Ativo" },
    { name: "Recepção", members: 8, status: "Ativo" },
    { name: "Marketing", members: 5, status: "Ativo" },
    { name: "Obreiros", members: 12, status: "Ativo" }
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              +5 novos este mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ministérios Ativos</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMinistries}</div>
            <p className="text-xs text-muted-foreground">
              Todos ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalas Próximas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSchedules}</div>
            <p className="text-xs text-muted-foreground">
              Próximos 30 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Realizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedEvents}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ministérios Resumo */}
        <Card>
          <CardHeader>
            <CardTitle>Ministérios</CardTitle>
            <CardDescription>Resumo dos ministérios ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ministries.map((ministry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Music className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{ministry.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {ministry.members} membros
                    </span>
                    <Badge variant="secondary">{ministry.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;