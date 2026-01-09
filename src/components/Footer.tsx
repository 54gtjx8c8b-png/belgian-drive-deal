import { Link } from "react-router-dom";
import autoraLogo from "@/assets/autora-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <footer className="bg-[hsl(224,30%,8%)] text-gray-300 mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand - Autora */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={autoraLogo} 
                alt="Autora Logo" 
                className="w-10 h-10 rounded-2xl object-cover"
              />
              <span className="font-display text-xl font-bold text-white">
                Autora
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              L'auto en toute confiance
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Trouvez votre prochaine voiture sur la première plateforme d'annonces automobiles dédiée au marché belge.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Acheter une voiture
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Vendre ma voiture
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Mes favoris
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Comparer
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Légal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Warning */}
        <div className="mt-12 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-200/80 leading-relaxed">
            <strong className="text-amber-200">⚠️ Attention :</strong> Autora est une plateforme d'annonces. Nous ne sommes pas responsables de la transaction ou de l'état du véhicule. Ne versez jamais d'acompte sans avoir vu le vendeur en personne et vérifié le véhicule.
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2024 Autora. Tous droits réservés.
          </p>
          
          {/* Language Selector */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-2 py-1 rounded transition-colors ${
                language === "fr" 
                  ? "text-white font-semibold" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              FR
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => setLanguage("nl")}
              className={`px-2 py-1 rounded transition-colors ${
                language === "nl" 
                  ? "text-white font-semibold" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              NL
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
