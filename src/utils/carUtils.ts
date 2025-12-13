import { mockCars } from "@/data/mockCars";

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

// Get car by ID
export const getCarById = (id: string) => {
  return mockCars.find((car) => car.id === id);
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
