import { useState } from "react";
import { Shield, Leaf, AlertTriangle, Ban, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LezWidgetProps {
  euroNorm?: string | null;
  fuelType?: string;
  compact?: boolean;
}

type LezStatus = "green" | "orange" | "red";

interface LezInfo {
  status: LezStatus;
  title: string;
  description: string;
  icon: React.ElementType;
}

const getLezStatus = (euroNorm?: string | null, fuelType?: string): LezInfo => {
  const norm = euroNorm?.toLowerCase() || "";
  const fuel = fuelType?.toLowerCase() || "";

  // Electric/Hydrogen = always green
  if (fuel === "électrique" || fuel === "hydrogène") {
    return {
      status: "green",
      title: "Accès illimité LEZ",
      description: "Bruxelles, Anvers, Gand",
      icon: Leaf,
    };
  }

  // Euro 6 variants = green
  if (norm.includes("euro 6")) {
    return {
      status: "green",
      title: "Accès illimité LEZ",
      description: "Bruxelles, Anvers, Gand",
      icon: Leaf,
    };
  }

  // Euro 5 = orange (restrictions coming)
  if (norm.includes("euro 5")) {
    return {
      status: "orange",
      title: "Accès sous conditions",
      description: fuel === "diesel" ? "Interdit à Bruxelles dès 2025" : "Restrictions à venir",
      icon: AlertTriangle,
    };
  }

  // Euro 4 = orange for petrol, red for diesel
  if (norm.includes("euro 4")) {
    if (fuel === "diesel") {
      return {
        status: "red",
        title: "Restrictions actives",
        description: "Interdit dans les LEZ belges",
        icon: Ban,
      };
    }
    return {
      status: "orange",
      title: "Accès sous conditions",
      description: "Restrictions possibles",
      icon: AlertTriangle,
    };
  }

  // Euro 3 or less = red
  if (norm.includes("euro 3") || norm.includes("euro 2") || norm.includes("euro 1")) {
    return {
      status: "red",
      title: "Restrictions actives",
      description: "Interdit dans les LEZ belges",
      icon: Ban,
    };
  }

  // Unknown = orange (be cautious)
  return {
    status: "orange",
    title: "Vérification requise",
    description: "Norme Euro non spécifiée",
    icon: AlertTriangle,
  };
};

const statusColors = {
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: "text-emerald-500",
    badge: "bg-emerald-500",
  },
  orange: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    icon: "text-amber-500",
    badge: "bg-amber-500",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-600 dark:text-red-400",
    icon: "text-red-500",
    badge: "bg-red-500",
  },
};

const LezWidget = ({ euroNorm, fuelType, compact = false }: LezWidgetProps) => {
  const [showModal, setShowModal] = useState(false);
  const lezInfo = getLezStatus(euroNorm, fuelType);
  const colors = statusColors[lezInfo.status];
  const Icon = lezInfo.icon;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text}`}
      >
        <Icon className="w-3 h-3" />
        LEZ
      </div>
    );
  }

  return (
    <>
      <div
        className={`glass-card p-5 border ${colors.border} ${colors.bg} cursor-pointer hover:scale-[1.01] transition-transform`}
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}
          >
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-display font-bold ${colors.text}`}>
                {lezInfo.title}
              </h3>
              <div className={`w-2 h-2 rounded-full ${colors.badge}`} />
            </div>
            <p className="text-sm text-muted-foreground">{lezInfo.description}</p>
            {euroNorm && (
              <p className="text-xs text-muted-foreground mt-1">
                Norme : {euroNorm}
              </p>
            )}
          </div>
          <button
            className="text-primary hover:underline text-sm flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            En savoir plus
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Zones de Basses Émissions (LEZ) en Belgique
            </DialogTitle>
            <DialogDescription>
              Règlementation des véhicules dans les zones urbaines belges
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10">
                <Leaf className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Accès illimité
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Euro 6 (tous), Euro 5 Essence, véhicules électriques et hybrides rechargeables
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-600 dark:text-amber-400">
                    Accès sous conditions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Euro 5 Diesel (interdit à Bruxelles dès 2025), Euro 4 Essence
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10">
                <Ban className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    Accès interdit
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Euro 4 Diesel et moins, Euro 3 et moins (tous carburants)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-semibold text-foreground mb-2">Villes concernées</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Bruxelles</strong> : LEZ active depuis 2018</li>
                <li>• <strong>Anvers</strong> : LEZ active depuis 2020</li>
                <li>• <strong>Gand</strong> : LEZ active depuis 2020</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open("https://www.lez.brussels/", "_blank")}
              >
                LEZ Bruxelles
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open("https://www.slimnaarantwerpen.be/en/LEZ", "_blank")}
              >
                LEZ Anvers
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LezWidget;
