-- Drop and recreate the view without SECURITY DEFINER (uses SECURITY INVOKER by default)
DROP VIEW IF EXISTS public.car_listings_public;

CREATE VIEW public.car_listings_public 
WITH (security_invoker = true)
AS
SELECT 
  id, brand, model, year, price, mileage, power, doors,
  car_pass_verified, first_registration, created_at, updated_at,
  ct_valid, maintenance_book_complete, euro_norm, seller_type,
  description, features, photos, location, status, fuel_type,
  transmission, body_type, color
FROM car_listings
WHERE status = 'approved';

-- Grant access to the view for anonymous and authenticated users
GRANT SELECT ON public.car_listings_public TO anon, authenticated;