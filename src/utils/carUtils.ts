import { Car } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";

// Map database listing to Car interface
const mapListingToCar = (listing: any): Car => {
  const lezCompatibleNorms = ['Euro 6d', 'Euro 6c', 'Euro 6b', 'Euro 6'];
  const isLezCompatible = lezCompatibleNorms.includes(listing.euro_norm || '');

  return {
    id: listing.id,
    brand: listing.brand,
    model: listing.model,
    year: listing.year,
    price: listing.price,
    mileage: listing.mileage,
    fuelType: listing.fuel_type,
    transmission: listing.transmission,
    euroNorm: listing.euro_norm || 'Non spécifié',
    location: listing.location || 'Belgique',
    image: listing.photos?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
    isLezCompatible,
    hasCarPass: listing.car_pass_verified || false,
  };
};

// Common car brands for Belgium
const commonBrands = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai",
  "Kia", "Mazda", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Porsche",
  "Renault", "Seat", "Skoda", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

// Extract unique brands
export const getAllBrands = (): string[] => {
  return commonBrands;
};

// Get price range
export const getPriceRange = (): { min: number; max: number } => {
  return { min: 5000, max: 150000 };
};

// Get year range
export const getYearRange = (): { min: number; max: number } => {
  const currentYear = new Date().getFullYear();
  return { min: 2010, max: currentYear };
};

// Get mileage range
export const getMileageRange = (): { min: number; max: number } => {
  return { min: 0, max: 300000 };
};

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Format mileage for display
export const formatMileage = (km: number): string => {
  return new Intl.NumberFormat("fr-BE").format(km) + " km";
};

// Get car by ID from database
export const getCarByIdFromDb = async (id: string): Promise<Car | null> => {
  try {
    const { data, error } = await supabase
      .from('car_listings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapListingToCar(data);
  } catch {
    return null;
  }
};

// Get related cars from a provided list
export const getRelatedCarsFromList = (car: Car, allCars: Car[], limit: number = 4) => {
  return allCars
    .filter(
      (c) =>
        c.id !== car.id && (c.brand === car.brand || c.fuelType === car.fuelType)
    )
    .slice(0, limit);
};
