import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/components/CarCard';

const PAGE_SIZE = 20;

// Map database listing to Car interface
const mapListingToCar = (listing: any): Car => {
  const lezCompatibleNorms = ['Euro 6d', 'Euro 6c', 'Euro 6b', 'Euro 6'];
  const isLezCompatible = lezCompatibleNorms.includes(listing.euro_norm || '') || 
    listing.fuel_type?.toLowerCase() === 'électrique';

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

export function useInfiniteCarListings() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchListings = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      // Get total count first
      const { count } = await supabase
        .from('car_listings_public')
        .select('*', { count: 'exact', head: true });

      if (count !== null) {
        setTotalCount(count);
      }

      // Fetch paginated data
      const { data, error: fetchError } = await supabase
        .from('car_listings_public')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      if (fetchError) {
        console.error('Error fetching listings:', fetchError);
        setError(fetchError.message);
        return;
      }

      if (data) {
        const mappedCars = data.map(mapListingToCar);
        
        if (append) {
          setCars(prev => [...prev, ...mappedCars]);
        } else {
          setCars(mappedCars);
        }

        // Check if there are more items
        setHasMore(data.length === PAGE_SIZE && (pageNum + 1) * PAGE_SIZE < (count || 0));
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Erreur lors du chargement des annonces');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(0, false);
  }, [fetchListings]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchListings(nextPage, true);
    }
  }, [isLoadingMore, hasMore, page, fetchListings]);

  const refresh = useCallback(() => {
    setPage(0);
    setCars([]);
    fetchListings(0, false);
  }, [fetchListings]);

  return {
    cars,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount,
  };
}
