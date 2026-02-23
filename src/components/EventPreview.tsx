import { X, Calendar, MapPin, Users, Clock, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventConfirmations } from "@/hooks/useEventConfirmations";
import { formatEventDateTimeRange, getEventStatus } from "@/lib/eventUtils";
import ConfirmPresenceForm from "./ConfirmPresenceForm";

interface EventPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    attendees: number;
    image: string;
    description?: string;
    time?: string;
    organizer?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    allowGuests?: boolean;
    event?: any;
  } | null;
}

const EventPreview = ({ isOpen, onClose, event }: EventPreviewProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const isMobile = useIsMobile();
  const { confirmPresence } = useEventConfirmations();

  if (!event) return null;

  const eventStatus = event.startDate && event.startTime && event.endDate && event.endTime
    ? getEventStatus(event.startDate, event.startTime, event.endDate, event.endTime)
    : null;
  
  const isEventFinished = eventStatus?.status === 'finished';

  const handleConfirmPresence = () => {
    setShowConfirmForm(true);
  };

  const handleFormConfirm = async (formData: any) => {
    if (!event?.id) return false;
    
    const success = await confirmPresence(event.id, formData);
    if (success) {
      setShowConfirmForm(false);
      // Não alterar o isConfirmed para permitir novas confirmações
    }
    return success;
  };

  const EventContent = () => (
    <div className="flex flex-col h-full">
      {/* Image Section */}
      <div className="h-48 sm:h-64 md:h-80 relative flex-shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark/90 via-netflix-dark/30 to-transparent"></div>
        </div>
        
        {/* Close button for mobile */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-4 sm:p-6 pb-4">
            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-netflix-white mb-2">
                {event.title}
              </h2>
            </div>

            {/* Event Details */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 text-netflix-gray-light">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-netflix-red flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="text-sm sm:text-base font-medium text-netflix-white mb-1">Data e Horário</div>
                  <div className="text-sm sm:text-base">
                    {event.startDate && event.startTime && event.endDate && event.endTime 
                      ? formatEventDateTimeRange(event.startDate, event.startTime, event.endDate, event.endTime)
                      : event.date
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-netflix-gray-light">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-netflix-red flex-shrink-0" />
                <span className="text-sm sm:text-base">{event.location}</span>
              </div>
              
              <div className="flex items-center gap-3 text-netflix-gray-light">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-netflix-red flex-shrink-0" />
                <span className="text-sm sm:text-base">{event.attendees} {event.attendees === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base sm:text-xl font-semibold text-netflix-white mb-3">Sobre o Evento</h3>
              <p className="text-sm sm:text-base text-netflix-gray-light leading-relaxed whitespace-pre-line">
                {event.description || "Junte-se a nós para uma experiência única de adoração e comunhão. Este evento promete ser transformador para toda a nossa comunidade. Venha participar deste momento especial onde iremos nos conectar com Deus e uns com os outros em um ambiente de fé e celebração."}
              </p>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div>
                <h3 className="text-sm sm:text-lg font-medium text-netflix-white mb-2">Organizador</h3>
                <p className="text-sm sm:text-base text-netflix-gray-light">{event.organizer}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-netflix-gray-dark bg-netflix-dark">
          {isEventFinished ? (
            <div className="text-center py-2">
              <Badge variant="secondary" className="bg-netflix-gray-dark text-netflix-white text-base px-4 py-2">
                Evento Finalizado
              </Badge>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button 
                className="btn-netflix w-full text-sm sm:text-lg py-2.5 sm:py-4 min-h-[44px] sm:min-h-[48px] touch-manipulation"
                onClick={handleConfirmPresence}
              >
                <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Confirmar Presença
              </Button>
              
              <Button 
                variant="outline" 
                className="btn-netflix-outline w-full text-sm sm:text-lg py-2.5 sm:py-4 min-h-[44px] sm:min-h-[48px] touch-manipulation"
                onClick={onClose}
              >
                Fechar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={isOpen} onOpenChange={onClose}>
          <DrawerContent className="h-[90vh] bg-netflix-dark border-netflix-gray-dark">
            <EventContent />
          </DrawerContent>
        </Drawer>
        
        {/* Formulário de Confirmação */}
        <ConfirmPresenceForm
          isOpen={showConfirmForm}
          onClose={() => setShowConfirmForm(false)}
          onConfirm={handleFormConfirm}
          eventTitle={event?.title || ""}
          eventId={event?.id || ""}
          allowGuests={event?.allowGuests !== false}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full max-h-[85vh] h-auto p-0 bg-netflix-dark border-netflix-gray-dark overflow-hidden">
          {/* Close button for desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex max-h-[85vh] h-[600px]">
            {/* Image Section - Desktop */}
            <div className="w-1/2 relative flex-shrink-0">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-netflix-dark/80"></div>
              </div>
            </div>

            {/* Content Section - Desktop */}
            <div className="w-1/2 flex flex-col overflow-hidden">
              <div className="p-6 pb-0 flex-shrink-0">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-bold text-netflix-white">
                    {event.title}
                  </DialogTitle>
                </DialogHeader>
              </div>

              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 pb-4">
                  {/* Event Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-netflix-gray-light">
                      <Calendar className="h-4 w-4 text-netflix-red flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-netflix-white mb-1">Data e Horário</div>
                        <div className="text-sm">
                          {event.startDate && event.startTime && event.endDate && event.endTime 
                            ? formatEventDateTimeRange(event.startDate, event.startTime, event.endDate, event.endTime)
                            : event.date
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-netflix-gray-light">
                      <MapPin className="h-4 w-4 text-netflix-red" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-netflix-gray-light">
                      <Users className="h-4 w-4 text-netflix-red" />
                      <span className="text-sm">{event.attendees} {event.attendees === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-netflix-white mb-2">Sobre o Evento</h3>
                    <p className="text-sm text-netflix-gray-light leading-relaxed whitespace-pre-line">
                      {event.description || "Junte-se a nós para uma experiência única de adoração e comunhão. Este evento promete ser transformador para toda a nossa comunidade. Venha participar deste momento especial onde iremos nos conectar com Deus e uns com os outros em um ambiente de fé e celebração."}
                    </p>
                  </div>

                  {/* Organizer */}
                  {event.organizer && (
                    <div>
                      <h3 className="text-base font-medium text-netflix-white mb-1">Organizador</h3>
                      <p className="text-sm text-netflix-gray-light">{event.organizer}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Action Buttons - Fixed at bottom */}
              <div className="flex-shrink-0 p-6 pt-4 border-t border-netflix-gray-dark bg-netflix-dark">
                {isEventFinished ? (
                  <div className="text-center py-2">
                    <Badge variant="secondary" className="bg-netflix-gray-dark text-netflix-white text-base px-4 py-2">
                      Evento Finalizado
                    </Badge>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="btn-netflix flex-1 py-2.5"
                      onClick={handleConfirmPresence}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Confirmar Presença
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="btn-netflix-outline flex-1 py-2.5"
                      onClick={onClose}
                    >
                      Fechar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Formulário de Confirmação */}
      <ConfirmPresenceForm
        isOpen={showConfirmForm}
        onClose={() => setShowConfirmForm(false)}
        onConfirm={handleFormConfirm}
        eventTitle={event?.title || ""}
        eventId={event?.id || ""}
        allowGuests={event?.allowGuests !== false}
      />
    </>
  );
};

export default EventPreview;