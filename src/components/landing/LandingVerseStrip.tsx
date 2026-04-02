import { useEffect, useState } from "react";
import { BookOpen, Share2, Quote, Loader2, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VerseData {
  text: string;
  book: string;
  bookAbbrev: string;
  chapter: number;
  number: number;
}

interface ChapterVerse {
  number: number;
  text: string;
}

const LandingVerseStrip = () => {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullChapter, setFullChapter] = useState<ChapterVerse[]>([]);
  const [isChapterLoading, setIsChapterLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fallbackVerse: VerseData = {
    text: "O Senhor é o meu pastor; de nada terei falta.",
    book: "Salmos",
    bookAbbrev: "ps",
    chapter: 23,
    number: 1
  };

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const cached = localStorage.getItem("daily_verse");
        
        if (cached) {
          const { date, data } = JSON.parse(cached);
          if (date === today) {
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
          bookAbbrev: data.book.abbrev.pt,
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

  const fetchFullChapter = async () => {
    if (!verse || fullChapter.length > 0) return;
    
    setIsChapterLoading(true);
    try {
      const response = await fetch(
        `https://www.abibliadigital.com.br/api/verses/nvi/${verse.bookAbbrev}/${verse.chapter}`
      );
      if (!response.ok) throw new Error("Erro ao buscar capítulo");
      const data = await response.json();
      setFullChapter(data.verses);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      toast.error("Não foi possível carregar o capítulo completo.");
    } finally {
      setIsChapterLoading(false);
    }
  };

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
    <div className="relative z-40 bg-transparent border-b border-netflix-red/10 overflow-hidden">
      {/* Animated subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/10 via-transparent to-netflix-red/10 animate-pulse-slow" />
      
      <div className="container mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 flex-1 overflow-hidden">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="bg-netflix-red text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-widest">
              Palavra do Dia
            </span>
            <BookOpen className="w-3.5 h-3.5 text-netflix-red" />
          </div>
          
          <div className="flex items-center gap-2 group cursor-default overflow-hidden">
            <Quote className="w-3 h-3 text-netflix-red/50 mt-[-6px] opacity-70 flex-shrink-0" />
            <p className="text-netflix-white text-xs md:text-sm font-medium italic leading-tight line-clamp-1">
              {verse.text}
            </p>
            <span className="text-netflix-red font-bold text-[11px] whitespace-nowrap ml-1 tracking-tighter">
              — {verse.book} {verse.chapter}:{verse.number}
            </span>
          </div>

          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <button 
                onClick={() => {
                  setIsDrawerOpen(true);
                  fetchFullChapter();
                }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-netflix-white/80 hover:text-white transition-all duration-300 group"
              >
                <Maximize2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ler Completo</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-netflix-black border-l border-netflix-white/10 p-0 overflow-hidden flex flex-col">
              <SheetHeader className="p-8 border-b border-netflix-white/5 bg-netflix-gray-dark/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-netflix-red w-2 h-8 rounded-full" />
                  <SheetTitle className="text-3xl font-black text-white italic tracking-tighter uppercase px-0">
                    {verse.book} <span className="text-netflix-red">{verse.chapter}</span>
                  </SheetTitle>
                </div>
                <p className="text-netflix-gray-light text-sm font-medium">Capítulo Completo (NVI)</p>
              </SheetHeader>
              
              <div className="flex-1 overflow-hidden p-0 relative">
                {isChapterLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-netflix-black/50 backdrop-blur-sm z-20">
                    <Loader2 className="w-8 h-8 text-netflix-red animate-spin" />
                    <p className="text-netflix-gray-light font-bold text-xs uppercase tracking-widest animate-pulse">Carregando Capítulo...</p>
                  </div>
                ) : (
                  <ScrollArea className="h-full px-8 py-6">
                    <div className="space-y-6 pb-12">
                      {fullChapter.map((v) => (
                        <div key={v.number} className={`flex gap-4 group ${v.number === verse.number ? 'bg-netflix-red/5 p-4 rounded-xl border border-netflix-red/20' : ''}`}>
                          <span className="text-netflix-red font-black text-sm pt-1 tabular-nums">{v.number}</span>
                          <p className={`text-netflix-white leading-relaxed font-medium transition-colors ${v.number === verse.number ? 'text-white' : 'text-netflix-white/80'}`}>
                            {v.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <div className="p-6 border-t border-netflix-white/5 bg-netflix-gray-dark/30 flex justify-center">
                <button 
                   onClick={() => setIsDrawerOpen(false)} 
                   className="w-full py-4 rounded-xl bg-netflix-red text-white font-black uppercase tracking-widest text-xs hover:bg-netflix-red/90 transition-all active:scale-95 shadow-lg shadow-netflix-red/20"
                >
                  Fechar Leitura
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <button 
          onClick={handleShare}
          className="flex items-center gap-1.5 text-netflix-gray-light hover:text-white transition-colors duration-300 group ml-auto"
        >
          <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Compartilhar</span>
        </button>
      </div>
    </div>
  );
};

export default LandingVerseStrip;
