import CarCard, { Car } from "./CarCard";
import { SlidersHorizontal } from "lucide-react";

interface CarGridProps {
  cars: Car[];
  onOpenFilters: () => void;
}

const CarGrid = ({ cars, onOpenFilters }: CarGridProps) => {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Véhicules disponibles
          </h2>
          <p className="text-muted-foreground mt-1">
            {cars.length} véhicules trouvés
          </p>
        </div>

        {/* Mobile filter button */}
        <button
          onClick={onOpenFilters}
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-foreground font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map((car, index) => (
          <div
            key={car.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {/* Load More */}
      {cars.length > 0 && (
        <div className="mt-12 text-center">
          <button className="px-8 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors">
            Charger plus de véhicules
          </button>
        </div>
      )}
    </div>
  );
};

export default CarGrid;
