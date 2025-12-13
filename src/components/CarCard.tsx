import { Fuel, Calendar, Gauge, Shield, MapPin } from "lucide-react";

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
}

const CarCard = ({ car }: CarCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (km: number) => {
    return new Intl.NumberFormat('fr-BE').format(km) + ' km';
  };

  return (
    <article className="glass-card overflow-hidden group cursor-pointer">
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model} ${car.year}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
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
