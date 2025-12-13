import { Fuel, Calendar, Gauge, Shield, MapPin, Heart, GitCompareArrows } from "lucide-react";
import { useCompareContext } from "@/contexts/CompareContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  euroNorm: string;
  location: string;
  image: string;
  isLezCompatible: boolean;
  hasCarPass: boolean;
}

interface CarCardProps {
  car: Car;
  isFavorite?: boolean;
  onToggleFavorite?: (carId: string) => void;
  onClick?: (carId: string) => void;
}

const CarCard = ({ car, isFavorite = false, onToggleFavorite, onClick }: CarCardProps) => {
  const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompareContext();
  const { t, language } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "nl" ? "nl-BE" : language === "en" ? "en-BE" : "fr-BE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (km: number) => {
    return new Intl.NumberFormat(language === "nl" ? "nl-BE" : language === "en" ? "en-BE" : "fr-BE").format(km) + " km";
  };

  const handleClick = () => {
    if (onClick) {
      onClick(car.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(car.id);
    }
  };

  const inCompare = isInCompare(car.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(car.id);
      toast.info(t("car.removedCompare"));
    } else if (canAddMore) {
      addToCompare(car);
      toast.success(t("car.addedCompare"));
    } else {
      toast.warning(t("car.maxCompare"));
    }
  };

  return (
    <article
      className="glass-card overflow-hidden group cursor-pointer"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model} ${car.year}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleCompareClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              inCompare
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-primary"
            }`}
            title={inCompare ? t("car.removeCompare") : t("car.addCompare")}
          >
            <GitCompareArrows className="w-5 h-5" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {car.isLezCompatible && (
            <span className="lez-badge">
              <Shield className="w-3 h-3" />
              LEZ OK
            </span>
          )}
          {car.hasCarPass && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-background/90 backdrop-blur-sm text-foreground">
              <Shield className="w-3 h-3 text-primary" />
              Car-Pass
            </span>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-2 rounded-xl bg-background/95 backdrop-blur-sm font-display text-lg font-bold text-foreground">
            {formatPrice(car.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
          {car.brand} {car.model}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="w-3 h-3" />
          {car.location}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {car.year}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground">
            <Gauge className="w-3.5 h-3.5" />
            {formatMileage(car.mileage)}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground">
            <Fuel className="w-3.5 h-3.5" />
            {car.fuelType}
          </span>
        </div>
      </div>
    </article>
  );
};

export default CarCard;