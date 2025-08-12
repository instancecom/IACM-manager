import { Calendar, Clock, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ScheduleCardProps {
  title: string;
  date: string;
  time: string;
  members: string[];
  confirmed?: boolean;
}

const ScheduleCard = ({ title, date, time, members, confirmed = false }: ScheduleCardProps) => {
  return (
    <Card className="netflix-card w-64 sm:w-80 h-40 sm:h-48 flex-shrink-0 group cursor-pointer snap-start">
      <CardContent className="p-4 sm:p-6 h-full flex flex-col justify-between bg-gradient-to-br from-card to-muted border border-border">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-enhanced-contrast mb-2 sm:mb-3">{title}</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-enhanced-muted">
              <Calendar className="h-4 w-4 text-netflix-red flex-shrink-0" />
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-enhanced-muted">
              <Clock className="h-4 w-4 text-netflix-red flex-shrink-0" />
              <span className="font-medium">{time}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-enhanced-muted">
              <Users className="h-4 w-4 text-netflix-red flex-shrink-0 mt-0.5" />
              <span className="font-medium line-clamp-2">{members.join(", ")}</span>
            </div>
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {confirmed ? (
            <div className="flex items-center gap-2 text-sm text-green-400 font-semibold">
              <Check className="h-4 w-4" />
              <span>Presença confirmada</span>
            </div>
          ) : (
            <Button className="btn-netflix w-full font-semibold">
              Confirmar Presença
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;