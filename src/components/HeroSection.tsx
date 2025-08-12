import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";
const HeroSection = () => {
  return <section className="relative h-[60vh] sm:h-[70vh] min-h-[450px] sm:min-h-[500px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${heroImage})`
    }}>
        <div className="absolute inset-0 hero-section"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="heading-1 sm:heading-display text-enhanced-contrast mb-3 sm:mb-4 animate-fade-in">
            Evento Especial
          </h1>
          <h2 className="heading-4 sm:heading-3 text-enhanced-contrast mb-4 animate-fade-in">
            06 de Agosto de 2025
          </h2>
          <p className="body-large text-enhanced-muted mb-6 sm:mb-8 max-w-lg animate-fade-in">
            Junte-se a nós para uma noite especial de adoração e comunhão. 
            Uma experiência transformadora que você não pode perder.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-up">
            
            
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;