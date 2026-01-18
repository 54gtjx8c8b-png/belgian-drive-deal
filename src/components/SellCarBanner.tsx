import { ArrowRight, Car, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const SellCarBanner = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("sellBannerDismissed");
    if (dismissed) {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("sellBannerDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative overflow-hidden"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
          
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" 
               style={{ 
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 3s ease-in-out infinite'
               }} 
          />
          
          <div className="relative container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:py-5">
              {/* Left content */}
              <div className="flex items-center gap-4">
                {/* Icon with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                    <Car className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                
                {/* Text content */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {t("sellBanner.badge") || "Gratuit"}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {t("sellBanner.title")}
                  </h3>
                  <p className="text-sm text-muted-foreground hidden sm:block max-w-md">
                    {t("sellBanner.subtitle")}
                  </p>
                </div>
              </div>

              {/* Right content - CTA */}
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => navigate("/sell")}
                  size="lg"
                  className="btn-primary-gradient group whitespace-nowrap font-semibold px-6 shadow-lg hover:shadow-xl transition-all"
                >
                  {t("sellBanner.cta")}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-full h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom border gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default SellCarBanner;
