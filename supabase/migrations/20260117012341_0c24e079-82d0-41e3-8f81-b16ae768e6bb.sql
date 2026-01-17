-- Create reports table for ad reporting
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_listing_id UUID NOT NULL REFERENCES public.car_listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports (authenticated only, rate limiting via unique constraint)
CREATE POLICY "Authenticated users can create reports"
ON public.reports
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
ON public.reports
FOR SELECT
USING (auth.uid() = user_id);

-- Add unique constraint to prevent duplicate reports (same user, same listing)
ALTER TABLE public.reports ADD CONSTRAINT unique_user_listing_report UNIQUE (user_id, car_listing_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_reports_car_listing_id ON public.reports(car_listing_id);
CREATE INDEX idx_reports_status ON public.reports(status);