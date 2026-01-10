import { useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { HelpCircle, Search, X, User, ShoppingCart, Car, Shield, CreditCard, Link2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t, language } = useLanguage();

  const categories = [
    { id: "compte", label: t("faq.account"), icon: User },
    { id: "achat", label: t("faq.purchase"), icon: ShoppingCart },
    { id: "vente", label: t("faq.sale"), icon: Car },
    { id: "securite", label: t("faq.security"), icon: Shield },
    { id: "paiement", label: t("faq.payment"), icon: CreditCard },
  ];

  const faqsByLang = {
    fr: [
      { id: "car-pass", question: "Qu'est-ce que le Car-Pass ?", answer: "Le Car-Pass est un document officiel belge qui retrace l'historique kilométrique d'un véhicule. Il permet de vérifier que le compteur n'a pas été manipulé et garantit la transparence lors de l'achat d'une voiture d'occasion.", category: "achat" },
      { id: "verification-lez", question: "Comment fonctionne la vérification LEZ ?", answer: "Nous vérifions automatiquement la conformité de chaque véhicule aux zones de basses émissions (LEZ) de Bruxelles, Anvers et Gand. Les véhicules conformes Euro 6 ou supérieur peuvent circuler librement dans ces zones.", category: "achat" },
      { id: "vendre-voiture", question: "Comment puis-je vendre ma voiture sur AutoRa ?", answer: "C'est simple ! Créez un compte, cliquez sur 'Vendre', remplissez les informations de votre véhicule avec photos et description, puis soumettez votre annonce. Notre équipe la vérifiera avant publication.", category: "vente" },
      { id: "annonces-gratuites", question: "Les annonces sont-elles gratuites ?", answer: "Oui, la publication d'annonces est entièrement gratuite pour les particuliers. Nous croyons en un accès démocratique au marché automobile belge.", category: "vente" },
      { id: "contacter-vendeur", question: "Comment contacter un vendeur ?", answer: "Une fois connecté, vous pouvez envoyer un message directement au vendeur via notre système de messagerie intégré. Vos conversations sont sécurisées et restent privées.", category: "achat" },
      { id: "detecter-fraude", question: "Que faire si je détecte une fraude ?", answer: "Signalez immédiatement l'annonce suspecte via le bouton de signalement. Notre équipe examine chaque signalement sous 24h et prend les mesures nécessaires pour protéger notre communauté.", category: "securite" },
      { id: "creer-compte", question: "Comment créer un compte sur AutoRa ?", answer: "Cliquez sur 'Connexion' en haut à droite, puis sur 'Créer un compte'. Remplissez vos informations et validez votre email. Vous pouvez aussi vous connecter avec Google.", category: "compte" },
      { id: "modifier-annonce", question: "Puis-je modifier mon annonce après publication ?", answer: "Oui, vous pouvez modifier votre annonce à tout moment depuis votre espace personnel. Les modifications seront visibles immédiatement après validation.", category: "vente" },
      { id: "documents-vente", question: "Quels documents dois-je fournir pour vendre ?", answer: "Vous aurez besoin du Car-Pass, de la carte grise, du contrôle technique en cours de validité et des photos de qualité de votre véhicule.", category: "vente" },
      { id: "financement", question: "AutoRa propose-t-il un service de financement ?", answer: "Nous travaillons avec des partenaires financiers pour vous proposer des solutions de crédit adaptées. Contactez-nous pour plus d'informations sur les options de financement disponibles.", category: "paiement" },
      { id: "modifier-mot-de-passe", question: "Comment modifier mon mot de passe ?", answer: "Connectez-vous à votre compte, accédez aux paramètres de profil et cliquez sur 'Modifier le mot de passe'. Vous recevrez un email de confirmation.", category: "compte" },
      { id: "protection-donnees", question: "Mes données personnelles sont-elles protégées ?", answer: "Oui, nous prenons la protection de vos données très au sérieux. Toutes les informations sont cryptées et stockées de manière sécurisée conformément au RGPD.", category: "securite" }
    ],
    nl: [
      { id: "car-pass", question: "Wat is de Car-Pass?", answer: "De Car-Pass is een officieel Belgisch document dat de kilometergeschiedenis van een voertuig bijhoudt. Het maakt het mogelijk om te controleren of de teller niet is gemanipuleerd en garandeert transparantie bij de aankoop van een tweedehands auto.", category: "achat" },
      { id: "verification-lez", question: "Hoe werkt de LEZ-verificatie?", answer: "We controleren automatisch de conformiteit van elk voertuig met de lage-emissiezones (LEZ) van Brussel, Antwerpen en Gent. Voertuigen die voldoen aan Euro 6 of hoger mogen vrij rijden in deze zones.", category: "achat" },
      { id: "vendre-voiture", question: "Hoe kan ik mijn auto verkopen op AutoRa?", answer: "Het is eenvoudig! Maak een account aan, klik op 'Verkopen', vul de informatie van uw voertuig in met foto's en beschrijving, en dien uw advertentie in. Ons team zal deze controleren voor publicatie.", category: "vente" },
      { id: "annonces-gratuites", question: "Zijn advertenties gratis?", answer: "Ja, het plaatsen van advertenties is volledig gratis voor particulieren. Wij geloven in democratische toegang tot de Belgische automarkt.", category: "vente" },
      { id: "contacter-vendeur", question: "Hoe contacteer ik een verkoper?", answer: "Eenmaal ingelogd, kunt u rechtstreeks een bericht sturen naar de verkoper via ons geïntegreerde berichtensysteem. Uw gesprekken zijn beveiligd en blijven privé.", category: "achat" },
      { id: "detecter-fraude", question: "Wat te doen als ik fraude detecteer?", answer: "Meld de verdachte advertentie onmiddellijk via de meldknop. Ons team onderzoekt elke melding binnen 24 uur en neemt de nodige maatregelen om onze gemeenschap te beschermen.", category: "securite" },
      { id: "creer-compte", question: "Hoe maak ik een account aan op AutoRa?", answer: "Klik op 'Inloggen' rechtsboven, dan op 'Account aanmaken'. Vul uw gegevens in en valideer uw email. U kunt ook inloggen met Google.", category: "compte" },
      { id: "modifier-annonce", question: "Kan ik mijn advertentie wijzigen na publicatie?", answer: "Ja, u kunt uw advertentie op elk moment wijzigen vanuit uw persoonlijke ruimte. Wijzigingen zijn direct zichtbaar na validatie.", category: "vente" },
      { id: "documents-vente", question: "Welke documenten heb ik nodig om te verkopen?", answer: "U heeft de Car-Pass, het kentekenbewijs, een geldig technisch keuringsrapport en kwaliteitsfoto's van uw voertuig nodig.", category: "vente" },
      { id: "financement", question: "Biedt AutoRa financieringsservices aan?", answer: "Wij werken samen met financiële partners om u aangepaste kredietoplossingen aan te bieden. Neem contact met ons op voor meer informatie over beschikbare financieringsopties.", category: "paiement" },
      { id: "modifier-mot-de-passe", question: "Hoe wijzig ik mijn wachtwoord?", answer: "Log in op uw account, ga naar profielinstellingen en klik op 'Wachtwoord wijzigen'. U ontvangt een bevestigingsemail.", category: "compte" },
      { id: "protection-donnees", question: "Zijn mijn persoonlijke gegevens beschermd?", answer: "Ja, wij nemen de bescherming van uw gegevens zeer serieus. Alle informatie wordt versleuteld en veilig opgeslagen in overeenstemming met de GDPR.", category: "securite" }
    ],
    en: [
      { id: "car-pass", question: "What is the Car-Pass?", answer: "The Car-Pass is an official Belgian document that tracks a vehicle's mileage history. It allows you to verify that the odometer has not been tampered with and guarantees transparency when buying a used car.", category: "achat" },
      { id: "verification-lez", question: "How does LEZ verification work?", answer: "We automatically verify each vehicle's compliance with the Low Emission Zones (LEZ) of Brussels, Antwerp, and Ghent. Vehicles meeting Euro 6 or higher standards can drive freely in these zones.", category: "achat" },
      { id: "vendre-voiture", question: "How can I sell my car on AutoRa?", answer: "It's simple! Create an account, click 'Sell', fill in your vehicle information with photos and description, then submit your listing. Our team will review it before publication.", category: "vente" },
      { id: "annonces-gratuites", question: "Are listings free?", answer: "Yes, posting listings is completely free for private individuals. We believe in democratic access to the Belgian car market.", category: "vente" },
      { id: "contacter-vendeur", question: "How do I contact a seller?", answer: "Once logged in, you can send a message directly to the seller through our integrated messaging system. Your conversations are secure and remain private.", category: "achat" },
      { id: "detecter-fraude", question: "What should I do if I detect fraud?", answer: "Report the suspicious listing immediately via the report button. Our team reviews each report within 24 hours and takes necessary measures to protect our community.", category: "securite" },
      { id: "creer-compte", question: "How do I create an account on AutoRa?", answer: "Click 'Login' in the top right, then 'Create account'. Fill in your information and validate your email. You can also sign in with Google.", category: "compte" },
      { id: "modifier-annonce", question: "Can I edit my listing after publication?", answer: "Yes, you can edit your listing at any time from your personal space. Changes will be visible immediately after validation.", category: "vente" },
      { id: "documents-vente", question: "What documents do I need to sell?", answer: "You will need the Car-Pass, registration certificate, valid technical inspection report, and quality photos of your vehicle.", category: "vente" },
      { id: "financement", question: "Does AutoRa offer financing services?", answer: "We work with financial partners to offer you adapted credit solutions. Contact us for more information on available financing options.", category: "paiement" },
      { id: "modifier-mot-de-passe", question: "How do I change my password?", answer: "Log in to your account, go to profile settings, and click 'Change password'. You will receive a confirmation email.", category: "compte" },
      { id: "protection-donnees", question: "Is my personal data protected?", answer: "Yes, we take the protection of your data very seriously. All information is encrypted and stored securely in accordance with GDPR.", category: "securite" }
    ]
  };

  const faqs = faqsByLang[language] || faqsByLang.fr;

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyFaqLink = useCallback((faqId: string) => {
    const url = `${window.location.origin}/faq#${faqId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(faqId);
      toast.success(t("faq.linkCopied"));
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, [t]);

  const highlightText = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }, []);

  const filteredFaqs = useMemo(() => {
    let results = faqs;
    
    if (activeCategory) {
      results = results.filter(faq => faq.category === activeCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
      );
    }
    
    return results;
  }, [searchQuery, activeCategory, faqs]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={language === "nl" ? "Veelgestelde vragen" : "Questions fréquentes"}
        description={language === "nl" 
          ? "Vind snel antwoorden op uw vragen over AutoRa, de Car-Pass, LEZ-zones en meer."
          : "Trouvez rapidement les réponses à vos questions sur AutoRa, le Car-Pass, les zones LEZ et bien plus encore."
        }
        url="https://autora.be/faq"
      />
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              {t("faq.helpCenter")}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t("faq.title").split(" ").slice(0, -1).join(" ")} <span className="gradient-text">{t("faq.title").split(" ").slice(-1)}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t("faq.subtitle")}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("faq.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-6 text-base rounded-xl bg-card border-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {t("faq.all")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            {/* Results counter */}
            {(searchQuery || activeCategory) && (
              <div className="mb-6 text-center">
                <span className="text-sm text-muted-foreground">
                  {filteredFaqs.length === 0 
                    ? t("faq.noResult")
                    : filteredFaqs.length === 1 
                      ? `1 ${t("faq.resultFor")}`
                      : `${filteredFaqs.length} ${t("faq.resultsFor")}`}
                  {searchQuery && (
                    <>
                      {` ${t("faq.for")} `}
                      <span className="font-medium text-foreground">"{searchQuery}"</span>
                    </>
                  )}
                  {activeCategory && (
                    <>
                      {` ${t("faq.in")} `}
                      <span className="font-medium text-foreground">
                        {categories.find(c => c.id === activeCategory)?.label}
                      </span>
                    </>
                  )}
                </span>
              </div>
            )}
            
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t("faq.noResults")}
                </p>
              </div>
            ) : (
              <Accordion 
                key={`${activeCategory}-${searchQuery}`}
                type="single" 
                collapsible 
                className="space-y-4"
              >
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem 
                    key={faq.id}
                    id={faq.id}
                    value={faq.id}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow animate-fade-in"
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary py-5">
                      <div className="flex items-start gap-3 w-full pr-4">
                        <span className="flex-1">{highlightText(faq.question, searchQuery)}</span>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {categories.find(c => c.id === faq.category)?.label}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex-1">{highlightText(faq.answer, searchQuery)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyFaqLink(faq.id);
                          }}
                          className="shrink-0 p-2 rounded-lg hover:bg-muted transition-colors"
                          aria-label="Copy link"
                        >
                          {copiedId === faq.id ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Link2 className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-card border-y border-border">
          <div className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                {t("faq.notFound")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("faq.notFoundDesc")}
              </p>
              <a 
                href="mailto:contact@autora.be" 
                className="btn-primary-gradient inline-flex items-center gap-2"
              >
                {t("faq.contactUs")}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;