import LandingHero from "@/components/landing/LandingHero";
import LandingVerseStrip from "@/components/landing/LandingVerseStrip";
import LandingAbout from "@/components/landing/LandingAbout";
import LandingSchedule from "@/components/landing/LandingSchedule";
import LandingSocial from "@/components/landing/LandingSocial";
import LandingLocation from "@/components/landing/LandingLocation";
import { useEffect } from "react";

const Landing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <main>
        <LandingVerseStrip />
        <LandingHero />
        <LandingAbout />
        <LandingSchedule />
        <LandingSocial />
        <LandingLocation />
      </main>
      
      {/* Footer */}
      <footer className="py-12 bg-netflix-black border-t border-netflix-white/5">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl font-black text-netflix-red italic">IACM <span className="text-white">MANAGER</span></h2>
          <p className="text-netflix-gray-light text-sm font-medium">
            © {new Date().getFullYear()} 5 Ministérios Church. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
