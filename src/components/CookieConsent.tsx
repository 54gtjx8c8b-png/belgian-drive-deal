import { useState, useEffect } from "react";
import { Cookie, Settings, Shield, BarChart3, Sparkles, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  consented: boolean;
  timestamp?: number;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  personalization: false,
  consented: false,
};

const STORAGE_KEY = "autora_cookie_preferences";

const CookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CookiePreferences;
      setPreferences(parsed);
      setShowBanner(!parsed.consented);
    } else {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const updatedPrefs = { ...prefs, consented: true, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrefs));
    setPreferences(updatedPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      personalization: true,
      consented: true,
    });
  };

  const rejectAll = () => {
    savePreferences({
      essential: true,
      analytics: false,
      personalization: false,
      consented: true,
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  const cookieCategories = [
    {
      id: "essential" as const,
      icon: Shield,
      title: "Cookies essentiels",
      description: "Nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.",
      required: true,
    },
    {
      id: "analytics" as const,
      icon: BarChart3,
      title: "Cookies analytiques",
      description: "Nous aident à comprendre comment vous utilisez le site pour l'améliorer.",
      required: false,
    },
    {
      id: "personalization" as const,
      icon: Sparkles,
      title: "Cookies de personnalisation",
      description: "Permettent de mémoriser vos préférences et d'afficher des recommandations pertinentes.",
      required: false,
    },
  ];

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Main Banner */}
            {!showSettings ? (
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      Nous utilisons des cookies 🍪
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      AutoRa utilise des cookies pour améliorer votre expérience, analyser le trafic 
                      et personnaliser le contenu. Vous pouvez accepter tous les cookies, les refuser 
                      ou personnaliser vos préférences.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={acceptAll}
                        className="btn-primary-gradient"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Tout accepter
                      </Button>
                      <Button
                        onClick={rejectAll}
                        variant="outline"
                        className="border-border"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Tout refuser
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Personnaliser
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Settings Panel */
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">
                        Préférences cookies
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Gérez vos préférences de cookies
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  {cookieCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <category.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="font-medium text-foreground text-sm">
                            {category.title}
                          </h4>
                          <Switch
                            checked={preferences[category.id]}
                            onCheckedChange={(checked) =>
                              !category.required &&
                              setPreferences((prev) => ({
                                ...prev,
                                [category.id]: checked,
                              }))
                            }
                            disabled={category.required}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {category.description}
                        </p>
                        {category.required && (
                          <span className="inline-block text-xs text-primary font-medium mt-2">
                            Toujours actif
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={saveCustom}
                    className="btn-primary-gradient"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Enregistrer mes préférences
                  </Button>
                  <Button
                    onClick={acceptAll}
                    variant="outline"
                    className="border-border"
                  >
                    Tout accepter
                  </Button>
                  <Button
                    onClick={rejectAll}
                    variant="ghost"
                    className="text-muted-foreground"
                  >
                    Tout refuser
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Pour plus d'informations, consultez notre{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    politique de confidentialité
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
