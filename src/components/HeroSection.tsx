import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";
import { useBanners } from "@/hooks/useBanners";

const HeroSection = () => {
  const { activeBanner, loading } = useBanners();

  // Use active banner data or fallback to default
  const bannerTitle = activeBanner?.title || "Evento Especial";
  const bannerSubtitle = activeBanner?.subtitle || "06 de Agosto de 2025";
  const bannerDescription = activeBanner?.description || "Junte-se a nós para uma noite especial de adoração e comunhão. Uma experiência transformadora que você não pode perder.";
  const bannerImage = activeBanner?.image_url || heroImage;

  return <section className="relative h-[60vh] sm:h-[70vh] min-h-[450px] sm:min-h-[500px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${bannerImage})`
    }}>
        <div className="absolute inset-0 hero-section"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="heading-1 sm:heading-display text-enhanced-contrast mb-3 sm:mb-4 animate-fade-in">
            {bannerTitle}
          </h1>
          <h2 className="heading-4 sm:heading-3 text-enhanced-contrast mb-4 animate-fade-in">
            {bannerSubtitle}
          </h2>
          <p className="body-large text-enhanced-muted mb-6 sm:mb-8 max-w-lg animate-fade-in">
            {bannerDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-up">
            
            
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;