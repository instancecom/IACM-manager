import { useState, useMemo } from "react";
import { Calendar, Users, MapPin, Search, Filter } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import EventPreview from "@/components/EventPreview";
import musicImage from "@/assets/music-ministry.jpg";
import youthImage from "@/assets/youth-ministry.jpg";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventPreviewOpen, setIsEventPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const allEvents = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
    },
    {
      id: 6,
      title: "Batismo",
      date: "03 de Setembro, 2025",
      time: "16:00",
      location: "Batistério da Igreja",
      attendees: 25,
      image: musicImage,
      description: "Cerimônia especial de batismo para novos convertidos.",
      organizer: "Pastor João Silva",
      status: "upcoming",
      dateTime: new Date("2025-09-03T16:00:00")
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white">Ativo</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-600 text-white">Próximo</Badge>;
      case "finished":
        return <Badge className="bg-gray-600 text-white">Finalizado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Search filter
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      // Date filters
      let matchesDateRange = true;
      if (startDate && endDate) {
        const eventDate = event.dateTime;
        const filterStart = new Date(startDate);
        const filterEnd = new Date(endDate);
        matchesDateRange = eventDate >= filterStart && eventDate <= filterEnd;
      } else if (startDate) {
        const filterStart = new Date(startDate);
        matchesDateRange = event.dateTime >= filterStart;
      } else if (endDate) {
        const filterEnd = new Date(endDate);
        matchesDateRange = event.dateTime <= filterEnd;
      }
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [searchTerm, statusFilter, startDate, endDate, allEvents]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventPreviewOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Eventos</h1>
            <p className="text-muted-foreground">Explore todos os eventos da nossa comunidade</p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg p-6 mb-8 border">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Buscar eventos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, local ou organizador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="min-w-[150px]">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="upcoming">Próximos</SelectItem>
                    <SelectItem value="finished">Finalizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="min-w-[150px]">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Data início
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div className="min-w-[150px]">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Data fim
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters} className="mb-0">
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="netflix-card group cursor-pointer overflow-hidden hover:scale-105 transition-all duration-300"
                onClick={() => handleEventClick(event)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(event.status)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date} - {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} participantes</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Events Found */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar seus filtros para encontrar mais eventos.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
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

export default Events;