import { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
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

// Import official brand logos
import volkswagenLogo from "@/assets/brands/volkswagen.svg";
import bmwLogo from "@/assets/brands/bmw.svg";
import audiLogo from "@/assets/brands/audi.svg";
import mercedesLogo from "@/assets/brands/mercedes.svg";
import peugeotLogo from "@/assets/brands/peugeot.svg";
import renaultLogo from "@/assets/brands/renault.svg";
import citroenLogo from "@/assets/brands/citroen.svg";
import toyotaLogo from "@/assets/brands/toyota.svg";
import fordLogo from "@/assets/brands/ford.svg";
import opelLogo from "@/assets/brands/opel.svg";

// Brand configuration with official logos
const brands = [
  { name: "Volkswagen", logo: volkswagenLogo },
  { name: "BMW", logo: bmwLogo },
  { name: "Audi", logo: audiLogo },
  { name: "Mercedes-Benz", logo: mercedesLogo },
  { name: "Peugeot", logo: peugeotLogo },
  { name: "Renault", logo: renaultLogo },
  { name: "Citroën", logo: citroenLogo },
  { name: "Toyota", logo: toyotaLogo },
  { name: "Ford", logo: fordLogo },
  { name: "Opel", logo: opelLogo },
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
                      ? "bg-primary/10 border-2 border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/30"
                      : "bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  )}>
                    {/* Selection badge */}
                    {selectedBrand === brand.name && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Brand logo */}
                    <div className={cn(
                      "w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-3 transition-all duration-300",
                      selectedBrand === brand.name
                        ? "scale-110"
                        : "group-hover:scale-105"
                    )}>
                      <img 
                        src={brand.logo} 
                        alt={`${brand.name} logo`}
                        className={cn(
                          "w-full h-full object-contain transition-all duration-300",
                          "dark:brightness-0 dark:invert",
                          selectedBrand === brand.name
                            ? "drop-shadow-lg"
                            : "group-hover:drop-shadow-md"
                        )}
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Brand name */}
                    <span className={cn(
                      "text-xs md:text-sm font-medium transition-colors duration-300 text-center",
                      selectedBrand === brand.name
                        ? "text-primary font-semibold"
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