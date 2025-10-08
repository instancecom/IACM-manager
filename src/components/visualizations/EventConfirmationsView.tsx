import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Users, CalendarDays, Check, X, Eye, User2, UserCheck } from "lucide-react";
import { useEventConfirmations } from "@/hooks/useEventConfirmations";
import { useEvents } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventConfirmationData {
  id: string;
  participant_name: string | null;
  responsible_name: string | null;
  whatsapp: string | null;
  guests: string[] | null;
  confirmed: boolean;
  confirmed_at?: string;
}

const EventConfirmationsView = () => {
  const { events, loading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [confirmations, setConfirmations] = useState<EventConfirmationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConfirmation, setSelectedConfirmation] = useState<EventConfirmationData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchEventConfirmations = async (eventId: string) => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const { data: confirmationData, error } = await supabase
        .from('event_confirmations')
        .select('*')
        .eq('event_id', eventId)
        .order('confirmed_at', { ascending: false });

      if (error) throw error;

      const confirmationsData: EventConfirmationData[] = confirmationData?.map(conf => ({
        id: conf.id,
        participant_name: conf.participant_name,
        responsible_name: conf.responsible_name,
        whatsapp: conf.whatsapp,
        guests: conf.guests,
        confirmed: conf.confirmed,
        confirmed_at: conf.confirmed_at
      })) || [];

      setConfirmations(confirmationsData);
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

  const confirmedCount = confirmations.filter(conf => conf.confirmed).length;
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
              {confirmations.map((confirmation) => (
                <Card 
                  key={confirmation.id} 
                  className="border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedConfirmation(confirmation);
                    setIsPreviewOpen(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {confirmation.participant_name?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">
                            {confirmation.participant_name || 'Sem nome'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            WhatsApp: {confirmation.whatsapp || 'Não informado'}
                          </p>
                          {confirmation.confirmed_at && (
                            <p className="text-xs text-muted-foreground">
                              Confirmado em: {format(new Date(confirmation.confirmed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {confirmation.confirmed ? (
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
          
          {selectedConfirmation && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {selectedConfirmation.participant_name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground">
                    {selectedConfirmation.participant_name || 'Sem nome'}
                  </h3>
                  {selectedConfirmation.whatsapp && (
                    <a 
                      href={`https://wa.me/55${selectedConfirmation.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-700 hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      WhatsApp: {selectedConfirmation.whatsapp}
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                {selectedConfirmation.responsible_name && (
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-muted-foreground block">Responsável:</span>
                      <span className="text-sm text-card-foreground">{selectedConfirmation.responsible_name}</span>
                    </div>
                  </div>
                )}

                {selectedConfirmation.guests && selectedConfirmation.guests.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-muted-foreground block">
                        Convidados ({selectedConfirmation.guests.length}):
                      </span>
                      <ul className="text-sm text-card-foreground list-disc list-inside">
                        {selectedConfirmation.guests.map((guest, index) => (
                          <li key={index}>{guest}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  {selectedConfirmation.confirmed ? (
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

                {selectedConfirmation.confirmed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Confirmado em:</span>
                    <span className="text-sm text-card-foreground">
                      {format(new Date(selectedConfirmation.confirmed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
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