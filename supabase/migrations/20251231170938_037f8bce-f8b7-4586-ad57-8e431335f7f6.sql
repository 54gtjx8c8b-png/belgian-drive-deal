-- Create a secure public view that excludes sensitive fields
CREATE OR REPLACE VIEW public.car_listings_public AS
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

-- Create a secure function to get seller contact info (authenticated users only)
CREATE OR REPLACE FUNCTION public.get_seller_contact(listing_id uuid)
RETURNS TABLE(
  contact_name text, 
  contact_phone text, 
  contact_email text,
  user_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return contact info if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT cl.contact_name, cl.contact_phone, cl.contact_email, cl.user_id
  FROM car_listings cl
  WHERE cl.id = listing_id AND cl.status = 'approved';
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_seller_contact(uuid) TO authenticated;