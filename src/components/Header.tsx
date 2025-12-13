import { Car, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Auto<span className="gradient-text">Belgica</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Acheter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Vendre
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Mon Garage
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors font-medium">FR</button>
              <span>/</span>
              <button className="hover:text-foreground transition-colors">NL</button>
              <span>/</span>
              <button className="hover:text-foreground transition-colors">EN</button>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              <User className="w-4 h-4 mr-2" />
              Connexion
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border animate-fade-up">
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-foreground font-medium py-2">Acheter</a>
              <a href="#" className="text-foreground font-medium py-2">Vendre</a>
              <a href="#" className="text-foreground font-medium py-2">Mon Garage</a>
              <div className="flex items-center gap-4 py-2">
                <button className="text-foreground font-medium">FR</button>
                <button className="text-muted-foreground">NL</button>
                <button className="text-muted-foreground">EN</button>
              </div>
              <Button className="w-full rounded-xl">
                <User className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
