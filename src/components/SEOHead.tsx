import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

const SEOHead = ({
  title,
  description,
  image = "https://autora.be/og-image.jpg",
  url,
  type = "website",
  noIndex = false,
}: SEOHeadProps) => {
  const { language } = useLanguage();

  const defaultTitle = language === "nl" 
    ? "AutoRa | Vind uw volgende auto in België"
    : "AutoRa | Trouvez votre prochaine voiture en Belgique";

  const defaultDescription = language === "nl"
    ? "AutoRa - De betrouwbare Belgische automarkt. Vind duizenden geverifieerde voertuigen met Car-Pass en gegarandeerde LEZ-compatibiliteit."
    : "AutoRa - La marketplace automobile belge de confiance. Trouvez des milliers de véhicules vérifiés avec Car-Pass et compatibilité LEZ garantie.";

  const fullTitle = title ? `${title} | AutoRa` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const canonicalUrl = url || "https://autora.be";

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="AutoRa" />
      <meta property="og:locale" content={language === "nl" ? "nl_BE" : "fr_BE"} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate languages */}
      <link rel="alternate" hrefLang="fr" href={`${canonicalUrl}?lang=fr`} />
      <link rel="alternate" hrefLang="nl" href={`${canonicalUrl}?lang=nl`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEOHead;
