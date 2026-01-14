import { Link } from "react-router-dom";
import autoraLogo from "@/assets/autora-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, FileCheck, Car, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const { t, language, setLanguage } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[hsl(224,30%,8%)] text-gray-300 mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand - Autora */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={autoraLogo} 
                alt="Autora Logo - Marketplace automobile belge" 
                className="w-10 h-10 rounded-2xl object-cover"
              />
              <span className="font-display text-xl font-bold text-white">
                Autora
              </span>
            </Link>
            <p className="text-primary font-semibold text-sm">
              {language === "nl" ? "Uw auto met vertrouwen" : "L'auto en toute confiance"}
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              {language === "nl" 
                ? "Vind uw volgende auto op het eerste autoplatform gewijd aan de Belgische markt."
                : "Trouvez votre prochaine voiture sur la première plateforme d'annonces automobiles dédiée au marché belge."
              }
            </p>
            
            {/* Trust badges */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Car-Pass</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <FileCheck className="w-4 h-4 text-blue-500" />
                <span>LEZ</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">
              {language === "nl" ? "Navigatie" : "Navigation"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {language === "nl" ? "Een auto kopen" : "Acheter une voiture"}
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {language === "nl" ? "Mijn auto verkopen" : "Vendre ma voiture"}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {language === "nl" ? "Mijn favorieten" : "Mes favoris"}
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {language === "nl" ? "Vergelijken" : "Comparer"}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal & RGPD */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">
              {language === "nl" ? "Juridisch" : "Légal"}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {language === "nl" ? "Over ons" : "À propos"}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {language === "nl" ? "Algemene voorwaarden" : "Conditions générales"}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {language === "nl" ? "Privacybeleid (GDPR)" : "Politique de confidentialité (RGPD)"}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {language === "nl" ? "Wettelijke vermeldingen" : "Mentions légales"}
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.carpass.be" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Car-Pass Belgique
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {language === "nl" ? "Contactformulier" : "Formulaire de contact"}
                </Link>
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@autora.be
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Belgique / België
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Warning - Belgian specific */}
        <div className="mt-12 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-200/80 leading-relaxed">
            <strong className="text-amber-200">⚠️ {language === "nl" ? "Opgelet" : "Attention"} :</strong>{" "}
            {language === "nl" 
              ? "Autora is een advertentieplatform. Wij zijn niet verantwoordelijk voor de transactie of de staat van het voertuig. Betaal nooit een voorschot zonder de verkoper persoonlijk te hebben ontmoet en het voertuig te hebben gecontroleerd."
              : "Autora est une plateforme d'annonces. Nous ne sommes pas responsables de la transaction ou de l'état du véhicule. Ne versez jamais d'acompte sans avoir vu le vendeur en personne et vérifié le véhicule."
            }
          </p>
        </div>

        {/* RGPD Notice */}
        <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-200/80 leading-relaxed">
            <strong className="text-blue-200">🔒 {language === "nl" ? "Privacy (GDPR)" : "Protection des données (RGPD)"} :</strong>{" "}
            {language === "nl" 
              ? "Uw persoonlijke gegevens worden verwerkt in overeenstemming met de Europese GDPR-wetgeving. U heeft recht op toegang, rectificatie en verwijdering van uw gegevens. Neem contact met ons op via contact@autora.be voor elke aanvraag."
              : "Vos données personnelles sont traitées conformément au règlement européen RGPD. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contactez-nous à contact@autora.be pour toute demande."
            }
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500 text-center md:text-left">
            <p>© {currentYear} Autora. {language === "nl" ? "Alle rechten voorbehouden." : "Tous droits réservés."}</p>
            <p className="mt-1">
              {language === "nl" 
                ? "Gemaakt met ❤️ in België"
                : "Fait avec ❤️ en Belgique"
              }
            </p>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center gap-1 text-sm bg-gray-800/50 rounded-full px-2 py-1">
            {(["fr", "nl", "de", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  language === lang 
                    ? "bg-primary text-white font-semibold" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
                aria-label={`Change language to ${lang.toUpperCase()}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
