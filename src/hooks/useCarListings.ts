import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/components/CarCard';

// Map database listing to Car interface
const mapListingToCar = (listing: any): Car => {
  // Determine LEZ compatibility based on Euro norm
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

export function useCarListings() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('car_listings')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching listings:', fetchError);
          setError(fetchError.message);
          return;
        }

        if (data) {
          const mappedCars = data.map(mapListingToCar);
          setCars(mappedCars);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Erreur lors du chargement des annonces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('car-listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'car_listings'
        },
        () => {
          // Refetch on any change
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    cars,
    isLoading,
    error,
    hasDbCars: cars.length > 0,
  };
}
