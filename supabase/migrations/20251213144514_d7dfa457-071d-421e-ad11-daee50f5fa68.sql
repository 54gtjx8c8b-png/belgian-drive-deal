-- Create table to track car listing views
CREATE TABLE public.car_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_listing_id UUID NOT NULL REFERENCES public.car_listings(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_hash TEXT
);

-- Enable RLS
ALTER TABLE public.car_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views (tracking)
CREATE POLICY "Anyone can insert views"
ON public.car_views
FOR INSERT
WITH CHECK (true);

-- Sellers can view stats for their own listings
CREATE POLICY "Sellers can view their listing views"
ON public.car_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.car_listings
    WHERE car_listings.id = car_views.car_listing_id
    AND car_listings.user_id = auth.uid()
  )
);

-- Create table to track favorites
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_listing_id UUID NOT NULL REFERENCES public.car_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, car_listing_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorites
CREATE POLICY "Users can view their own favorites"
ON public.favorites
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
ON public.favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites"
ON public.favorites
FOR DELETE
USING (auth.uid() = user_id);

-- Sellers can see favorites count on their listings
CREATE POLICY "Sellers can view favorites on their listings"
ON public.favorites
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.car_listings
    WHERE car_listings.id = favorites.car_listing_id
    AND car_listings.user_id = auth.uid()
  )
);

-- Add index for performance
CREATE INDEX idx_car_views_listing ON public.car_views(car_listing_id);
CREATE INDEX idx_favorites_listing ON public.favorites(car_listing_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);