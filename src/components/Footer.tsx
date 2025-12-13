import { Mail, Phone, MapPin } from "lucide-react";
import autoraLogo from "@/assets/autora-logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-3">
              <img 
                src={autoraLogo} 
                alt="AutoRa Logo" 
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="font-display text-xl font-bold text-foreground">
                Auto<span className="gradient-text">Ra</span>
              </span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              La marketplace automobile belge de confiance. Tous nos véhicules sont vérifiés avec Car-Pass.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Acheter une voiture
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Vendre ma voiture
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Estimer mon véhicule
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Guide LEZ Belgique
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Informations</h4>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  À propos de nous
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Car-Pass Belgique
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Conditions générales
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                contact@autora.be
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                +32 2 123 45 67
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                Bruxelles, Belgique
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 AutoRa. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">Fait avec ❤️ en Belgique</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
