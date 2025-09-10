import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Users, CalendarDays, Check, X, Eye } from "lucide-react";
import { useEventConfirmations } from "@/hooks/useEventConfirmations";
import { useEvents } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MemberWithConfirmation {
  id: string;
  first_name: string;
  last_name: string;
  whatsapp: string;
  photo_url?: string;
  confirmed: boolean;
  confirmed_at?: string;
}

const EventConfirmationsView = () => {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [confirmations, setConfirmations] = useState<MemberWithConfirmation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberWithConfirmation | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchEventConfirmations = async (eventId: string) => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      // Buscar todas as confirmações do evento com dados dos membros
      const { data: confirmationData, error } = await supabase
        .from('event_confirmations')
        .select(`
          *,
          members (
            id,
            first_name,
            last_name,
            whatsapp,
            photo_url
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      // Transformar os dados para o formato esperado
      const membersWithConfirmations: MemberWithConfirmation[] = confirmationData?.map(conf => ({
        id: conf.members?.id || '',
        first_name: conf.members?.first_name || '',
        last_name: conf.members?.last_name || '',
        whatsapp: conf.members?.whatsapp || '',
        photo_url: conf.members?.photo_url,
        confirmed: conf.confirmed,
        confirmed_at: conf.confirmed_at
      })) || [];

      setConfirmations(membersWithConfirmations);
    } catch (error) {
      console.error('Erro ao buscar confirmações:', error);
      setConfirmations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchEventConfirmations(selectedEventId);
    }
  }, [selectedEventId]);

  const confirmedCount = confirmations.filter(member => member.confirmed).length;
  const totalCount = confirmations.length;

  const selectedEvent = events.find(event => event.id === selectedEventId);

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando eventos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Selecione um evento:
          </label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha um evento para ver as confirmações" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(event.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Event Info and Stats */}
      {selectedEvent && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-card-foreground">
                  {selectedEvent.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(selectedEvent.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedEvent.start_time}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {confirmedCount}/{totalCount} confirmados
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Confirmations List */}
      {selectedEventId && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Carregando confirmações...</span>
            </div>
          ) : confirmations.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Nenhuma confirmação encontrada para este evento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {confirmations.map((member) => (
                <Card 
                  key={member.id} 
                  className="border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedMember(member);
                    setIsPreviewOpen(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.photo_url} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            WhatsApp: {member.whatsapp}
                          </p>
                          {member.confirmed_at && (
                            <p className="text-xs text-muted-foreground">
                              Confirmado em: {format(new Date(member.confirmed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {member.confirmed ? (
                          <Badge className="bg-green-600 text-white hover:bg-green-700">
                            <Check className="h-3 w-3 mr-1" />
                            Confirmado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-300 text-red-600">
                            <X className="h-3 w-3 mr-1" />
                            Não confirmado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Confirmação</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMember.photo_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {selectedMember.first_name.charAt(0)}{selectedMember.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground">
                    {selectedMember.first_name} {selectedMember.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    WhatsApp: {selectedMember.whatsapp}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  {selectedMember.confirmed ? (
                    <Badge className="bg-green-600 text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Confirmado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-300 text-red-600">
                      <X className="h-3 w-3 mr-1" />
                      Não confirmado
                    </Badge>
                  )}
                </div>

                {selectedMember.confirmed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Confirmado em:</span>
                    <span className="text-sm text-card-foreground">
                      {format(new Date(selectedMember.confirmed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                )}

                {selectedEvent && (
                  <div className="space-y-2 pt-3 border-t">
                    <h4 className="text-sm font-medium text-card-foreground">Evento:</h4>
                    <p className="text-sm text-muted-foreground">{selectedEvent.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(selectedEvent.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedEvent.start_time}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventConfirmationsView;