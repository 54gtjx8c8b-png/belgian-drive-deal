import CarCard, { Car } from "./CarCard";
import { SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface CarGridProps {
  cars: Car[];
  onOpenFilters: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isFavorite: (carId: string) => boolean;
  onToggleFavorite: (carId: string) => void;
  onCarClick: (carId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startItem: number;
  endItem: number;
  totalItems: number;
  activeFiltersCount: number;
}

const sortOptions = [
  { value: "recent", label: "Plus récentes" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "year-desc", label: "Année décroissante" },
  { value: "km-asc", label: "Kilométrage croissant" },
];

const CarGrid = ({
  cars,
  onOpenFilters,
  sortBy,
  onSortChange,
  isFavorite,
  onToggleFavorite,
  onCarClick,
  currentPage,
  totalPages,
  onPageChange,
  startItem,
  endItem,
  totalItems,
  activeFiltersCount,
}: CarGridProps) => {
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-colors ${
            i === currentPage
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Véhicules disponibles
          </h2>
          <p className="text-muted-foreground mt-1">
            {startItem}-{endItem} sur {totalItems} véhicules
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Mobile filter button */}
          <button
            onClick={onOpenFilters}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-foreground font-medium relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="search-input w-full sm:w-48 appearance-none cursor-pointer pr-10"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car, index) => (
            <div
              key={car.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
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
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Aucun véhicule trouvé
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Modifiez vos critères de recherche pour trouver des véhicules correspondants.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>

          <div className="flex items-center gap-2">{renderPagination()}</div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CarGrid;
