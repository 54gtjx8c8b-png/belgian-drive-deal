import { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "nl" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.buy": "Acheter",
    "nav.sell": "Vendre",
    "nav.favorites": "Favoris",
    "nav.compare": "Comparer",
    "nav.messages": "Messages",
    "nav.dashboard": "Dashboard",
    "nav.settings": "Paramètres",
    "nav.faq": "FAQ",
    "nav.login": "Connexion",
    "nav.logout": "Déconnexion",
    "theme.light": "Mode clair",
    "theme.dark": "Mode sombre",
    "logout.success": "Déconnexion",
    "logout.description": "Vous avez été déconnecté avec succès",
    
    // Hero
    "hero.badge": "Marché automobile belge",
    "hero.title1": "Trouvez votre prochaine",
    "hero.title2": "voiture en Belgique",
    "hero.subtitle": "Des milliers de véhicules vérifiés, avec Car-Pass et compatibilité LEZ garantie",
    "hero.search": "Rechercher",
    "hero.vehicles": "Véhicules",
    "hero.verified": "Car-Pass vérifié",
    "hero.brands": "Marques",
    
    // Filters
    "filters.title": "Filtres",
    "filters.vehicles": "véhicules",
    "filters.brand": "Marque",
    "filters.allBrands": "Toutes les marques",
    "filters.model": "Modèle",
    "filters.budget": "Budget",
    "filters.year": "Année",
    "filters.mileage": "Kilométrage",
    "filters.fuel": "Carburant",
    "filters.transmission": "Boîte de vitesse",
    "filters.euroNorm": "Norme Euro (LEZ)",
    "filters.lezOnly": "Compatible LEZ uniquement",
    "filters.reset": "Réinitialiser les filtres",
    "filters.gasoline": "Essence",
    "filters.diesel": "Diesel",
    "filters.hybrid": "Hybride",
    "filters.electric": "Électrique",
    "filters.manual": "Manuelle",
    "filters.automatic": "Automatique",
    
    // Car Card
    "car.addCompare": "Ajouter au comparateur",
    "car.removeCompare": "Retirer du comparateur",
    "car.addedCompare": "Ajouté au comparateur",
    "car.removedCompare": "Retiré du comparateur",
    "car.maxCompare": "Maximum 3 véhicules dans le comparateur",
    
    // Footer
    "footer.description": "La marketplace automobile belge de confiance. Tous nos véhicules sont vérifiés avec Car-Pass.",
    "footer.navigation": "Navigation",
    "footer.buyCar": "Acheter une voiture",
    "footer.sellCar": "Vendre ma voiture",
    "footer.estimate": "Estimer mon véhicule",
    "footer.lezGuide": "Guide LEZ Belgique",
    "footer.info": "Informations",
    "footer.about": "À propos de nous",
    "footer.carpass": "Car-Pass Belgique",
    "footer.terms": "Conditions générales",
    "footer.privacy": "Politique de confidentialité",
    "footer.contact": "Contact",
    "footer.rights": "Tous droits réservés.",
    "footer.madeWith": "Fait avec ❤️ en Belgique",
  },
  nl: {
    // Navigation
    "nav.buy": "Kopen",
    "nav.sell": "Verkopen",
    "nav.favorites": "Favorieten",
    "nav.compare": "Vergelijken",
    "nav.messages": "Berichten",
    "nav.dashboard": "Dashboard",
    "nav.settings": "Instellingen",
    "nav.faq": "FAQ",
    "nav.login": "Inloggen",
    "nav.logout": "Uitloggen",
    "theme.light": "Lichte modus",
    "theme.dark": "Donkere modus",
    "logout.success": "Uitloggen",
    "logout.description": "U bent succesvol uitgelogd",
    
    // Hero
    "hero.badge": "Belgische automarkt",
    "hero.title1": "Vind uw volgende",
    "hero.title2": "auto in België",
    "hero.subtitle": "Duizenden geverifieerde voertuigen, met Car-Pass en gegarandeerde LEZ-compatibiliteit",
    "hero.search": "Zoeken",
    "hero.vehicles": "Voertuigen",
    "hero.verified": "Car-Pass geverifieerd",
    "hero.brands": "Merken",
    
    // Filters
    "filters.title": "Filters",
    "filters.vehicles": "voertuigen",
    "filters.brand": "Merk",
    "filters.allBrands": "Alle merken",
    "filters.model": "Model",
    "filters.budget": "Budget",
    "filters.year": "Jaar",
    "filters.mileage": "Kilometerstand",
    "filters.fuel": "Brandstof",
    "filters.transmission": "Transmissie",
    "filters.euroNorm": "Euronorm (LEZ)",
    "filters.lezOnly": "Alleen LEZ-compatibel",
    "filters.reset": "Filters resetten",
    "filters.gasoline": "Benzine",
    "filters.diesel": "Diesel",
    "filters.hybrid": "Hybride",
    "filters.electric": "Elektrisch",
    "filters.manual": "Manueel",
    "filters.automatic": "Automatisch",
    
    // Car Card
    "car.addCompare": "Toevoegen aan vergelijker",
    "car.removeCompare": "Verwijderen uit vergelijker",
    "car.addedCompare": "Toegevoegd aan vergelijker",
    "car.removedCompare": "Verwijderd uit vergelijker",
    "car.maxCompare": "Maximum 3 voertuigen in vergelijker",
    
    // Footer
    "footer.description": "De betrouwbare Belgische automarktplaats. Al onze voertuigen zijn geverifieerd met Car-Pass.",
    "footer.navigation": "Navigatie",
    "footer.buyCar": "Een auto kopen",
    "footer.sellCar": "Mijn auto verkopen",
    "footer.estimate": "Mijn voertuig schatten",
    "footer.lezGuide": "LEZ-gids België",
    "footer.info": "Informatie",
    "footer.about": "Over ons",
    "footer.carpass": "Car-Pass België",
    "footer.terms": "Algemene voorwaarden",
    "footer.privacy": "Privacybeleid",
    "footer.contact": "Contact",
    "footer.rights": "Alle rechten voorbehouden.",
    "footer.madeWith": "Gemaakt met ❤️ in België",
  },
  en: {
    // Navigation
    "nav.buy": "Buy",
    "nav.sell": "Sell",
    "nav.favorites": "Favorites",
    "nav.compare": "Compare",
    "nav.messages": "Messages",
    "nav.dashboard": "Dashboard",
    "nav.settings": "Settings",
    "nav.faq": "FAQ",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "theme.light": "Light mode",
    "theme.dark": "Dark mode",
    "logout.success": "Logged out",
    "logout.description": "You have been logged out successfully",
    
    // Hero
    "hero.badge": "Belgian car market",
    "hero.title1": "Find your next",
    "hero.title2": "car in Belgium",
    "hero.subtitle": "Thousands of verified vehicles, with Car-Pass and guaranteed LEZ compatibility",
    "hero.search": "Search",
    "hero.vehicles": "Vehicles",
    "hero.verified": "Car-Pass verified",
    "hero.brands": "Brands",
    
    // Filters
    "filters.title": "Filters",
    "filters.vehicles": "vehicles",
    "filters.brand": "Brand",
    "filters.allBrands": "All brands",
    "filters.model": "Model",
    "filters.budget": "Budget",
    "filters.year": "Year",
    "filters.mileage": "Mileage",
    "filters.fuel": "Fuel",
    "filters.transmission": "Transmission",
    "filters.euroNorm": "Euro Standard (LEZ)",
    "filters.lezOnly": "LEZ compatible only",
    "filters.reset": "Reset filters",
    "filters.gasoline": "Gasoline",
    "filters.diesel": "Diesel",
    "filters.hybrid": "Hybrid",
    "filters.electric": "Electric",
    "filters.manual": "Manual",
    "filters.automatic": "Automatic",
    
    // Car Card
    "car.addCompare": "Add to compare",
    "car.removeCompare": "Remove from compare",
    "car.addedCompare": "Added to compare",
    "car.removedCompare": "Removed from compare",
    "car.maxCompare": "Maximum 3 vehicles in compare",
    
    // Footer
    "footer.description": "The trusted Belgian car marketplace. All our vehicles are verified with Car-Pass.",
    "footer.navigation": "Navigation",
    "footer.buyCar": "Buy a car",
    "footer.sellCar": "Sell my car",
    "footer.estimate": "Estimate my vehicle",
    "footer.lezGuide": "LEZ Guide Belgium",
    "footer.info": "Information",
    "footer.about": "About us",
    "footer.carpass": "Car-Pass Belgium",
    "footer.terms": "Terms & Conditions",
    "footer.privacy": "Privacy Policy",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.madeWith": "Made with ❤️ in Belgium",
  },
};

const languageLabels: Record<Language, string> = {
  fr: "FR",
  nl: "NL",
  en: "EN",
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "fr";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const getLanguageLabel = (lang: Language) => languageLabels[lang];
