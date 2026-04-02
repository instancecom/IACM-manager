import { Button } from "@/components/ui/button";
import { Instagram, Youtube } from "lucide-react";

export const LandingSocial = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-netflix-red/10 blur-3xl opacity-50 z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-r from-netflix-white/10 via-netflix-red/30 to-netflix-white/10">
          <div className="bg-netflix-gray-dark rounded-[calc(1.5rem-2px)] p-12 text-center space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tight">ASSISTA NOSSOS <span className="text-netflix-red">ENCONTROS</span> ONLINE</h2>
              <p className="text-netflix-gray-light text-lg font-medium">Não importa onde você está, queremos caminhar com você em todo o tempo.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://instagram.com/5ministerioschurch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="btn-netflix w-full h-16 px-10 text-lg gap-3 bg-gradient-to-tr from-pink-600 via-red-500 to-yellow-500 hover:opacity-90 transition-opacity border-none">
                  <Instagram className="w-6 h-6" />
                  @5ministerioschurch
                </Button>
              </a>
              
              <a 
                href="https://youtube.com/@5ministerioschurch?si=zMv6k9VpPZPd61Ep" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="btn-netflix w-full h-16 px-10 text-lg gap-3 bg-[#FF0000] hover:bg-[#CC0000] transition-colors border-none">
                  <Youtube className="w-6 h-6" />
                  YouTube Oficial
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSocial;
