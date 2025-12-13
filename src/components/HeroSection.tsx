import { Search, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllBrands } from "@/utils/carUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  onSearch: (brand: string, model: string, maxPrice: number) => void;
}

const budgets = [
  { label: "< 15 000€", value: 15000 },
  { label: "15 000€ - 25 000€", value: 25000 },
  { label: "25 000€ - 40 000€", value: 40000 },
  { label: "40 000€ - 60 000€", value: 60000 },
  { label: "60 000€ - 100 000€", value: 100000 },
  { label: "> 100 000€", value: 1000000 },
];

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<number>(0);
  const [model, setModel] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    setBrands(getAllBrands());
  }, []);

  const handleSearch = () => {
    onSearch(selectedBrand, model, selectedBudget || 1000000);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "-3s" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t("hero.badge")}
          </div>

          {/* Headline */}
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {t("hero.title1")}
            <br />
            <span className="gradient-text">{t("hero.title2")}</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("hero.subtitle")}
          </p>

          {/* Search Box */}
          <div
            className="glass-panel p-3 md:p-4 max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Brand Select */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="search-input w-full appearance-none cursor-pointer pr-10"
                >
                  <option value="">{t("filters.brand")}</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Model Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("filters.model")}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Budget Select */}
              <div className="relative">
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(Number(e.target.value))}
                  className="search-input w-full appearance-none cursor-pointer pr-10"
                >
                  <option value={0}>{t("filters.budget")}</option>
                  {budgets.map((budget) => (
                    <option key={budget.value} value={budget.value}>
                      {budget.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="btn-primary-gradient flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="font-semibold">{t("hero.search")}</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
                150+
              </div>
              <div className="text-muted-foreground text-sm">{t("hero.vehicles")}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
                98%
              </div>
              <div className="text-muted-foreground text-sm">{t("hero.verified")}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
                50+
              </div>
              <div className="text-muted-foreground text-sm">{t("hero.brands")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;