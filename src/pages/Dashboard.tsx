import { Plus, Calendar, Users, Music } from "lucide-react";
import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ContentShelf from "@/components/ContentShelf";
import ScheduleCard from "@/components/ScheduleCard";
import EventCard from "@/components/EventCard";
import ActionCard from "@/components/ActionCard";
import EventPreview from "@/components/EventPreview";

import { useEvents } from "@/hooks/useEvents";
import { format, parseISO, isAfter, isBefore, subDays, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getEventStatus, formatEventDateTimeRange } from "@/lib/eventUtils";
import musicImage from "@/assets/music-ministry.jpg";
import youthImage from "@/assets/youth-ministry.jpg";

const Dashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventPreviewOpen, setIsEventPreviewOpen] = useState(false);
  const { events, loading } = useEvents();
  const mySchedules = [
    {
      title: "Escala de Música",
      date: "25 de Agosto",
      time: "19:00",
      members: ["Marcelo", "Ana", "Tiago"],
      confirmed: true
    },
    {
      title: "Ministério de Jovens",
      date: "27 de Agosto", 
      time: "15:00",
      members: ["Marcelo", "Paula", "João"],
      confirmed: false
    },
    {
      title: "Escala de Som",
      date: "29 de Agosto",
      time: "18:30", 
      members: ["Marcelo", "Carlos"],
      confirmed: false
    }
  ];

  // Transform database events to dashboard format
  const allEvents = events.map(event => {
    const eventStatus = getEventStatus(event.start_date, event.start_time, event.end_date, event.end_time);
    const startDateTime = new Date(`${event.start_date}T${event.start_time}`);
    const dateTimeRange = formatEventDateTimeRange(event.start_date, event.start_time, event.end_date, event.end_time);

    return {
      id: event.id,
      title: event.title,
      date: dateTimeRange,
      time: `${event.start_time} - ${event.end_time}`,
      location: event.address,
      attendees: event.confirmations_count || 0,
      image: event.banner_url || musicImage,
      description: event.description,
      organizer: "Organização", // Placeholder até ter dados do criador
      status: eventStatus.status,
      dateTime: startDateTime,
      startDate: event.start_date,
      startTime: event.start_time,
      endDate: event.end_date,
      endTime: event.end_time,
      allowGuests: (event as any).allow_guests !== false,
      categories: event.categories,
      event // Original event data for modal
    };
  });

  // Filter events by categories
  const now = new Date();
  const sevenDaysFromNow = addDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);
  
  // Recently registered events (last 30 days) - only active/upcoming events
  const recentEvents = allEvents
    .filter(event => {
      const createdAt = parseISO(event.event?.created_at || event.event?.start_date);
      return isAfter(createdAt, thirtyDaysAgo) && 
             (event.status === 'upcoming' || event.status === 'active');
    })
    .sort((a, b) => {
      const aCreated = parseISO(a.event?.created_at || a.event?.start_date);
      const bCreated = parseISO(b.event?.created_at || b.event?.start_date);
      return bCreated.getTime() - aCreated.getTime(); // Most recent first
    })
    .slice(0, 6);
  
  // Upcoming events (next 7 days) - only active events
  const upcomingEvents = allEvents.filter(event => 
    (event.status === 'upcoming' || event.status === 'active') && 
    isAfter(event.dateTime, now) && 
    isBefore(event.dateTime, sevenDaysFromNow)
  );
  
  // Finished events
  const finishedEvents = allEvents
    .filter(event => event.status === 'finished')
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime()) // Most recent finished first
    .slice(0, 6);

  const quickActions = [
    {
      title: "Adicionar Evento",
      description: "Criar um novo evento para a comunidade",
      icon: Calendar
    },
    {
      title: "Criar Escala",
      description: "Organizar escalas de ministérios",
      icon: Music
    },
    {
      title: "Cadastrar em Ministério",
      description: "Adicionar membros aos ministérios",
      icon: Users
    }
  ];

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main content with top padding for fixed header */}
      <main className="pt-16 sm:pt-20">
        <HeroSection />
        
        {/* Loading state */}
        {loading && (
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground">Carregando eventos...</p>
          </div>
        )}

        {/* Recent Events */}
        {!loading && recentEvents.length > 0 && (
          <ContentShelf title="Eventos Recém-Cadastrados">
            {recentEvents.map((event, index) => (
              <EventCard
                key={event.id || index}
                title={event.title}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                image={event.image}
                time={event.time}
                description={event.description}
                organizer={event.organizer}
                startDate={event.startDate}
                startTime={event.startTime}
                endDate={event.endDate}
                endTime={event.endTime}
                categories={event.categories}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </ContentShelf>
        )}

        {/* Upcoming Events */}
        {!loading && upcomingEvents.length > 0 && (
          <ContentShelf title="Próximos Eventos">
            {upcomingEvents.map((event, index) => (
              <EventCard
                key={event.id || index}
                title={event.title}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                image={event.image}
                time={event.time}
                description={event.description}
                organizer={event.organizer}
                startDate={event.startDate}
                startTime={event.startTime}
                endDate={event.endDate}
                endTime={event.endTime}
                categories={event.categories}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </ContentShelf>
        )}

        {/* Finished Events */}
        {!loading && finishedEvents.length > 0 && (
          <ContentShelf title="Eventos Finalizados">
            {finishedEvents.map((event, index) => (
              <EventCard
                key={event.id || index}
                title={event.title}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                image={event.image}
                time={event.time}
                description={event.description}
                organizer={event.organizer}
                startDate={event.startDate}
                startTime={event.startTime}
                endDate={event.endDate}
                endTime={event.endTime}
                categories={event.categories}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </ContentShelf>
        )}

        {/* No events message */}
        {!loading && events.length === 0 && (
          <div className="container mx-auto px-4 py-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum evento cadastrado</h3>
            <p className="text-muted-foreground">
              Cadastre eventos na área administrativa para que apareçam aqui.
            </p>
          </div>
        )}

      </main>

      {/* Event Preview Modal */}
      <EventPreview
        isOpen={isEventPreviewOpen}
        onClose={() => setIsEventPreviewOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default Dashboard;