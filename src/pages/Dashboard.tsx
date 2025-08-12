import { Plus, Calendar, Users, Music } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentShelf from "@/components/ContentShelf";
import ScheduleCard from "@/components/ScheduleCard";
import EventCard from "@/components/EventCard";
import ActionCard from "@/components/ActionCard";
import EventPreview from "@/components/EventPreview";
import musicImage from "@/assets/music-ministry.jpg";
import youthImage from "@/assets/youth-ministry.jpg";

const Dashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventPreviewOpen, setIsEventPreviewOpen] = useState(false);
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

  const allEvents = [
    {
      title: "Culto de Domingo",
      date: "24 de Agosto, 2025",
      time: "19:00",
      location: "Auditório Principal",
      attendees: 150,
      image: musicImage,
      description: "Junte-se a nós para um culto especial de domingo com adoração, palavra e comunhão. Uma experiência transformadora de fé.",
      organizer: "Pastor João Silva",
      status: "active",
      dateTime: new Date("2025-08-24T19:00:00")
    },
    {
      title: "Encontro de Jovens",
      date: "27 de Agosto, 2025", 
      time: "15:00",
      location: "Sala de Jovens",
      attendees: 45,
      image: youthImage,
      description: "Um encontro especial para os jovens da nossa comunidade. Momento de adoração, ensino e muita diversão!",
      organizer: "Líder Ana Paula",
      status: "upcoming",
      dateTime: new Date("2025-08-27T15:00:00")
    },
    {
      title: "Estudo Bíblico",
      date: "30 de Agosto, 2025",
      time: "20:00",
      location: "Sala de Estudos",
      attendees: 30,
      image: musicImage,
      description: "Estudo profundo da Palavra de Deus em um ambiente acolhedor. Venha crescer na fé conosco.",
      organizer: "Pastor Marcos",
      status: "upcoming",
      dateTime: new Date("2025-08-30T20:00:00")
    },
    {
      title: "Conferência de Oração",
      date: "15 de Agosto, 2025",
      time: "18:00",
      location: "Auditório Principal",
      attendees: 200,
      image: musicImage,
      description: "Uma noite especial de oração e adoração que transformou nossa comunidade.",
      organizer: "Pastor João Silva",
      status: "finished",
      dateTime: new Date("2025-08-15T18:00:00")
    },
    {
      title: "Retiro de Casais",
      date: "10 de Agosto, 2025",
      time: "16:00",
      location: "Chácara Bethel",
      attendees: 80,
      image: youthImage,
      description: "Um final de semana abençoado de fortalecimento dos vínculos matrimoniais.",
      organizer: "Pastor Marcos",
      status: "finished",
      dateTime: new Date("2025-08-10T16:00:00")
    }
  ];

  // Filter events by categories
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  // Recently registered and active events (last 30 days)
  const recentActiveEvents = allEvents.filter(event => 
    event.status === 'active' && event.dateTime >= thirtyDaysAgo
  );
  
  // Upcoming active events (next 7 days)
  const upcomingActiveEvents = allEvents.filter(event => 
    event.status === 'active' && event.dateTime >= now && event.dateTime <= sevenDaysFromNow
  );
  
  // Finished events
  const finishedEvents = allEvents.filter(event => event.status === 'finished');

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
      <Header />
      
      {/* Main content with top padding for fixed header */}
      <main className="pt-16 sm:pt-20">
        <HeroSection />
        
        {/* Recent Active Events */}
        {recentActiveEvents.length > 0 && (
          <ContentShelf title="Eventos Recém-Cadastrados">
            {recentActiveEvents.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                image={event.image}
                time={event.time}
                description={event.description}
                organizer={event.organizer}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </ContentShelf>
        )}

        {/* Upcoming Active Events */}
        {upcomingActiveEvents.length > 0 && (
          <ContentShelf title="Próximos Eventos Ativos">
            {upcomingActiveEvents.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                image={event.image}
                time={event.time}
                description={event.description}
                organizer={event.organizer}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </ContentShelf>
        )}

        {/* Finished Events */}
        {finishedEvents.length > 0 && (
          <ContentShelf title="Eventos Finalizados">
            {finishedEvents.map((event, index) => (
              <EventCard
                key={index}
                title={event.title}
                date={event.date}
                location={event.location}
                attendees={event.attendees}
                image={event.image}
                time={event.time}
                description={event.description}
                organizer={event.organizer}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </ContentShelf>
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