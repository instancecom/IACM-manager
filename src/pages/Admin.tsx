import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Music, UserPlus, Settings, Globe, Shield, UserCog, ShieldCheck } from "lucide-react";
import EventsListPage from "@/components/admin/EventsListPage";
import RegisterStudentForm from "@/components/admin/RegisterStudentForm";
import CreateScheduleForm from "@/components/admin/CreateScheduleForm";
import RegisterMemberForm from "@/components/admin/RegisterMemberForm";
import RegisterMinistryForm from "@/components/admin/RegisterMinistryForm";
import ManageRecords from "@/components/admin/ManageRecords";
import BannerManager from "@/components/admin/BannerManager";
import { RolesManager } from "@/components/admin/RolesManager";
import SecurityChecklist from "@/components/admin/SecurityChecklist";
import { useRoles } from "@/hooks/useRoles";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { canEdit, isAdmin, loading } = useRoles();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-16 lg:pt-20 container mx-auto px-2 lg:px-4 py-4 lg:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-16 lg:pt-20 container mx-auto px-2 lg:px-4 py-4 lg:py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Você não tem permissão para acessar o painel administrativo.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20 container mx-auto px-2 lg:px-4 py-4 lg:py-8">
        <div className="max-w-7xl mx-auto space-y-4 lg:space-y-8">
          {/* Header Section with Better Typography - Mobile Optimized */}
          <div className="space-y-2 lg:space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-foreground">Painel Administrativo</h1>
                <p className="text-muted-foreground text-sm lg:text-lg hidden sm:block">Gerencie todos os aspectos da sua comunidade</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="events" className="w-full animate-scale-in">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Navigation Sidebar/Menu */}
              <div className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 lg:p-6 sticky top-24">
                  <nav className="space-y-6">
                    {/* Conteúdo Group */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Conteúdo</p>
                      <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 w-full">
                        <TabsTrigger 
                          value="events" 
                          className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                        >
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">Eventos</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="site" 
                          className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                        >
                          <Globe className="w-4 h-4" />
                          <span className="text-sm font-medium">Site (Banners)</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Comunidade Group */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Comunidade</p>
                      <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 w-full">
                        <TabsTrigger 
                          value="members" 
                          className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span className="text-sm font-medium">Membros</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="ministries" 
                          className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                        >
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Ministérios</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="students" 
                          className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                        >
                          <Music className="w-4 h-4" />
                          <span className="text-sm font-medium">Alunos</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="schedule" 
                          className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                        >
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">Escalas</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Sistema Group */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Sistema</p>
                      <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 w-full">
                        <TabsTrigger 
                          value="manage" 
                          className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">Gerenciar Dados</span>
                        </TabsTrigger>
                        {isAdmin && (
                          <>
                            <TabsTrigger 
                              value="roles" 
                              className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                            >
                              <UserCog className="w-4 h-4" />
                              <span className="text-sm font-medium">Acessos</span>
                            </TabsTrigger>
                            <TabsTrigger 
                              value="security" 
                              className="w-full justify-start gap-3 px-3 py-2.5 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/20 transition-all duration-200"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span className="text-sm font-medium">Segurança</span>
                            </TabsTrigger>
                          </>
                        )}
                      </TabsList>
                    </div>
                  </nav>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 min-w-0">
            
            <TabsContent value="events" className="mt-4 lg:mt-8 animate-fade-in">
              <EventsListPage />
            </TabsContent>
            
            <TabsContent value="students" className="mt-4 lg:mt-8 animate-fade-in">
              <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                      <Music className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg lg:text-xl font-semibold">Cadastrar Aluno no Ministério</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm lg:text-base">
                        Adicione um novo aluno a um ministério específico
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <RegisterStudentForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-4 lg:mt-8 animate-fade-in">
              <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                      <Users className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg lg:text-xl font-semibold">Criar Escala</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm lg:text-base">
                        Organize as escalas dos ministérios
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <CreateScheduleForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="members" className="mt-4 lg:mt-8 animate-fade-in">
              <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                      <UserPlus className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg lg:text-xl font-semibold">Cadastrar Membro</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm lg:text-base">
                        Adicione um novo membro à comunidade
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <RegisterMemberForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ministries" className="mt-4 lg:mt-8 animate-fade-in">
              <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                      <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg lg:text-xl font-semibold">Cadastrar Ministério</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm lg:text-base">
                        Crie novos ministérios para organizar a comunidade
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <RegisterMinistryForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="site" className="mt-4 lg:mt-8 animate-fade-in">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                  <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                    <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-semibold">Gerenciamento do Site</h2>
                    <p className="text-muted-foreground text-sm lg:text-base">Configure banners e conteúdo público</p>
                  </div>
                </div>
                <BannerManager />
              </div>
            </TabsContent>
            
            <TabsContent value="manage" className="mt-4 lg:mt-8 animate-fade-in">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                  <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                    <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-semibold">Gerenciar Registros</h2>
                    <p className="text-muted-foreground text-sm lg:text-base">Visualize, edite e organize todos os dados</p>
                  </div>
                </div>
                <ManageRecords />
              </div>
            </TabsContent>
            
            {isAdmin && (
              <>
                <TabsContent value="roles" className="mt-4 lg:mt-8 animate-fade-in">
                  <div className="space-y-4 lg:space-y-6">
                    <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                      <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                        <UserCog className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg lg:text-xl font-semibold">Gerenciar Acessos</h2>
                        <p className="text-muted-foreground text-sm lg:text-base">Atribua roles aos usuários do sistema</p>
                      </div>
                    </div>
                    <RolesManager />
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-4 lg:mt-8 animate-fade-in">
                  <SecurityChecklist />
                </TabsContent>
              </>
            )}
              </div>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;