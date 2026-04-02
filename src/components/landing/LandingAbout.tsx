import { Users } from "lucide-react";

export const LandingAbout = () => {
  return (
    <section id="quem-somos" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-netflix-red to-transparent opacity-30" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-netflix-red/10 border border-netflix-red/20 text-netflix-red font-bold text-sm tracking-widest uppercase">
               Quem Somos
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Vivemos e acreditamos no propósito de Deus para esta <span className="text-netflix-red">geração</span>.
            </h2>
            
            <div className="space-y-6 text-netflix-gray-light text-lg leading-relaxed font-medium">
              <p>
                Existimos para edificar vidas, fortalecer a fé e levar o amor de Jesus a todos. 
                Mais do que um lugar, somos uma família. 
              </p>
              <p>
                Um ambiente de comunhão, crescimento e transformação, onde cada pessoa 
                é encorajada a descobrir seu propósito e viver aquilo que Deus sonhou.
              </p>
              <p className="p-6 border-l-4 border-netflix-red bg-netflix-gray-dark/50 rounded-r-xl italic text-netflix-white">
                "Nosso chamado é conectar pessoas a Jesus, formar discípulos e impactar o mundo com fé, amor e verdade."
              </p>
            </div>
          </div>

          <div className="relative group">
             <div className="absolute -inset-4 bg-gradient-to-tr from-netflix-red to-blue-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />
             <div className="relative aspect-video rounded-3xl bg-netflix-gray-dark overflow-hidden border border-netflix-white/10 shadow-2xl">
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="p-8 text-center bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl max-w-sm">
                   <h3 className="text-2xl font-bold text-netflix-white mb-2 italic">Cultos Presenciais</h3>
                   <p className="text-netflix-gray-light">Crescendo juntos na Presença.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;
