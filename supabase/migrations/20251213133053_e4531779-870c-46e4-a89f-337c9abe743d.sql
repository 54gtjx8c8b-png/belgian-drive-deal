-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create car listings table for selling
CREATE TABLE public.car_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Vehicle info
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  body_type TEXT NOT NULL,
  color TEXT NOT NULL,
  power INTEGER,
  doors INTEGER DEFAULT 5,
  
  -- Belgian specific
  euro_norm TEXT,
  vin TEXT,
  car_pass_verified BOOLEAN DEFAULT false,
  first_registration DATE,
  
  -- Description
  description TEXT,
  features TEXT[],
  
  -- Photos (stored as URLs)
  photos TEXT[] DEFAULT '{}',
  
  -- Contact info
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT NOT NULL,
  location TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'sold', 'rejected')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.car_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view approved listings"
ON public.car_listings FOR SELECT
USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own listings"
ON public.car_listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
ON public.car_listings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
ON public.car_listings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_car_listings_updated_at
BEFORE UPDATE ON public.car_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();