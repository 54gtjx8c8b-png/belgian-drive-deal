import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PopularCars from "@/components/PopularCars";
import FiltersSidebar from "@/components/FiltersSidebar";
import CarGrid from "@/components/CarGrid";
import Footer from "@/components/Footer";
import CarChatbot from "@/components/CarChatbot";
import { mockCars } from "@/data/mockCars";
import { useCarFilters } from "@/hooks/useCarFilters";
import { useFavorites } from "@/hooks/useFavorites";
import { usePagination } from "@/hooks/usePagination";

const Index = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();

  const {
    filters,
    updateFilter,
    resetFilters,
    filteredCars,
    sortBy,
    setSortBy,
    activeFiltersCount,
  } = useCarFilters(mockCars);

  const { isFavorite, toggleFavorite } = useFavorites();

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
    startItem,
    endItem,
    totalItems,
  } = usePagination(filteredCars, 12);

  // Reset pagination when filters change
  useEffect(() => {
    resetPage();
  }, [filters, sortBy]);

  const handleSearch = (brand: string, model: string, maxPrice: number) => {
    updateFilter("brand", brand);
    updateFilter("searchQuery", model);
    updateFilter("maxPrice", maxPrice);
    
    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById("results-section");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleCarClick = (carId: string) => {
    navigate(`/car/${carId}`);
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Header />
      <main>
        <HeroSection onSearch={handleSearch} />

        {/* Popular Cars Section */}
        <PopularCars
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onCarClick={handleCarClick}
        />

        {/* All Listings Section */}
        <section id="results-section" className="container mx-auto px-6 pb-20">
          <div className="flex gap-8">
            <FiltersSidebar
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              resultsCount={totalItems}
            />
            <CarGrid
              cars={paginatedItems}
              onOpenFilters={() => setFiltersOpen(true)}
              sortBy={sortBy}
              onSortChange={setSortBy}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onCarClick={handleCarClick}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              startItem={startItem}
              endItem={endItem}
              totalItems={totalItems}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        </section>
      </main>
      <Footer />
      <CarChatbot />
    </div>
  );
};

export default Index;
