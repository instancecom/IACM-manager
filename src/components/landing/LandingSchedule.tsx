import { Clock, CalendarDays } from "lucide-react";
import tercaMulheres from "@/assets/terca-mulheres.png";
import quartaPalavra from "@/assets/quarta-palavra.png";
import domingoManha from "@/assets/domingo-manha.png";
import domingoNoite from "@/assets/domingo-noite.png";

export const LandingSchedule = () => {
  const schedules = [
    { 
      day: "Terça-feira", 
      time: "15:00", 
      title: "TITULO AQUI", 
      type: "Culto de Mulheres / Tarde de Bênçãos",
      image: tercaMulheres
    },
    { 
      day: "Quarta-feira", 
      time: "19:30", 
      title: "TITULO AQUI", 
      type: "Culto de Palavra e Oração",
      image: quartaPalavra
    },
    { 
      day: "Domingo", 
      time: "09:00", 
      title: "TITULO AQUI", 
      type: "Escola de Maturidade",
      image: domingoManha
    },
    { 
      day: "Domingo", 
      time: "18:00", 
      title: "TITULO AQUI", 
      type: "Celebrando ao Rei",
      image: domingoNoite
    }
  ];

  return (
    <section className="py-24 bg-netflix-gray-dark relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Nossos <span className="text-netflix-red underline decoration-netflix-red/30 underline-offset-8">Encontros</span></h2>
          <p className="text-netflix-gray-light max-w-xl mx-auto text-lg font-medium">
            Momentos especiais de adoração, ensino e comunhão. Escolha um horário e venha estar conosco!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {schedules.map((item, idx) => (
            <div 
              key={idx} 
              className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:z-10 shadow-2xl"
            >
              {/* Background Image with Zoom Effect */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <img 
                  src={item.image} 
                  alt={item.day} 
                  className="w-full h-full object-cover"
                />
                {/* Dark Overlays */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-gray-dark via-netflix-gray-dark/40 to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-netflix-red p-1 rounded">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-netflix-red font-black text-xl">{item.time}</span>
                </div>
                
                <h3 className="text-2xl font-black text-white leading-tight uppercase mb-1">{item.title}</h3>
                <div className="flex items-center gap-2 text-netflix-gray-light text-sm font-bold uppercase tracking-wider">
                  <span>{item.day}</span>
                  <span className="w-1 h-1 bg-netflix-gray-light rounded-full"></span>
                  <span className="line-clamp-1">{item.type}</span>
                </div>
              </div>
              
              {/* Netflix-style Bottom Border Bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-netflix-red w-0 group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingSchedule;
