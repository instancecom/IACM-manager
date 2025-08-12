import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface ContentShelfProps {
  title: string;
  children: React.ReactNode;
}

const ContentShelf = ({ title, children }: ContentShelfProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-8 sm:mb-12">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="heading-5 sm:heading-4 text-foreground mb-4 sm:mb-6">{title}</h2>
        
        <div className="relative group">
          {/* Left scroll button - Hidden on mobile, visible on desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Content container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 gap-3 sm:gap-4 touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {children}
          </div>

          {/* Right scroll button - Hidden on mobile, visible on desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={scrollRight}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentShelf;