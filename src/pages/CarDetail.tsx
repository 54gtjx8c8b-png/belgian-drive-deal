import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Shield,
  Leaf,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard, { Car } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { getCarById, getCarByIdFromDb, getRelatedCars, formatPrice, formatMileage } from "@/utils/carUtils";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [car, setCar] = useState<Car | null>(null);
  const [dbListing, setDbListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      // First check mock cars
      const mockCar = getCarById(id);
      if (mockCar) {
        setCar(mockCar);
        setIsLoading(false);
        return;
      }

      // Then check database
      const dbCar = await getCarByIdFromDb(id);
      if (dbCar) {
        setCar(dbCar);
        
        // Also fetch full listing for extra details
        const { data } = await supabase
          .from('car_listings')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (data) {
          setDbListing(data);
        }
      }
      
      setIsLoading(false);
    };

    fetchCar();
  }, [id]);

  const relatedCars = id && car ? getRelatedCars(id, 4) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark">
        <Header />
        <main className="container mx-auto px-6 py-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background dark">
        <Header />
        <main className="container mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Véhicule non trouvé
          </h1>
          <p className="text-muted-foreground mb-8">
            Ce véhicule n'existe pas ou a été retiré de la vente.
          </p>
          <Button onClick={() => navigate("/")} className="btn-primary-gradient">
            Retour aux annonces
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Use photos from DB listing if available, otherwise mock images
  const images = dbListing?.photos?.length > 0 
    ? dbListing.photos 
    : [
        car.image,
        car.image.replace("w=800", "w=801"),
        car.image.replace("w=800", "w=802"),
        car.image.replace("w=800", "w=803"),
      ];

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${car.brand} ${car.model}`,
        text: `Découvrez cette ${car.brand} ${car.model} à ${formatPrice(car.price)}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans le presse-papier",
      });
    }
  };

  const handleContact = (method: string) => {
    if (dbListing) {
      if (method === "Email" && dbListing.contact_email) {
        window.location.href = `mailto:${dbListing.contact_email}?subject=Intéressé par votre ${car.brand} ${car.model}`;
        return;
      }
      if (method === "Appeler" && dbListing.contact_phone) {
        window.location.href = `tel:${dbListing.contact_phone}`;
        return;
      }
      if (method === "WhatsApp" && dbListing.contact_phone) {
        const phone = dbListing.contact_phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=Bonjour, je suis intéressé par votre ${car.brand} ${car.model}`, '_blank');
        return;
      }
    }
    
    toast({
      title: "Contact",
      description: `Fonctionnalité "${method}" disponible en version complète`,
    });
  };

  const specs = [
    { icon: Calendar, label: "Année", value: car.year.toString() },
    { icon: Gauge, label: "Kilométrage", value: formatMileage(car.mileage) },
    { icon: Fuel, label: "Carburant", value: car.fuelType },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Leaf, label: "Norme Euro", value: car.euroNorm },
    { icon: MapPin, label: "Localisation", value: car.location },
  ];

  const description = dbListing?.description || `Superbe ${car.brand} ${car.model} de ${car.year} en excellent état.
Ce véhicule dispose d'une transmission ${car.transmission.toLowerCase()} et fonctionne au ${car.fuelType.toLowerCase()}. Avec seulement ${formatMileage(car.mileage)} au compteur, cette voiture est idéale pour les trajets quotidiens comme pour les longs voyages. Norme ${car.euroNorm}, compatible avec toutes les zones à faibles émissions de Belgique.`;

  const sellerName = dbListing?.contact_name || "AutoBelgica Motors";

  return (
    <div className="min-h-screen bg-background dark">
      <Header />
      <main className="pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux résultats
          </button>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image Gallery */}
              <div className="glass-card overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {car.isLezCompatible && (
                      <span className="lez-badge">
                        <Shield className="w-3 h-3" />
                        LEZ OK
                      </span>
                    )}
                    {car.hasCarPass && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-background/90 backdrop-blur-sm text-foreground">
                        <Shield className="w-4 h-4 text-primary" />
                        Car-Pass
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="p-4 flex gap-3 overflow-x-auto">
                    {images.map((img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? "border-primary"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Vue ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">
                  Caractéristiques
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center gap-3 p-4 rounded-xl bg-secondary"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <spec.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-semibold text-foreground">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Car-Pass Transparency */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Transparence Car-Pass
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Historique vérifié du véhicule
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    "Historique kilométrique vérifié",
                    "Aucun accident déclaré",
                    "Entretien régulier chez un concessionnaire agréé",
                    "Contrôle technique valide",
                    "Compatible zones LEZ (Bruxelles, Anvers, Gand)",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            </div>

            {/* Right Column - Price & Contact */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="glass-card p-6 sticky top-24">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      {car.brand} {car.model}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {car.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isFavorite(car.id)
                          ? "bg-red-500 text-white"
                          : "bg-secondary text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isFavorite(car.id) ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-4xl font-display font-bold text-foreground mb-6">
                  {formatPrice(car.price)}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleContact("Appeler")}
                    className="w-full h-12 btn-primary-gradient"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Appeler le vendeur
                  </Button>
                  <Button
                    onClick={() => handleContact("Email")}
                    variant="outline"
                    className="w-full h-12"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Envoyer un email
                  </Button>
                  <Button
                    onClick={() => handleContact("WhatsApp")}
                    variant="outline"
                    className="w-full h-12"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    {dbListing ? "Vendeur particulier" : "Vendeur professionnel vérifié"}
                  </p>
                  <p className="font-semibold text-foreground">{sellerName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Cars */}
          {relatedCars.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                Véhicules similaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedCars.map((relatedCar) => (
                  <CarCard
                    key={relatedCar.id}
                    car={relatedCar}
                    isFavorite={isFavorite(relatedCar.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={(id) => navigate(`/car/${id}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarDetail;
