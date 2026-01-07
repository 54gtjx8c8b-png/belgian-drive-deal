import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";

const brands = [
  { name: "Volkswagen", logo: "VW" },
  { name: "BMW", logo: "BMW" },
  { name: "Audi", logo: "AUDI" },
  { name: "Mercedes-Benz", logo: "MB" },
  { name: "Peugeot", logo: "PGT" },
  { name: "Renault", logo: "RNO" },
  { name: "Citroën", logo: "CTN" },
  { name: "Toyota", logo: "TYT" },
  { name: "Ford", logo: "FRD" },
  { name: "Opel", logo: "OPL" },
];

const BrandSlider = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBrandClick = (brandName: string) => {
    // Scroll to results and apply brand filter
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
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {brands.map((brand, index) => (
              <CarouselItem
                key={brand.name}
                className="pl-2 md:pl-4 basis-1/3 md:basis-1/5"
              >
                <div
                  onClick={() => handleBrandClick(brand.name)}
                  className="group cursor-pointer"
                >
                  <div className="relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                      <span className="text-sm md:text-base font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                        {brand.logo}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center">
                      {brand.name}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-card border-border hover:bg-primary hover:text-primary-foreground hover:border-primary" />
          <CarouselNext className="hidden md:flex -right-12 bg-card border-border hover:bg-primary hover:text-primary-foreground hover:border-primary" />
        </Carousel>
      </div>
    </section>
  );
};

export default BrandSlider;
