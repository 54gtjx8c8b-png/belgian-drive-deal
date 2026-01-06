export interface CarFilters {
  searchQuery: string;
  brand: string;
  model: string;
  minPrice: number;
  maxPrice: number;
  fuelTypes: string[];
  transmission: string;
  euroNorm: string;
  yearMin: number;
  yearMax: number;
  kmMin: number;
  kmMax: number;
  lezOnly: boolean;
}

export const defaultFilters: CarFilters = {
  searchQuery: "",
  brand: "",
  model: "",
  minPrice: 0,
  maxPrice: 1000000,
  fuelTypes: [],
  transmission: "",
  euroNorm: "",
  yearMin: 2000,
  yearMax: 2025,
  kmMin: 0,
  kmMax: 500000,
  lezOnly: false,
};
