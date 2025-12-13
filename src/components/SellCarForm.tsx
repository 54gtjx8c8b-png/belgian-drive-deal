import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Car, Info, User, Camera, FileCheck, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const sellCarSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().min(1, "Le prix est requis"),
  mileage: z.number().min(0, "Le kilométrage est requis"),
  fuel_type: z.string().min(1, "Le type de carburant est requis"),
  transmission: z.string().min(1, "La transmission est requise"),
  body_type: z.string().min(1, "Le type de carrosserie est requis"),
  color: z.string().min(1, "La couleur est requise"),
  power: z.number().optional(),
  doors: z.number().optional(),
  euro_norm: z.string().optional(),
  vin: z.string().optional(),
  first_registration: z.string().optional(),
  description: z.string().optional(),
  contact_name: z.string().min(1, "Le nom est requis"),
  contact_phone: z.string().optional(),
  contact_email: z.string().email("Email invalide"),
  location: z.string().optional(),
  // Transparency fields
  car_pass_verified: z.boolean().optional(),
  ct_valid: z.boolean().optional(),
  maintenance_book_complete: z.boolean().optional(),
  // Seller type fields
  seller_type: z.string().optional(),
  tva_number: z.string().optional(),
});

type SellCarFormData = z.infer<typeof sellCarSchema>;

const brands = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Peugeot', 'Renault', 'Citroën',
  'Toyota', 'Honda', 'Ford', 'Opel', 'Hyundai', 'Kia', 'Nissan', 'Mazda',
  'Volvo', 'Skoda', 'Seat', 'Fiat', 'Alfa Romeo', 'Porsche', 'Tesla', 'Mini',
  'Dacia', 'Suzuki', 'Mitsubishi', 'Lexus', 'Jaguar', 'Land Rover', 'Jeep'
];

const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'Hybride rechargeable', 'GPL'];
const transmissions = ['Manuelle', 'Automatique'];
const bodyTypes = ['Berline', 'SUV', 'Citadine', 'Break', 'Coupé', 'Cabriolet', 'Monospace', 'Utilitaire'];
const euroNorms = ['Euro 6d', 'Euro 6c', 'Euro 6b', 'Euro 6', 'Euro 5', 'Euro 4', 'Euro 3'];
const colors = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Beige', 'Marron', 'Orange', 'Jaune'];
const sellerTypes = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'professionnel', label: 'Professionnel' },
];

interface SellCarFormProps {
  editId?: string;
}

export function SellCarForm({ editId }: SellCarFormProps) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const isEditMode = !!editId;

  const form = useForm<SellCarFormData>({
    resolver: zodResolver(sellCarSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      doors: 5,
      seller_type: 'particulier',
      car_pass_verified: false,
      ct_valid: false,
      maintenance_book_complete: false,
    }
  });

  // Load existing listing data for edit mode
  useEffect(() => {
    if (!editId) return;

    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('car_listings')
          .select('*')
          .eq('id', editId)
          .maybeSingle();

        if (error || !data) {
          toast.error("Annonce introuvable");
          navigate('/dashboard');
          return;
        }

        // Check ownership
        const { data: { user } } = await supabase.auth.getUser();
        if (data.user_id !== user?.id) {
          toast.error("Vous n'êtes pas autorisé à modifier cette annonce");
          navigate('/dashboard');
          return;
        }

        // Populate form
        form.reset({
          brand: data.brand,
          model: data.model,
          year: data.year,
          price: data.price,
          mileage: data.mileage,
          fuel_type: data.fuel_type,
          transmission: data.transmission,
          body_type: data.body_type,
          color: data.color,
          power: data.power || undefined,
          doors: data.doors || 5,
          euro_norm: data.euro_norm || undefined,
          vin: data.vin || undefined,
          first_registration: data.first_registration || undefined,
          description: data.description || undefined,
          contact_name: data.contact_name,
          contact_phone: data.contact_phone || undefined,
          contact_email: data.contact_email,
          location: data.location || undefined,
          // New fields
          car_pass_verified: data.car_pass_verified || false,
          ct_valid: data.ct_valid || false,
          maintenance_book_complete: data.maintenance_book_complete || false,
          seller_type: data.seller_type || 'particulier',
          tva_number: data.tva_number || undefined,
        });

        // Set existing photos
        if (data.photos && data.photos.length > 0) {
          setExistingPhotos(data.photos);
          setPhotosPreviews(data.photos);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Erreur lors du chargement de l'annonce");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [editId, form, navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files).slice(0, 10 - photos.length);
    
    newPhotos.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 5MB)`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotosPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
      setPhotos(prev => [...prev, file]);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('car-photos')
        .upload(fileName, photo);
      
      if (error) {
        console.error('Upload error:', error);
        continue;
      }
      
      const { data: urlData } = supabase.storage
        .from('car-photos')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(urlData.publicUrl);
    }
    
    return uploadedUrls;
  };

  const onSubmit = async (data: SellCarFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour vendre une voiture");
        navigate('/auth');
        return;
      }

      // Check if we have photos (new or existing)
      const hasPhotos = photos.length > 0 || existingPhotos.length > 0;
      if (!hasPhotos) {
        toast.error("Ajoutez au moins une photo de votre véhicule");
        setIsSubmitting(false);
        return;
      }

      // Upload new photos if any
      let allPhotoUrls = [...existingPhotos];
      if (photos.length > 0) {
        const newPhotoUrls = await uploadPhotos(user.id);
        allPhotoUrls = [...allPhotoUrls, ...newPhotoUrls];
      }

      if (allPhotoUrls.length === 0) {
        toast.error("Erreur lors de l'upload des photos");
        setIsSubmitting(false);
        return;
      }

      if (isEditMode && editId) {
        // Update existing listing
        const { error } = await supabase
          .from('car_listings')
          .update({
            brand: data.brand,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            fuel_type: data.fuel_type,
            transmission: data.transmission,
            body_type: data.body_type,
            color: data.color,
            power: data.power || null,
            doors: data.doors || 5,
            euro_norm: data.euro_norm || null,
            vin: data.vin || null,
            first_registration: data.first_registration || null,
            description: data.description || null,
            contact_name: data.contact_name,
            contact_phone: data.contact_phone || null,
            contact_email: data.contact_email,
            location: data.location || null,
            photos: allPhotoUrls,
            // New fields
            car_pass_verified: data.car_pass_verified || false,
            ct_valid: data.ct_valid || false,
            maintenance_book_complete: data.maintenance_book_complete || false,
            seller_type: data.seller_type || 'particulier',
            tva_number: data.tva_number || null,
          })
          .eq('id', editId);

        if (error) {
          console.error('Update error:', error);
          toast.error("Erreur lors de la modification de l'annonce");
          return;
        }

        toast.success("Votre annonce a été modifiée avec succès!");
        navigate('/dashboard');
      } else {
        // Insert new listing
        const { error } = await supabase
          .from('car_listings')
          .insert({
            user_id: user.id,
            brand: data.brand,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            fuel_type: data.fuel_type,
            transmission: data.transmission,
            body_type: data.body_type,
            color: data.color,
            power: data.power || null,
            doors: data.doors || 5,
            euro_norm: data.euro_norm || null,
            vin: data.vin || null,
            first_registration: data.first_registration || null,
            description: data.description || null,
            contact_name: data.contact_name,
            contact_phone: data.contact_phone || null,
            contact_email: data.contact_email,
            location: data.location || null,
            photos: allPhotoUrls,
            status: 'pending',
            // New fields
            car_pass_verified: data.car_pass_verified || false,
            ct_valid: data.ct_valid || false,
            maintenance_book_complete: data.maintenance_book_complete || false,
            seller_type: data.seller_type || 'particulier',
            tva_number: data.tva_number || null,
          });

        if (error) {
          console.error('Insert error:', error);
          toast.error("Erreur lors de la création de l'annonce");
          return;
        }

        toast.success("Votre annonce a été soumise avec succès!");
        navigate('/');
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeExistingPhoto = (index: number) => {
    const photoUrl = photosPreviews[index];
    if (existingPhotos.includes(photoUrl)) {
      setExistingPhotos(prev => prev.filter(p => p !== photoUrl));
    }
    setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Photos Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Camera className="h-5 w-5 text-primary" />
              Photos du véhicule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {photosPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
                  <img src={preview} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const photoUrl = photosPreviews[index];
                      if (existingPhotos.includes(photoUrl)) {
                        removeExistingPhoto(index);
                      } else {
                        removePhoto(index);
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                      Photo principale
                    </span>
                  )}
                </div>
              ))}
              
              {photos.length < 10 && (
                <label className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/50">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Ajouter</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Ajoutez jusqu'à 10 photos. La première sera la photo principale. Max 5MB par photo.
            </p>
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Car className="h-5 w-5 text-primary" />
              Informations du véhicule
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marque *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modèle *</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Golf GTI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix (€) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25000"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilométrage *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="50000"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuel_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carburant *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuelTypes.map(fuel => (
                        <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transmissions.map(trans => (
                        <SelectItem key={trans} value={trans}>{trans}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrosserie *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bodyTypes.map(body => (
                        <SelectItem key={body} value={body}>{body}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="power"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puissance (ch)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="150"
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portes</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Belgian Specifics */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Info className="h-5 w-5 text-primary" />
              Informations belges
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="euro_norm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Norme Euro</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {euroNorms.map(norm => (
                        <SelectItem key={norm} value={norm}>{norm}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de châssis (VIN)</FormLabel>
                  <FormControl>
                    <Input placeholder="WVWZZZ3CZWE123456" maxLength={17} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_registration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Première immatriculation</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Transparency Indicators */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileCheck className="h-5 w-5 text-primary" />
              Indicateurs de Transparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Ces informations rassurent les acheteurs et mettent en avant votre annonce.
            </p>
            
            <FormField
              control={form.control}
              name="car_pass_verified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border/50 p-4 hover:bg-secondary/50 transition-colors">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Car-Pass disponible
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Le Car-Pass certifie l'historique kilométrique du véhicule
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ct_valid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border/50 p-4 hover:bg-secondary/50 transition-colors">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Contrôle Technique valide
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Le véhicule a passé le contrôle technique récemment
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintenance_book_complete"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border/50 p-4 hover:bg-secondary/50 transition-colors">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Carnet d'entretien complet
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      L'historique d'entretien du véhicule est disponible
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Seller Type */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Type de vendeur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="seller_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vous êtes *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sellerTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('seller_type') === 'professionnel' && (
              <FormField
                control={form.control}
                name="tva_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de TVA</FormLabel>
                    <FormControl>
                      <Input placeholder="BE0123456789" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      En tant que professionnel, vous offrez une garantie légale d'1 an (Loi belge)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch('seller_type') === 'particulier' && (
              <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                En tant que particulier, aucune garantie légale n'est obligatoire.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre véhicule en détail: historique, entretien, options, état..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-primary" />
              Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.be" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+32 xxx xx xx xx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Bruxelles, Anvers, Liège..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(isEditMode ? '/dashboard' : '/')}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[200px]">
            {isSubmitting 
              ? (isEditMode ? "Modification en cours..." : "Publication en cours...") 
              : (isEditMode ? "Enregistrer les modifications" : "Publier l'annonce")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
