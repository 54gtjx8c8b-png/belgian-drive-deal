import { Menu, User, LogOut, Heart, MessageCircle, HelpCircle, GitCompareArrows, LayoutDashboard, Settings } from "lucide-react";
import autoraLogo from "@/assets/autora-logo.png";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useCompareContext } from "@/contexts/CompareContext";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { unreadCount, hasUnread } = useUnreadMessages();
  const { compareCount } = useCompareContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass-panel border-b border-border/50 shadow-lg backdrop-blur-xl py-2" 
          : "bg-transparent border-b border-transparent py-4"
      }`}
    >
      <div className={`container mx-auto px-6 transition-all duration-300 ${scrolled ? "py-2" : "py-0"}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={autoraLogo} 
              alt="AutoRa Logo" 
              className={`rounded-xl object-cover transition-all duration-300 group-hover:scale-105 ${
                scrolled ? "w-8 h-8" : "w-10 h-10"
              }`}
            />
            <span className={`font-display font-bold text-foreground transition-all duration-300 ${
              scrolled ? "text-lg" : "text-xl"
            }`}>
              Auto<span className="gradient-text">Ra</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`relative font-medium transition-colors ${
                location.pathname === "/" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Acheter
              {location.pathname === "/" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            <Link 
              to="/sell" 
              className={`relative font-medium transition-colors ${
                location.pathname === "/sell" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Vendre
              {location.pathname === "/sell" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            <Link 
              to="/favorites" 
              className={`relative font-medium flex items-center gap-1 transition-colors ${
                location.pathname === "/favorites" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="w-4 h-4" />
              Favoris
              {location.pathname === "/favorites" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            <Link 
              to="/compare" 
              className={`relative font-medium flex items-center gap-1 transition-colors ${
                location.pathname === "/compare" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitCompareArrows className="w-4 h-4" />
              Comparer
              {location.pathname === "/compare" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold px-1">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link 
              to="/faq" 
              className={`relative font-medium flex items-center gap-1 transition-colors ${
                location.pathname === "/faq" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
              {location.pathname === "/faq" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            {user && (
              <Link 
                to="/messages" 
                className={`relative font-medium flex items-center gap-1 transition-colors ${
                  location.pathname === "/messages" 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Messages
                {location.pathname === "/messages" && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
                {hasUnread && (
                  <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
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
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/dashboard" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  to="/settings" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" />
                </Link>
                <span className="text-sm text-muted-foreground">
                  {user.email?.split("@")[0]}
                </span>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate("/auth")}>
                <User className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            )}
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
              <Link to="/" className="text-foreground font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Acheter</Link>
              <Link to="/sell" className="text-foreground font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Vendre</Link>
              <Link to="/favorites" className="text-foreground font-medium py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Heart className="w-4 h-4" />
                Favoris
              </Link>
              <Link to="/compare" className="text-foreground font-medium py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <GitCompareArrows className="w-4 h-4" />
                Comparer
                {compareCount > 0 && (
                  <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold px-1.5">
                    {compareCount}
                  </span>
                )}
              </Link>
              <Link to="/faq" className="text-foreground font-medium py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <HelpCircle className="w-4 h-4" />
                FAQ
              </Link>
              {user && (
                <Link to="/messages" className="text-foreground font-medium py-2 flex items-center gap-2 relative" onClick={() => setMobileMenuOpen(false)}>
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  {hasUnread && (
                    <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold px-1.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <div className="flex items-center gap-4 py-2">
                <button className="text-foreground font-medium">FR</button>
                <button className="text-muted-foreground">NL</button>
                <button className="text-muted-foreground">EN</button>
              </div>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-foreground font-medium py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link to="/settings" className="text-foreground font-medium py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </Link>
                  <Button className="w-full rounded-xl" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button className="w-full rounded-xl" onClick={() => navigate("/auth")}>
                  <User className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
