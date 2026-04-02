import { Clock, CalendarDays } from "lucide-react";

export const LandingSchedule = () => {
  const schedules = [
    { day: "Terça-feira", time: "15:00", type: "Culto de Mulheres / Tarde de Bênçãos" },
    { day: "Quarta-feira", time: "19:30", type: "Culto de Palavra e Oração" },
    { day: "Domingo", time: "09:00", type: "Escola de Maturidade (Manhã)" },
    { day: "Domingo", time: "18:00", type: "Celebrando ao Rei (Noite)" }
  ];

  return (
    <section className="py-24 bg-netflix-gray-dark relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white">Nossos <span className="text-netflix-red underline decoration-netflix-red/30 underline-offset-8">Cultos</span></h2>
          <p className="text-netflix-gray-light max-w-xl mx-auto text-lg font-medium">
            Momentos especiais de adoração, ensino e comunhão. Escolha um horário e venha estar conosco!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {schedules.map((item, idx) => (
            <div 
              key={idx} 
              className="relative p-1 rounded-3xl bg-gradient-to-br from-netflix-white/10 to-transparent hover:from-netflix-red/40 transition-all duration-500 group"
            >
              <div className="bg-background rounded-[calc(1.5rem-2px)] p-8 h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-netflix-red/10 flex items-center justify-center text-netflix-red group-hover:bg-netflix-red group-hover:text-white transition-colors duration-500 shadow-glow">
                  {item.day === "Domingo" ? <CalendarDays className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-netflix-white">{item.day}</h3>
                  <p className="text-3xl font-black text-netflix-red">{item.time}</p>
                </div>
                
                <p className="text-netflix-gray-light font-medium">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingSchedule;
