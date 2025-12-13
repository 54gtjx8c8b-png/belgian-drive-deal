import { useRef } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Car } from "lucide-react";
import CarCard from "./CarCard";
import { useCarListings } from "@/hooks/useCarListings";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface PopularCarsProps {
  isFavorite: (carId: string) => boolean;
  onToggleFavorite: (carId: string) => void;
  onCarClick: (carId: string) => void;
}

const PopularCars = ({ isFavorite, onToggleFavorite, onCarClick }: PopularCarsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { cars, isLoading } = useCarListings();
  const navigate = useNavigate();

  // Take the first 8 cars as "popular"
  const popularCars = cars.slice(0, 8);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Don't show section if no cars
  if (!isLoading && popularCars.length === 0) {
    return (
      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Aucune annonce disponible
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Soyez le premier à publier une annonce sur AutoRa et touchez des milliers d'acheteurs potentiels.
            </p>
            <Button onClick={() => navigate("/sell")} className="btn-primary-gradient">
              Publier une annonce
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Voitures Populaires
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Les véhicules les plus recherchés cette semaine
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          {popularCars.length > 3 && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors group"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-[320px] md:w-[350px] h-[400px] bg-secondary/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-6 px-6"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {popularCars.map((car) => (
              <div
                key={car.id}
                className="flex-shrink-0 w-[320px] md:w-[350px] snap-start"
              >
                <CarCard
                  car={car}
                  isFavorite={isFavorite(car.id)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={onCarClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCars;
