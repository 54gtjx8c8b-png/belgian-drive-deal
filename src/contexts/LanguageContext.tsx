import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "fr" | "nl" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
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
    "hero.title": "Trouvez votre prochaine voiture en Belgique",
    "hero.subtitle": "La plateforme transparente pour acheter et vendre des véhicules d'occasion",
    "hero.search": "Rechercher",
    "filters.brand": "Marque",
    "filters.model": "Modèle",
    "filters.budget": "Budget",
    "filters.year": "Année",
    "filters.mileage": "Kilométrage",
    "filters.fuel": "Carburant",
    "filters.transmission": "Transmission",
    "filters.reset": "Réinitialiser",
    "car.year": "Année",
    "car.km": "km",
    "car.contact": "Contacter le vendeur",
    "car.sendMessage": "Envoyer un message",
    "logout.success": "Déconnexion",
    "logout.description": "Vous avez été déconnecté avec succès",
  },
  nl: {
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
    "hero.title": "Vind uw volgende auto in België",
    "hero.subtitle": "Het transparante platform om tweedehands voertuigen te kopen en verkopen",
    "hero.search": "Zoeken",
    "filters.brand": "Merk",
    "filters.model": "Model",
    "filters.budget": "Budget",
    "filters.year": "Jaar",
    "filters.mileage": "Kilometerstand",
    "filters.fuel": "Brandstof",
    "filters.transmission": "Transmissie",
    "filters.reset": "Reset",
    "car.year": "Jaar",
    "car.km": "km",
    "car.contact": "Contacteer verkoper",
    "car.sendMessage": "Stuur een bericht",
    "logout.success": "Uitloggen",
    "logout.description": "U bent succesvol uitgelogd",
  },
  en: {
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
    "hero.title": "Find your next car in Belgium",
    "hero.subtitle": "The transparent platform to buy and sell used vehicles",
    "hero.search": "Search",
    "filters.brand": "Brand",
    "filters.model": "Model",
    "filters.budget": "Budget",
    "filters.year": "Year",
    "filters.mileage": "Mileage",
    "filters.fuel": "Fuel",
    "filters.transmission": "Transmission",
    "filters.reset": "Reset",
    "car.year": "Year",
    "car.km": "km",
    "car.contact": "Contact seller",
    "car.sendMessage": "Send a message",
    "logout.success": "Logged out",
    "logout.description": "You have been logged out successfully",
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
