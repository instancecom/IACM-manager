import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, LogIn, UserPlus } from "lucide-react";
import heroImg from "@/assets/church-hero.png";

const LandingHero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
      </div>

      {/* Content */}
      <div className="container relative z-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white animate-fade-in drop-shadow-2xl">
          5 MINISTÉRIOS <br />
          <span className="text-netflix-red">CHURCH</span>
        </h1>
        <p className="text-xl md:text-2xl text-netflix-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
          Um lugar de recomeços, crescimento e vida em abundância. 
          Venha viver o propósito de Deus conosco.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login">
            <Button className="btn-netflix w-full sm:w-auto h-14 px-10 text-lg gap-2 group">
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Entrar na Área VIP
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="btn-netflix-outline w-full sm:w-auto h-14 px-10 text-lg gap-2">
              <UserPlus className="w-5 h-5" />
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
        <div 
          onClick={() => document.getElementById('quem-somos')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center text-netflix-white"
        >
          <span className="text-xs uppercase tracking-widest mb-2 font-bold">Conheça Mais</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
