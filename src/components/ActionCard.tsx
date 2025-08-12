import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const ActionCard = ({ title, description, icon: Icon, onClick }: ActionCardProps) => {
  return (
    <Card 
      className="netflix-card w-72 h-40 flex-shrink-0 cursor-pointer group touch-manipulation"
      onClick={onClick}
    >
      <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center bg-gradient-to-br from-netflix-red/20 to-netflix-red/5 border border-netflix-red/30 hover:border-netflix-red/50 transition-colors">
        <div className="transform group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-12 w-12 text-netflix-red mb-4 mx-auto drop-shadow-lg" />
          <h3 className="text-lg font-bold text-enhanced-contrast mb-2">{title}</h3>
          <p className="text-sm text-enhanced-muted font-medium leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;