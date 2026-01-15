-- Create storage bucket for brand logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('brand-logos', 'brand-logos', true, 1048576, ARRAY['image/svg+xml', 'image/png', 'image/webp']);

-- Allow public read access
CREATE POLICY "Brand logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-logos');