import { useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCircle, Search, X, User, ShoppingCart, Car, Shield, CreditCard, Link2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: "compte", label: "Compte", icon: User },
    { id: "achat", label: "Achat", icon: ShoppingCart },
    { id: "vente", label: "Vente", icon: Car },
    { id: "securite", label: "Sécurité", icon: Shield },
    { id: "paiement", label: "Paiement", icon: CreditCard },
  ];
  
  const faqs = [
    {
      id: "car-pass",
      question: "Qu'est-ce que le Car-Pass ?",
      answer: "Le Car-Pass est un document officiel belge qui retrace l'historique kilométrique d'un véhicule. Il permet de vérifier que le compteur n'a pas été manipulé et garantit la transparence lors de l'achat d'une voiture d'occasion.",
      category: "achat"
    },
    {
      id: "verification-lez",
      question: "Comment fonctionne la vérification LEZ ?",
      answer: "Nous vérifions automatiquement la conformité de chaque véhicule aux zones de basses émissions (LEZ) de Bruxelles, Anvers et Gand. Les véhicules conformes Euro 6 ou supérieur peuvent circuler librement dans ces zones.",
      category: "achat"
    },
    {
      id: "vendre-voiture",
      question: "Comment puis-je vendre ma voiture sur AutoRa ?",
      answer: "C'est simple ! Créez un compte, cliquez sur 'Vendre', remplissez les informations de votre véhicule avec photos et description, puis soumettez votre annonce. Notre équipe la vérifiera avant publication.",
      category: "vente"
    },
    {
      id: "annonces-gratuites",
      question: "Les annonces sont-elles gratuites ?",
      answer: "Oui, la publication d'annonces est entièrement gratuite pour les particuliers. Nous croyons en un accès démocratique au marché automobile belge.",
      category: "vente"
    },
    {
      id: "contacter-vendeur",
      question: "Comment contacter un vendeur ?",
      answer: "Une fois connecté, vous pouvez envoyer un message directement au vendeur via notre système de messagerie intégré. Vos conversations sont sécurisées et restent privées.",
      category: "achat"
    },
    {
      id: "detecter-fraude",
      question: "Que faire si je détecte une fraude ?",
      answer: "Signalez immédiatement l'annonce suspecte via le bouton de signalement. Notre équipe examine chaque signalement sous 24h et prend les mesures nécessaires pour protéger notre communauté.",
      category: "securite"
    },
    {
      id: "creer-compte",
      question: "Comment créer un compte sur AutoRa ?",
      answer: "Cliquez sur 'Connexion' en haut à droite, puis sur 'Créer un compte'. Remplissez vos informations et validez votre email. Vous pouvez aussi vous connecter avec Google.",
      category: "compte"
    },
    {
      id: "modifier-annonce",
      question: "Puis-je modifier mon annonce après publication ?",
      answer: "Oui, vous pouvez modifier votre annonce à tout moment depuis votre espace personnel. Les modifications seront visibles immédiatement après validation.",
      category: "vente"
    },
    {
      id: "documents-vente",
      question: "Quels documents dois-je fournir pour vendre ?",
      answer: "Vous aurez besoin du Car-Pass, de la carte grise, du contrôle technique en cours de validité et des photos de qualité de votre véhicule.",
      category: "vente"
    },
    {
      id: "financement",
      question: "AutoRa propose-t-il un service de financement ?",
      answer: "Nous travaillons avec des partenaires financiers pour vous proposer des solutions de crédit adaptées. Contactez-nous pour plus d'informations sur les options de financement disponibles.",
      category: "paiement"
    },
    {
      id: "modifier-mot-de-passe",
      question: "Comment modifier mon mot de passe ?",
      answer: "Connectez-vous à votre compte, accédez aux paramètres de profil et cliquez sur 'Modifier le mot de passe'. Vous recevrez un email de confirmation.",
      category: "compte"
    },
    {
      id: "protection-donnees",
      question: "Mes données personnelles sont-elles protégées ?",
      answer: "Oui, nous prenons la protection de vos données très au sérieux. Toutes les informations sont cryptées et stockées de manière sécurisée conformément au RGPD.",
      category: "securite"
    }
  ];

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyFaqLink = useCallback((faqId: string) => {
    const url = `${window.location.origin}/faq#${faqId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(faqId);
      toast.success("Lien copié !");
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  // Function to highlight matching text
  const highlightText = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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
    
    // Filter by category
    if (activeCategory) {
      results = results.filter(faq => faq.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
      );
    }
    
    return results;
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Centre d'aide
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Questions <span className="gradient-text">fréquentes</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Trouvez rapidement les réponses à vos questions sur AutoRa, 
              le Car-Pass, les zones LEZ et bien plus encore.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-6 text-base rounded-xl bg-card border-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
                  aria-label="Effacer la recherche"
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
                Toutes
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
                    ? "Aucun résultat" 
                    : filteredFaqs.length === 1 
                      ? "1 résultat trouvé" 
                      : `${filteredFaqs.length} résultats trouvés`}
                  {searchQuery && (
                    <>
                      {" pour "}
                      <span className="font-medium text-foreground">"{searchQuery}"</span>
                    </>
                  )}
                  {activeCategory && (
                    <>
                      {" dans "}
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
                  Aucune question ne correspond à votre recherche.
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
                          aria-label="Copier le lien"
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
                Vous n'avez pas trouvé votre réponse ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Notre équipe est là pour vous aider. Contactez-nous par email à contact@autora.be
              </p>
              <a 
                href="mailto:contact@autora.be" 
                className="btn-primary-gradient inline-flex items-center gap-2"
              >
                Nous contacter
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