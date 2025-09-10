import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Calendar, Music, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import MinistriesView from "@/components/visualizations/MinistriesView";
import SchedulesView from "@/components/visualizations/SchedulesView";
import MembersView from "@/components/visualizations/MembersView";
import EventConfirmationsView from "@/components/visualizations/EventConfirmationsView";
import DashboardOverview from "@/components/visualizations/DashboardOverview";

const Visualizations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 sm:pt-20 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-enhanced-contrast tracking-tight">Consultar Cadastros</h1>
          
          <Tabs defaultValue="schedules" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
              <TabsTrigger 
                value="schedules" 
                className="flex items-center gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Escalas Ativas</span>
                <span className="sm:hidden">Escalas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ministries" 
                className="flex items-center gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">Ministérios</span>
                <span className="sm:hidden">Ministérios</span>
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="flex items-center gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Todos os Membros</span>
                <span className="sm:hidden">Membros</span>
              </TabsTrigger>
              <TabsTrigger 
                value="confirmations" 
                className="flex items-center gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Confirmações</span>
                <span className="sm:hidden">Confirm.</span>
              </TabsTrigger>
            </TabsList>
            
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
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Visualizations;