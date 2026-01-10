import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics tracking ID placeholder
// To enable, add your GA4 Measurement ID as VITE_GA_MEASUREMENT_ID in .env
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.log("Google Analytics: No measurement ID configured");
    return;
  }

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
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  
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
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

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

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default Analytics;
