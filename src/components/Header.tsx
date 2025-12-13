import { Menu, User, LogOut, Heart, MessageCircle } from "lucide-react";
import autoraLogo from "@/assets/autora-logo.png";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { unreadCount, hasUnread } = useUnreadMessages();

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
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={autoraLogo} 
              alt="AutoRa Logo" 
              className="w-10 h-10 rounded-xl object-cover transition-transform group-hover:scale-105"
            />
            <span className="font-display text-xl font-bold text-foreground">
              Auto<span className="gradient-text">Ra</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Acheter
            </Link>
            <Link to="/sell" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Vendre
            </Link>
            <Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Favoris
            </Link>
            {user && (
              <Link to="/messages" className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1 relative">
                <MessageCircle className="w-4 h-4" />
                Messages
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
                <Button className="w-full rounded-xl" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
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
