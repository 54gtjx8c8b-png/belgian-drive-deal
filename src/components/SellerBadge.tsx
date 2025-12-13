import { Building2, User, Shield, AlertCircle } from "lucide-react";

interface SellerBadgeProps {
  sellerType?: string | null;
  sellerName: string;
  tvaNumber?: string | null;
  compact?: boolean;
}

const SellerBadge = ({
  sellerType,
  sellerName,
  tvaNumber,
  compact = false,
}: SellerBadgeProps) => {
  const isProfessional = sellerType === "professionnel";

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
          isProfessional
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isProfessional ? (
          <>
            <Building2 className="w-3 h-3" />
            Pro
          </>
        ) : (
          <>
            <User className="w-3 h-3" />
            Particulier
          </>
        )}
      </span>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-secondary/50">
      {/* Seller Type Badge */}
      <div className="flex items-center gap-2 mb-2">
        {isProfessional ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary/10 text-primary">
            <Building2 className="w-4 h-4" />
            Vendeur Pro
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground">
            <User className="w-4 h-4" />
            Particulier
          </span>
        )}
      </div>

      {/* Seller Name */}
      <p className="font-semibold text-foreground">{sellerName}</p>

      {/* Professional Info */}
      {isProfessional && (
        <div className="mt-3 space-y-2">
          {tvaNumber && (
            <p className="text-sm text-muted-foreground">
              TVA : {tvaNumber}
            </p>
          )}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/10">
            <Shield className="w-4 h-4 text-emerald-500 mt-0.5" />
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Garantie légale 1 an incluse (Loi belge)
            </p>
          </div>
        </div>
      )}

      {/* Private Seller Info */}
      {!isProfessional && (
        <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-muted">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Vente privée : Pas de garantie légale obligatoire
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerBadge;
