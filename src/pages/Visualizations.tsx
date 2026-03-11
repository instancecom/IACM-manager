import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Music, CheckCircle, ShieldAlert } from "lucide-react";
import MinistriesView from "@/components/visualizations/MinistriesView";
import SchedulesView from "@/components/visualizations/SchedulesView";
import MembersView from "@/components/visualizations/MembersView";
import EventConfirmationsView from "@/components/visualizations/EventConfirmationsView";
import DashboardOverview from "@/components/visualizations/DashboardOverview";
import { useRoles } from "@/hooks/useRoles";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Visualizations = () => {
  const { canRead, loading: rolesLoading } = useRoles();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user || !canRead) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <ShieldAlert className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-bold text-foreground">Acesso Negado</h2>
            <p className="text-muted-foreground text-center">
              Você não tem permissão para acessar esta página.
            </p>
            <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 sm:pt-20 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-enhanced-contrast tracking-tight">Consultar Cadastros</h1>
          
          <Tabs defaultValue="confirmations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-card border border-border p-2 h-auto">
              <TabsTrigger 
                value="confirmations" 
                className="flex items-center justify-center gap-1.5 sm:gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-auto py-3 px-2 sm:px-3 sm:h-10"
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span className="text-xs sm:text-sm truncate">Confirmações</span>
              </TabsTrigger>
              <TabsTrigger 
                value="schedules" 
                className="flex items-center justify-center gap-1.5 sm:gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-auto py-3 px-2 sm:px-3 sm:h-10"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="text-xs sm:text-sm truncate">Escalas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="flex items-center justify-center gap-1.5 sm:gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-auto py-3 px-2 sm:px-3 sm:h-10"
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="text-xs sm:text-sm truncate">Membros</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ministries" 
                className="flex items-center justify-center gap-1.5 sm:gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-auto py-3 px-2 sm:px-3 sm:h-10"
              >
                <Music className="w-4 h-4 shrink-0" />
                <span className="text-xs sm:text-sm truncate">Ministérios</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="confirmations" className="mt-6">
              <Card className="border-border shadow-lg">
                <CardHeader className="bg-card">
                  <CardTitle className="text-xl font-bold text-card-foreground">Confirmações de Eventos</CardTitle>
                  <CardDescription className="text-enhanced-muted">
                    Visualize quem confirmou presença em cada evento
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <EventConfirmationsView />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedules" className="mt-6">
              <Card className="border-border shadow-lg">
                <CardHeader className="bg-card">
                  <CardTitle className="text-xl font-bold text-card-foreground">Escalas dos Próximos Dias</CardTitle>
                  <CardDescription className="text-enhanced-muted">
                    Veja quem está escalado para os próximos eventos e ministérios
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <SchedulesView />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="members" className="mt-6">
              <Card className="border-border shadow-lg">
                <CardHeader className="bg-card">
                  <CardTitle className="text-xl font-bold text-card-foreground">Lista Completa de Membros</CardTitle>
                  <CardDescription className="text-enhanced-muted">
                    Todos os membros cadastrados na comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <MembersView />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ministries" className="mt-6">
              <Card className="border-border shadow-lg">
                <CardHeader className="bg-card">
                  <CardTitle className="text-xl font-bold text-card-foreground">Membros por Ministério</CardTitle>
                  <CardDescription className="text-enhanced-muted">
                    Consulte todos os membros cadastrados em cada ministério
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <MinistriesView />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Visualizations;