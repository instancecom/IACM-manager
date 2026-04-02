import { useEffect, useState } from "react";
import { BookOpen, Share2, Quote } from "lucide-react";
import { toast } from "sonner";

interface VerseData {
  text: string;
  book: string;
  chapter: number;
  number: number;
}

const LandingVerseStrip = () => {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);

  const fallbackVerse: VerseData = {
    text: "O Senhor é o meu pastor; de nada terei falta.",
    book: "Salmos",
    chapter: 23,
    number: 1
  };

  useEffect(() => {
    const fetchDailyVerse = async () => {
      console.log("Fetching Daily Verse...");
      try {
        const today = new Date().toISOString().split("T")[0];
        const cached = localStorage.getItem("daily_verse");
        
        if (cached) {
          const { date, data } = JSON.parse(cached);
          if (date === today) {
            console.log("Using cached verse:", data);
            setVerse(data);
            setLoading(false);
            return;
          }
        }

        const response = await fetch("https://www.abibliadigital.com.br/api/verses/nvi/random");
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const verseData = {
          text: data.text,
          book: data.book.name,
          chapter: data.chapter,
          number: data.number
        };

        localStorage.setItem("daily_verse", JSON.stringify({ date: today, data: verseData }));
        setVerse(verseData);
      } catch (error) {
        console.error("Error fetching verse, using fallback:", error);
        setVerse(fallbackVerse);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyVerse();
  }, []);

  const handleShare = () => {
    if (verse) {
      const text = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.number} #PalavraDoDia #IACM`;
      navigator.clipboard.writeText(text);
      toast.success("Versículo copiado!");
    }
  };

  if (loading) return (
    <div className="bg-black/90 h-10 border-b border-netflix-red/30 animate-pulse" />
  );

  if (!verse) return null;

  return (
    <div className="relative z-40 bg-black/90 border-b border-netflix-red/30 backdrop-blur-md overflow-hidden">
      {/* Animated subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/10 via-transparent to-netflix-red/10 animate-pulse-slow" />
      
      <div className="container mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 flex-1">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="bg-netflix-red text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest animate-pulse">
              Palavra do Dia
            </span>
            <BookOpen className="w-4 h-4 text-netflix-red" />
          </div>
          
          <div className="flex items-center gap-2 group cursor-default">
            <Quote className="w-3 h-3 text-netflix-red/50 mt-[-8px] opacity-70" />
            <p className="text-netflix-white text-xs md:text-sm font-medium italic leading-tight line-clamp-2 md:line-clamp-1 max-w-4xl">
              {verse.text}
            </p>
            <span className="text-netflix-red font-bold text-[11px] whitespace-nowrap ml-1 tracking-tighter">
              — {verse.book} {verse.chapter}:{verse.number}
            </span>
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="flex items-center gap-1.5 text-netflix-gray-light hover:text-white transition-colors duration-300 group"
        >
          <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Compartilhar</span>
        </button>
      </div>
    </div>
  );
};

export default LandingVerseStrip;
