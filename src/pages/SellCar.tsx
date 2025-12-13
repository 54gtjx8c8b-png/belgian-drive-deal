import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SellCarForm } from '@/components/SellCarForm';
import { Button } from '@/components/ui/button';
import { Car, Shield, Clock, CheckCircle } from 'lucide-react';

export default function SellCar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {editId ? 'Modifier votre annonce' : 'Vendez votre voiture'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {editId 
                ? 'Mettez à jour les informations de votre véhicule'
                : 'Publiez votre annonce en quelques minutes et touchez des milliers d\'acheteurs en Belgique'}
            </p>
          </div>

          {!isAuthenticated ? (
            /* Login CTA */
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center">
                <Car className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Connectez-vous pour vendre
                </h2>
                <p className="text-muted-foreground mb-8">
                  Créez un compte gratuit pour publier votre annonce et gérer vos véhicules.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center">
                    <Shield className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Annonces sécurisées</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Publication rapide</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-8 w-8 text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Vérification Car-Pass</span>
                  </div>
                </div>
                
                <Button size="lg" onClick={() => navigate('/auth')} className="min-w-[200px]">
                  Se connecter / S'inscrire
                </Button>
              </div>
            </div>
          ) : (
            /* Sell Form */
            <div className="max-w-4xl mx-auto">
              <SellCarForm editId={editId || undefined} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
