import { ArrowRight, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const SellCarBanner = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-foreground">
                {t("sellBanner.title")}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                {t("sellBanner.subtitle")}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/sell")}
            className="btn-primary-gradient group whitespace-nowrap"
            size="sm"
          >
            {t("sellBanner.cta")}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SellCarBanner;
