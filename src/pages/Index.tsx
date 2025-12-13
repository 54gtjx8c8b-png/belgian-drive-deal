import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PopularCars from "@/components/PopularCars";
import FiltersSidebar from "@/components/FiltersSidebar";
import CarGrid from "@/components/CarGrid";
import Footer from "@/components/Footer";
import { mockCars } from "@/data/mockCars";

const Index = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background dark">
      <Header />
      <main>
        <HeroSection />
        
        {/* Popular Cars Section */}
        <PopularCars />
        
        {/* All Listings Section */}
        <section className="container mx-auto px-6 pb-20">
          <div className="flex gap-8">
            <FiltersSidebar isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
            <CarGrid cars={mockCars} onOpenFilters={() => setFiltersOpen(true)} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
