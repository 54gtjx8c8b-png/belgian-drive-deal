import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const faqs = [
    {
      question: "Qu'est-ce que le Car-Pass ?",
      answer: "Le Car-Pass est un document officiel belge qui retrace l'historique kilométrique d'un véhicule. Il permet de vérifier que le compteur n'a pas été manipulé et garantit la transparence lors de l'achat d'une voiture d'occasion."
    },
    {
      question: "Comment fonctionne la vérification LEZ ?",
      answer: "Nous vérifions automatiquement la conformité de chaque véhicule aux zones de basses émissions (LEZ) de Bruxelles, Anvers et Gand. Les véhicules conformes Euro 6 ou supérieur peuvent circuler librement dans ces zones."
    },
    {
      question: "Comment puis-je vendre ma voiture sur AutoRa ?",
      answer: "C'est simple ! Créez un compte, cliquez sur 'Vendre', remplissez les informations de votre véhicule avec photos et description, puis soumettez votre annonce. Notre équipe la vérifiera avant publication."
    },
    {
      question: "Les annonces sont-elles gratuites ?",
      answer: "Oui, la publication d'annonces est entièrement gratuite pour les particuliers. Nous croyons en un accès démocratique au marché automobile belge."
    },
    {
      question: "Comment contacter un vendeur ?",
      answer: "Une fois connecté, vous pouvez envoyer un message directement au vendeur via notre système de messagerie intégré. Vos conversations sont sécurisées et restent privées."
    },
    {
      question: "Que faire si je détecte une fraude ?",
      answer: "Signalez immédiatement l'annonce suspecte via le bouton de signalement. Notre équipe examine chaque signalement sous 24h et prend les mesures nécessaires pour protéger notre communauté."
    },
    {
      question: "Comment créer un compte sur AutoRa ?",
      answer: "Cliquez sur 'Connexion' en haut à droite, puis sur 'Créer un compte'. Remplissez vos informations et validez votre email. Vous pouvez aussi vous connecter avec Google."
    },
    {
      question: "Puis-je modifier mon annonce après publication ?",
      answer: "Oui, vous pouvez modifier votre annonce à tout moment depuis votre espace personnel. Les modifications seront visibles immédiatement après validation."
    },
    {
      question: "Quels documents dois-je fournir pour vendre ?",
      answer: "Vous aurez besoin du Car-Pass, de la carte grise, du contrôle technique en cours de validité et des photos de qualité de votre véhicule."
    },
    {
      question: "AutoRa propose-t-il un service de financement ?",
      answer: "Nous travaillons avec des partenaires financiers pour vous proposer des solutions de crédit adaptées. Contactez-nous pour plus d'informations sur les options de financement disponibles."
    }
  ];

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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
                className="pl-12 py-6 text-base rounded-xl bg-card border-border"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune question ne correspond à votre recherche.
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow animate-fade-up"
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
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