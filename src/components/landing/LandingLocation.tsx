export const LandingLocation = () => {
  return (
    <section className="py-24 bg-netflix-gray-dark/50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white italic">ONDE <span className="text-netflix-red underline decoration-netflix-red/30 underline-offset-8">ESTAMOS</span></h2>
          <p className="text-netflix-gray-light max-w-xl mx-auto text-lg font-medium">Fica localizado na Vila Oliveira em Mogi das Cruzes, prontos para te receber com muito amor.</p>
        </div>

        <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl border border-netflix-white/10 shadow-glow bg-netflix-gray-dark h-[500px]">
          <iframe 
            src="https://maps.google.com/maps?q=-23.5062495,-46.1923644&z=17&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingLocation;
