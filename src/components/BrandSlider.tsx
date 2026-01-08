import { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
// SVG logos for car brands
const BrandLogos = {
  Volkswagen: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M50 8 L30 50 L50 92 L70 50 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M26 30 L50 50 L74 30" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M26 70 L50 50 L74 70" fill="none" stroke="currentColor" strokeWidth="4"/>
    </svg>
  ),
  BMW: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M50 12 L50 88 M12 50 L88 50" stroke="currentColor" strokeWidth="2"/>
      <path d="M50 12 A38 38 0 0 1 88 50 L50 50 Z" fill="hsl(var(--primary) / 0.3)"/>
      <path d="M12 50 A38 38 0 0 1 50 88 L50 50 Z" fill="hsl(var(--primary) / 0.3)"/>
    </svg>
  ),
  Audi: (
    <svg viewBox="0 0 140 50" className="w-full h-full">
      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="55" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="85" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="115" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"/>
    </svg>
  ),
  "Mercedes-Benz": (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3"/>
      <circle cx="50" cy="50" r="8" fill="currentColor"/>
      <line x1="50" y1="42" x2="50" y2="8" stroke="currentColor" strokeWidth="4"/>
      <line x1="50" y1="50" x2="14" y2="75" stroke="currentColor" strokeWidth="4"/>
      <line x1="50" y1="50" x2="86" y2="75" stroke="currentColor" strokeWidth="4"/>
    </svg>
  ),
  Peugeot: (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <path d="M40 5 C20 5 10 25 10 40 C10 55 20 65 25 70 L25 95 L55 95 L55 70 C60 65 70 55 70 40 C70 25 60 5 40 5 Z" 
            fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M30 35 L40 25 L50 35 M30 50 L40 40 L50 50 M30 65 L40 55 L50 65" 
            fill="none" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  Renault: (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <path d="M40 5 L75 50 L40 95 L5 50 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M40 20 L60 50 L40 80 L20 50 Z" fill="none" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  Citroën: (
    <svg viewBox="0 0 100 60" className="w-full h-full">
      <path d="M10 15 L50 5 L90 15 L50 30 Z" fill="currentColor" opacity="0.8"/>
      <path d="M10 35 L50 25 L90 35 L50 50 Z" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  Toyota: (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      <ellipse cx="60" cy="40" rx="55" ry="35" fill="none" stroke="currentColor" strokeWidth="4"/>
      <ellipse cx="60" cy="40" rx="35" ry="20" fill="none" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="60" cy="40" rx="15" ry="35" fill="none" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  Ford: (
    <svg viewBox="0 0 120 50" className="w-full h-full">
      <ellipse cx="60" cy="25" rx="55" ry="22" fill="none" stroke="currentColor" strokeWidth="3"/>
      <text x="60" y="32" textAnchor="middle" fontSize="22" fontFamily="serif" fontStyle="italic" fill="currentColor">Ford</text>
    </svg>
  ),
  Opel: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
      <path d="M10 50 L90 50" stroke="currentColor" strokeWidth="6"/>
      <path d="M50 20 L90 50 L50 50 Z" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
};

const brands = [
  { name: "Volkswagen" },
  { name: "BMW" },
  { name: "Audi" },
  { name: "Mercedes-Benz" },
  { name: "Peugeot" },
  { name: "Renault" },
  { name: "Citroën" },
  { name: "Toyota" },
  { name: "Ford" },
  { name: "Opel" },
];

interface BrandSliderProps {
  onBrandFilter?: (brand: string) => void;
  selectedBrand?: string;
}

const BrandSlider = ({ onBrandFilter, selectedBrand }: BrandSliderProps) => {
  const { t } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const handleBrandClick = (brandName: string) => {
    // Toggle filter: if same brand clicked, clear filter
    if (onBrandFilter) {
      onBrandFilter(selectedBrand === brandName ? "" : brandName);
    }
    
    const resultsSection = document.getElementById("results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8 text-foreground">
          {t("brands.title")}
        </h2>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2500,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {brands.map((brand) => (
              <CarouselItem
                key={brand.name}
                className="pl-2 md:pl-4 basis-1/3 md:basis-1/5"
              >
                <button
                  onClick={() => handleBrandClick(brand.name)}
                  className="group cursor-pointer w-full"
                >
                  <div className={cn(
                    "relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl transition-all duration-300 hover:-translate-y-1",
                    selectedBrand === brand.name
                      ? "bg-primary text-primary-foreground border-2 border-primary shadow-lg shadow-primary/20"
                      : "bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  )}>
                    {/* X badge for selected brand */}
                    {selectedBrand === brand.name && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200 animate-pulse">
                        <X className="w-3 h-3" />
                      </div>
                    )}
                    <div className={cn(
                      "w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-3 transition-colors duration-300",
                      selectedBrand === brand.name
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary"
                    )}>
                      {BrandLogos[brand.name as keyof typeof BrandLogos]}
                    </div>
                    <span className={cn(
                      "text-xs md:text-sm font-medium transition-colors duration-300 text-center",
                      selectedBrand === brand.name
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {brand.name}
                    </span>
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-card border-border hover:bg-primary hover:text-primary-foreground hover:border-primary" />
          <CarouselNext className="hidden md:flex -right-12 bg-card border-border hover:bg-primary hover:text-primary-foreground hover:border-primary" />
        </Carousel>
        
        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                current === index
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;
