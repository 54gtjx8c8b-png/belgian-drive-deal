import { Fuel, Calendar, Gauge, Settings2, Leaf, X, ChevronDown, Euro } from "lucide-react";
import { CarFilters } from "@/types/filters";
import { getAllBrands } from "@/utils/carUtils";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CarFilters;
  onFilterChange: <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => void;
  onReset: () => void;
  resultsCount: number;
}

const euroNorms = ["Euro 4", "Euro 5", "Euro 6", "Euro 6d"];

const FiltersSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  resultsCount,
}: FiltersSidebarProps) => {
  const brands = getAllBrands();
  const { t } = useLanguage();

  const fuelTypes = [
    { id: "essence", label: t("filters.gasoline") },
    { id: "diesel", label: t("filters.diesel") },
    { id: "hybride", label: t("filters.hybrid") },
    { id: "electrique", label: t("filters.electric") },
  ];

  const transmissions = [
    { id: "manuelle", label: t("filters.manual") },
    { id: "automatique", label: t("filters.automatic") },
  ];

  const toggleFuel = (fuelId: string) => {
    const newFuels = filters.fuelTypes.includes(fuelId)
      ? filters.fuelTypes.filter((f) => f !== fuelId)
      : [...filters.fuelTypes, fuelId];
    onFilterChange("fuelTypes", newFuels);
  };

  const formatPriceLabel = (value: number) => {
    if (value >= 1000000) return "1M+ €";
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k €`;
    return `${value} €`;
  };

  const formatKmLabel = (value: number) => {
    if (value >= 500000) return "500k+ km";
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k km`;
    return `${value} km`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-20 left-0 z-50 lg:z-auto
          w-80 h-[calc(100vh-5rem)] overflow-y-auto
          glass-panel p-6 space-y-6
          transform transition-transform duration-300 lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile header */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-bold">{t("filters.title")}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results count */}
        <div className="text-center py-3 px-4 rounded-xl bg-primary/10 border border-primary/20">
          <span className="text-primary font-bold text-lg">{resultsCount}</span>
          <span className="text-muted-foreground ml-2">{t("filters.vehicles")}</span>
        </div>

        {/* Brand Select */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Settings2 className="w-4 h-4 text-primary" />
            {t("filters.brand")}
          </h3>
          <div className="relative">
            <select
              value={filters.brand}
              onChange={(e) => onFilterChange("brand", e.target.value)}
              className="search-input w-full appearance-none cursor-pointer pr-10"
            >
              <option value="">{t("filters.allBrands")}</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Fuel Type */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Fuel className="w-4 h-4 text-primary" />
            {t("filters.fuel")}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {fuelTypes.map((fuel) => (
              <button
                key={fuel.id}
                onClick={() => toggleFuel(fuel.id)}
                className={`filter-chip text-center ${
                  filters.fuelTypes.includes(fuel.id) ? "active" : ""
                }`}
              >
                {fuel.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Euro className="w-4 h-4 text-primary" />
            {t("filters.budget")}
          </h3>
          <div className="px-2">
            <Slider
              min={0}
              max={200000}
              step={5000}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => {
                onFilterChange("minPrice", min);
                onFilterChange("maxPrice", max);
              }}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPriceLabel(filters.minPrice)}</span>
              <span>{formatPriceLabel(filters.maxPrice)}</span>
            </div>
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            {t("filters.year")}
          </h3>
          <div className="px-2">
            <Slider
              min={2010}
              max={2025}
              step={1}
              value={[filters.yearMin, filters.yearMax]}
              onValueChange={([min, max]) => {
                onFilterChange("yearMin", min);
                onFilterChange("yearMax", max);
              }}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.yearMin}</span>
              <span>{filters.yearMax}</span>
            </div>
          </div>
        </div>

        {/* Kilometer Range */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Gauge className="w-4 h-4 text-primary" />
            {t("filters.mileage")}
          </h3>
          <div className="px-2">
            <Slider
              min={0}
              max={200000}
              step={5000}
              value={[filters.kmMin, filters.kmMax]}
              onValueChange={([min, max]) => {
                onFilterChange("kmMin", min);
                onFilterChange("kmMax", max);
              }}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatKmLabel(filters.kmMin)}</span>
              <span>{formatKmLabel(filters.kmMax)}</span>
            </div>
          </div>
        </div>

        {/* Transmission */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Settings2 className="w-4 h-4 text-primary" />
            {t("filters.transmission")}
          </h3>
          <div className="flex gap-2">
            {transmissions.map((trans) => (
              <button
                key={trans.id}
                onClick={() =>
                  onFilterChange(
                    "transmission",
                    filters.transmission === trans.id ? "" : trans.id
                  )
                }
                className={`filter-chip flex-1 text-center ${
                  filters.transmission === trans.id ? "active" : ""
                }`}
              >
                {trans.label}
              </button>
            ))}
          </div>
        </div>

        {/* Euro Norm */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Leaf className="w-4 h-4 text-primary" />
            {t("filters.euroNorm")}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {euroNorms.map((norm) => (
              <button
                key={norm}
                onClick={() =>
                  onFilterChange("euroNorm", filters.euroNorm === norm ? "" : norm)
                }
                className={`filter-chip text-center ${
                  filters.euroNorm === norm ? "active" : ""
                }`}
              >
                {norm}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={filters.lezOnly}
              onChange={(e) => onFilterChange("lezOnly", e.target.checked)}
              className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              {t("filters.lezOnly")}
            </span>
          </label>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-full py-3 text-center text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-secondary transition-colors"
        >
          {t("filters.reset")}
        </button>
      </aside>
    </>
  );
};

export default FiltersSidebar;