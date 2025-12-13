import { Fuel, Calendar, Gauge, Settings2, Leaf, X } from "lucide-react";
import { useState } from "react";

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const fuelTypes = [
  { id: "essence", label: "Essence", icon: Fuel },
  { id: "diesel", label: "Diesel", icon: Fuel },
  { id: "hybride", label: "Hybride", icon: Leaf },
  { id: "electrique", label: "Électrique", icon: Leaf },
];

const transmissions = [
  { id: "manuelle", label: "Manuelle" },
  { id: "automatique", label: "Automatique" },
];

const euroNorms = ["Euro 4", "Euro 5", "Euro 6", "Euro 6d"];

const FiltersSidebar = ({ isOpen, onClose }: FiltersSidebarProps) => {
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string>("");
  const [selectedEuro, setSelectedEuro] = useState<string>("");
  const [yearRange, setYearRange] = useState({ min: 2015, max: 2024 });
  const [kmRange, setKmRange] = useState({ min: 0, max: 150000 });

  const toggleFuel = (fuelId: string) => {
    setSelectedFuels(prev =>
      prev.includes(fuelId) ? prev.filter(f => f !== fuelId) : [...prev, fuelId]
    );
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
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-bold">Filtres</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fuel Type */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Fuel className="w-4 h-4 text-primary" />
            Carburant
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {fuelTypes.map((fuel) => (
              <button
                key={fuel.id}
                onClick={() => toggleFuel(fuel.id)}
                className={`filter-chip text-center ${selectedFuels.includes(fuel.id) ? 'active' : ''}`}
              >
                {fuel.label}
              </button>
            ))}
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Année
          </h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Min</label>
              <input
                type="number"
                value={yearRange.min}
                onChange={(e) => setYearRange({ ...yearRange, min: parseInt(e.target.value) })}
                className="search-input text-sm"
                min="2000"
                max="2024"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Max</label>
              <input
                type="number"
                value={yearRange.max}
                onChange={(e) => setYearRange({ ...yearRange, max: parseInt(e.target.value) })}
                className="search-input text-sm"
                min="2000"
                max="2024"
              />
            </div>
          </div>
        </div>

        {/* Kilometer Range */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Gauge className="w-4 h-4 text-primary" />
            Kilométrage
          </h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Min</label>
              <input
                type="number"
                value={kmRange.min}
                onChange={(e) => setKmRange({ ...kmRange, min: parseInt(e.target.value) })}
                className="search-input text-sm"
                step="10000"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Max</label>
              <input
                type="number"
                value={kmRange.max}
                onChange={(e) => setKmRange({ ...kmRange, max: parseInt(e.target.value) })}
                className="search-input text-sm"
                step="10000"
              />
            </div>
          </div>
        </div>

        {/* Transmission */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Settings2 className="w-4 h-4 text-primary" />
            Boîte de vitesse
          </h3>
          <div className="flex gap-2">
            {transmissions.map((trans) => (
              <button
                key={trans.id}
                onClick={() => setSelectedTransmission(trans.id)}
                className={`filter-chip flex-1 text-center ${selectedTransmission === trans.id ? 'active' : ''}`}
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
            Norme Euro (LEZ)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {euroNorms.map((norm) => (
              <button
                key={norm}
                onClick={() => setSelectedEuro(norm)}
                className={`filter-chip text-center ${selectedEuro === norm ? 'active' : ''}`}
              >
                {norm}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Euro 6+ = Compatible zones LEZ (Bruxelles, Anvers, Gand)
          </p>
        </div>

        {/* Apply Button */}
        <button className="btn-primary-gradient w-full">
          Appliquer les filtres
        </button>

        {/* Reset */}
        <button
          onClick={() => {
            setSelectedFuels([]);
            setSelectedTransmission("");
            setSelectedEuro("");
            setYearRange({ min: 2015, max: 2024 });
            setKmRange({ min: 0, max: 150000 });
          }}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Réinitialiser les filtres
        </button>
      </aside>
    </>
  );
};

export default FiltersSidebar;
