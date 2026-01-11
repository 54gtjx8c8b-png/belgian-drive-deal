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
  maxPrice: 200000,
  fuelTypes: [],
  transmission: "",
  euroNorm: "",
  yearMin: 2010,
  yearMax: 2026,
  kmMin: 0,
  kmMax: 200000,
  lezOnly: false,
};
