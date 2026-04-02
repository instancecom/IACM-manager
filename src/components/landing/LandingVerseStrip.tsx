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
    bookAbbrev: "sl",
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
        
        // Robust abbreviation extraction
        let abbrev = "sl"; 
        if (data.book && data.book.abbrev) {
          if (typeof data.book.abbrev === 'string') {
            abbrev = data.book.abbrev;
          } else if (data.book.abbrev.pt) {
            abbrev = data.book.abbrev.pt;
          }
        }

        const verseData = {
          text: data.text,
          book: data.book?.name || "Salmos",
          bookAbbrev: abbrev,
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
      // Switched to bible-api.com for better stability as abibliadigital is unstable for chapters
      // Uses the 'almeida' translation for high quality Portuguese text
      const bookQuery = verse.book.replace(/\s/g, "+");
      const response = await fetch(
        `https://bible-api.com/${bookQuery}+${verse.chapter}?translation=almeida`
      );
      
      if (!response.ok) throw new Error("Erro ao buscar capítulo na fonte secundária");
      
      const data = await response.json();
      
      // bible-api.com returns 'verse' instead of 'number'
      const mappedVerses: ChapterVerse[] = data.verses.map((v: any) => ({
        number: v.verse,
        text: v.text.trim()
      }));

      setFullChapter(mappedVerses);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      toast.error("Não foi possível carregar o capítulo completo. Tente novamente mais tarde.");
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
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/20 via-transparent to-netflix-red/20 animate-pulse-slow lg:opacity-0" />
      
      <div className="container mx-auto px-4 py-2.5 relative z-10">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="bg-netflix-red text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest shadow-sm shadow-netflix-red/20">
                Palavra do Dia
              </span>
              <BookOpen className="w-4 h-4 text-netflix-red" />
            </div>
            
            <div className="flex items-center gap-2 group cursor-default overflow-hidden">
              <Quote className="w-3.5 h-3.5 text-netflix-red/50 mt-[-6px] opacity-70 flex-shrink-0" />
              <p className="text-netflix-white text-sm font-medium italic leading-relaxed line-clamp-1">
                {verse.text}
              </p>
              <span className="text-netflix-red font-bold text-xs whitespace-nowrap ml-1 tracking-tighter">
                — {verse.book} {verse.chapter}:{verse.number}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <SheetTrigger asChild>
                <button 
                  onClick={() => {
                    setIsDrawerOpen(true);
                    fetchFullChapter();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-netflix-white/80 hover:text-white transition-all duration-300 group"
                >
                  <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
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
                      <p className="text-netflix-gray-light font-bold text-xs uppercase tracking-widest animate-pulse">Carregando...</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-full px-8 py-6">
                      <div className="space-y-6 pb-12">
                        {fullChapter.map((v) => (
                          <div key={v.number} className={`flex gap-4 group ${v.number === verse.number ? 'bg-netflix-red/5 p-4 rounded-xl border border-netflix-red/20' : ''}`}>
                            <span className="text-netflix-red font-black text-sm pt-1 tabular-nums">{v.number}</span>
                            <p className={`text-netflix-white leading-relaxed font-medium transition-all duration-300 ${v.number === verse.number ? 'text-white scale-[1.02]' : 'text-netflix-white/80'}`}>
                              {v.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                <div className="p-6 border-t border-netflix-white/5 bg-netflix-gray-dark/30">
                  <button 
                    onClick={() => setIsDrawerOpen(false)} 
                    className="w-full py-4 rounded-xl bg-netflix-red text-white font-black uppercase tracking-widest text-xs hover:bg-netflix-red/90 transition-all active:scale-95"
                  >
                    Fechar Leitura
                  </button>
                </div>
              </SheetContent>
            </Sheet>

            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-netflix-gray-light hover:text-white transition-all duration-300 group px-2 py-1.5"
            >
              <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-netflix-red text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                Palavra do Dia
              </span>
              <BookOpen className="w-3.5 h-3.5 text-netflix-red" />
            </div>
            
            <div className="flex items-center gap-4">
              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetTrigger asChild>
                  <button 
                     onClick={() => {
                        setIsDrawerOpen(true);
                        fetchFullChapter();
                     }}
                     className="text-netflix-white/80 flex items-center gap-1"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Ler Capítulo</span>
                  </button>
                </SheetTrigger>
                {/* Mobile Sheet Content (Same as Desktop but full width) */}
                <SheetContent side="right" className="w-full bg-netflix-black border-l border-netflix-white/10 p-0 flex flex-col">
                  <SheetHeader className="p-6 border-b border-netflix-white/5 bg-netflix-gray-dark/20 text-left">
                    <SheetTitle className="text-2xl font-black text-white italic uppercase">
                      {verse.book} <span className="text-netflix-red">{verse.chapter}</span>
                    </SheetTitle>
                    <p className="text-netflix-gray-light text-[10px] font-bold uppercase tracking-widest">Versão NVI</p>
                  </SheetHeader>
                  <div className="flex-1 overflow-hidden relative">
                    {isChapterLoading ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-netflix-black/50 z-20">
                        <Loader2 className="w-8 h-8 text-netflix-red animate-spin" />
                      </div>
                    ) : (
                      <ScrollArea className="h-full px-6 py-4">
                        <div className="space-y-5 pb-12">
                          {fullChapter.map((v) => (
                            <div key={v.number} className={`flex gap-3 ${v.number === verse.number ? 'bg-netflix-red/10 p-3 rounded-lg border border-netflix-red/20' : ''}`}>
                              <span className="text-netflix-red font-black text-xs pt-0.5">{v.number}</span>
                              <p className={`text-sm leading-relaxed font-medium ${v.number === verse.number ? 'text-white' : 'text-netflix-white/90'}`}>
                                {v.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                  <div className="p-4 border-t border-netflix-white/5 bg-netflix-gray-dark/20">
                    <button 
                      onClick={() => setIsDrawerOpen(false)} 
                      className="w-full py-3.5 rounded-lg bg-netflix-red text-white font-black uppercase tracking-widest text-[10px]"
                    >
                      Voltar ao Site
                    </button>
                  </div>
                </SheetContent>
              </Sheet>

              <button 
                onClick={handleShare}
                className="text-netflix-gray-light hover:text-white"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 group overflow-hidden">
            <Quote className="w-3 h-3 text-netflix-red/50 mt-[-4px] opacity-70 flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-netflix-white text-[13px] font-medium italic leading-tight text-left">
                {verse.text}
              </p>
              <span className="text-netflix-red font-black text-[10px] uppercase tracking-wider text-left">
                — {verse.book} {verse.chapter}:{verse.number}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingVerseStrip;
