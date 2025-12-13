-- Add transparency and seller type fields to car_listings
ALTER TABLE public.car_listings
ADD COLUMN IF NOT EXISTS ct_valid boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_book_complete boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS seller_type text DEFAULT 'particulier',
ADD COLUMN IF NOT EXISTS tva_number text DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.car_listings.ct_valid IS 'Contrôle Technique valide';
COMMENT ON COLUMN public.car_listings.maintenance_book_complete IS 'Carnet d''entretien complet';
COMMENT ON COLUMN public.car_listings.seller_type IS 'Type de vendeur: particulier ou professionnel';
COMMENT ON COLUMN public.car_listings.tva_number IS 'Numéro de TVA pour les vendeurs professionnels';