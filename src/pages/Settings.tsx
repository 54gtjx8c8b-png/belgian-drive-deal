import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      // Fetch user preferences
      const { data: preferences } = await supabase
        .from("user_preferences")
        .select("email_notifications_enabled")
        .eq("user_id", user.id)
        .single();
      
      if (preferences) {
        setEmailNotifications(preferences.email_notifications_enabled);
      } else {
        // Create preferences if they don't exist (for existing users)
        await supabase
          .from("user_preferences")
          .insert({ user_id: user.id, email_notifications_enabled: true });
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleToggleNotifications = async (enabled: boolean) => {
    setIsSaving(true);
    setEmailNotifications(enabled);

    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({ 
          user_id: user.id, 
          email_notifications_enabled: enabled 
        }, { 
          onConflict: "user_id" 
        });

      if (error) throw error;
      
      toast.success(enabled 
        ? "Notifications email activées" 
        : "Notifications email désactivées"
      );
    } catch (error) {
      console.error("Error updating preferences:", error);
      setEmailNotifications(!enabled); // Revert on error
      toast.error("Erreur lors de la mise à jour des préférences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold mb-8">Paramètres</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">
                  Notifications par email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recevez un email quand un acheteur vous envoie un message
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={handleToggleNotifications}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Compte</CardTitle>
            <CardDescription>
              Informations de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
