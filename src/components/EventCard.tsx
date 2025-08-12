import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  image: string;
  time?: string;
  description?: string;
  organizer?: string;
  onClick?: () => void;
}

const EventCard = ({ title, date, location, attendees, image, onClick }: EventCardProps) => {
  return (
    <Card className="netflix-card w-64 sm:w-80 h-48 sm:h-64 flex-shrink-0 group cursor-pointer touch-manipulation snap-start">
      <div className="relative h-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 card-content-enhanced"></div>
        </div>

        {/* Content */}
        <CardContent className="relative z-10 p-4 sm:p-6 h-full flex flex-col justify-end">
          <div className="transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="heading-6 text-enhanced-contrast mb-2 line-clamp-2">{title}</h3>
            
            <div className="space-y-1 mb-3 sm:mb-4 opacity-90">
              <div className="flex items-center gap-2 caption sm:body-small text-enhanced-muted">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-netflix-red flex-shrink-0" />
                <span className="truncate">{date}</span>
              </div>
              <div className="flex items-center gap-2 caption sm:body-small text-enhanced-muted">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-netflix-red flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-2 caption sm:body-small text-enhanced-muted">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-netflix-red flex-shrink-0" />
                <span>{attendees} interessados</span>
              </div>
            </div>

            {/* Mobile: Always show button, Desktop: Show on hover */}
            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                className="btn-netflix w-full button-text py-2 sm:py-3 min-h-[40px] sm:min-h-[44px]" 
                onClick={onClick}
              >
                Ver Evento
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default EventCard;