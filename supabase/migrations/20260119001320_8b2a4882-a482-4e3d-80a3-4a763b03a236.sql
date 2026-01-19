-- Create storage bucket for car photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-photos', 'car-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for car photos bucket
CREATE POLICY "Users can upload their own car photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'car-photos' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can update their own car photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'car-photos' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can delete their own car photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'car-photos' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Anyone can view car photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'car-photos');