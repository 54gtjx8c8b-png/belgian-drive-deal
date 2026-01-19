import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics tracking ID placeholder
// To enable, add your GA4 Measurement ID as VITE_GA_MEASUREMENT_ID in .env
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const STORAGE_KEY = "autora_cookie_preferences";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Check if analytics cookies are allowed
const isAnalyticsAllowed = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const prefs = JSON.parse(stored);
    return prefs.consented && prefs.analytics;
  } catch {
    return false;
  }
};

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.log("Google Analytics: No measurement ID configured");
    return;
  }

  // Only init if user consented to analytics
  if (!isAnalyticsAllowed()) {
    console.log("Google Analytics: User has not consented to analytics cookies");
    return;
  }

  // Prevent double initialization
  if (window.gtag) return;

  // Add gtag script
  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true, // GDPR compliance
    cookie_flags: "SameSite=None;Secure",
  });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag || !isAnalyticsAllowed()) return;
  
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!GA_MEASUREMENT_ID || !window.gtag || !isAnalyticsAllowed()) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track car view
export const trackCarView = (carId: string, brand: string, model: string) => {
  trackEvent("view_item", "car", `${brand} ${model}`, undefined);
};

// Track search
export const trackSearch = (searchTerm: string) => {
  trackEvent("search", "cars", searchTerm);
};

// Track filter usage
export const trackFilterUsage = (filterType: string, filterValue: string) => {
  trackEvent("filter", filterType, filterValue);
};

// Track contact seller
export const trackContactSeller = (carId: string, method: string) => {
  trackEvent("contact_seller", method, carId);
};

// Analytics component for automatic page tracking
const Analytics = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  // Listen for consent changes
  useEffect(() => {
    const checkConsent = () => {
      if (isAnalyticsAllowed() && !initialized) {
        initGA();
        setInitialized(true);
      }
    };
    
    // Check on mount
    checkConsent();
    
    // Listen for storage changes (consent updates)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        checkConsent();
      }
    };
    
    window.addEventListener("storage", handleStorage);
    
    // Also check periodically for same-tab changes
    const interval = setInterval(checkConsent, 1000);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [initialized]);

  useEffect(() => {
    if (initialized) {
      trackPageView(location.pathname + location.search);
    }
  }, [location, initialized]);

  return null;
};

export default Analytics;
