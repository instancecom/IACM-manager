import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import CreateEventForm from "@/components/admin/CreateEventForm";
import EventsList from "@/components/admin/EventsList";
import { useEvents } from "@/hooks/useEvents";

const EventsListPage = () => {
  const { fetchEvents } = useEvents();

  return (
    <div className="space-y-6">
      <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg lg:text-xl font-semibold">Criar Novo Evento</CardTitle>
              <CardDescription className="text-muted-foreground text-sm lg:text-base">
                Adicione um novo evento para a comunidade
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <CreateEventForm onEventCreated={fetchEvents} />
        </CardContent>
      </Card>

      <Card className="netflix-card border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-4 lg:p-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="p-1.5 lg:p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg lg:text-xl font-semibold">Eventos Cadastrados</CardTitle>
              <CardDescription className="text-muted-foreground text-sm lg:text-base">
                Gerencie todos os eventos da comunidade
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 lg:p-6">
          <EventsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsListPage;