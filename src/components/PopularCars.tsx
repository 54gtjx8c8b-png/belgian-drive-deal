import { useRef } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import CarCard from "./CarCard";
import { popularCars } from "@/data/mockCars";

const PopularCars = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
        </div>

        {/* Carousel */}
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
              <CarCard car={car} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {popularCars.slice(0, 4).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === 0 ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCars;
