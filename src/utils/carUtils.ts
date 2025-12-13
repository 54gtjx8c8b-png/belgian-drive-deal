import { Car } from "@/components/CarCard";
import { mockCars } from "@/data/mockCars";
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

// Extract unique brands from the car data
export const getAllBrands = (): string[] => {
  const brands = new Set(mockCars.map((car) => car.brand));
  return Array.from(brands).sort();
};

// Get price range
export const getPriceRange = (): { min: number; max: number } => {
  const prices = mockCars.map((car) => car.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

// Get year range
export const getYearRange = (): { min: number; max: number } => {
  const years = mockCars.map((car) => car.year);
  return {
    min: Math.min(...years),
    max: Math.max(...years),
  };
};

// Get mileage range
export const getMileageRange = (): { min: number; max: number } => {
  const mileages = mockCars.map((car) => car.mileage);
  return {
    min: Math.min(...mileages),
    max: Math.max(...mileages),
  };
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

// Get car by ID (checks both mock and database)
export const getCarById = (id: string) => {
  return mockCars.find((car) => car.id === id);
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

// Get related cars (same brand or fuel type)
export const getRelatedCars = (carId: string, limit: number = 4) => {
  const car = getCarById(carId);
  if (!car) return [];

  return mockCars
    .filter(
      (c) =>
        c.id !== carId && (c.brand === car.brand || c.fuelType === car.fuelType)
    )
    .slice(0, limit);
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
