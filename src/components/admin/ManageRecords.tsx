import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Music, Users, UserPlus } from "lucide-react";
import EventsList from "./EventsList";
import StudentsList from "./StudentsList";
import SchedulesList from "./SchedulesList";
import MembersList from "./MembersList";

const ManageRecords = () => {
  return (
    <Tabs defaultValue="events" className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="w-full min-w-fit grid grid-cols-4 h-auto p-2 bg-card/50 backdrop-blur-sm border border-border/50">
          <TabsTrigger 
            value="events" 
            className="flex items-center gap-1 lg:gap-2 p-2 lg:p-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 hover:bg-secondary/50 min-w-[100px]"
          >
            <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="font-medium text-xs lg:text-sm">Eventos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="students" 
            className="flex items-center gap-1 lg:gap-2 p-2 lg:p-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 hover:bg-secondary/50 min-w-[100px]"
          >
            <Music className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="font-medium text-xs lg:text-sm">Alunos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="schedules" 
            className="flex items-center gap-1 lg:gap-2 p-2 lg:p-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 hover:bg-secondary/50 min-w-[100px]"
          >
            <Users className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="font-medium text-xs lg:text-sm">Escalas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="members" 
            className="flex items-center gap-1 lg:gap-2 p-2 lg:p-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200 hover:bg-secondary/50 min-w-[100px]"
          >
            <UserPlus className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="font-medium text-xs lg:text-sm">Membros</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="events" className="mt-4 lg:mt-6 animate-fade-in">
        <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg lg:text-xl font-semibold">Gerenciar Eventos</CardTitle>
                <CardDescription className="text-muted-foreground text-sm lg:text-base">
                  Visualize, edite ou exclua eventos cadastrados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <EventsList />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="students" className="mt-4 lg:mt-6 animate-fade-in">
        <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                <Music className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg lg:text-xl font-semibold">Gerenciar Alunos dos Ministérios</CardTitle>
                <CardDescription className="text-muted-foreground text-sm lg:text-base">
                  Visualize, edite ou exclua alunos cadastrados nos ministérios
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <StudentsList />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="schedules" className="mt-4 lg:mt-6 animate-fade-in">
        <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg lg:text-xl font-semibold">Gerenciar Escalas</CardTitle>
                <CardDescription className="text-muted-foreground text-sm lg:text-base">
                  Visualize, edite ou exclua escalas criadas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <SchedulesList />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="members" className="mt-4 lg:mt-6 animate-fade-in">
        <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
                <UserPlus className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg lg:text-xl font-semibold">Gerenciar Membros</CardTitle>
                <CardDescription className="text-muted-foreground text-sm lg:text-base">
                  Visualize, edite ou exclua membros cadastrados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <MembersList />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ManageRecords;