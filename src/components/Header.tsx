import { Menu, User, LogOut, Heart, MessageCircle, HelpCircle, GitCompareArrows, LayoutDashboard, Settings, ChevronDown, Globe } from "lucide-react";
import autoraLogo from "@/assets/autora-logo.png";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useCompareContext } from "@/contexts/CompareContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const NavLink = ({ to, children, badge }: { to: string; children: React.ReactNode; badge?: number }) => (
    <Link 
      to={to} 
      className={`relative font-medium transition-colors ${
        location.pathname === to 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {location.pathname === to && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
      )}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold px-1">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );

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

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/">Acheter</NavLink>
            <NavLink to="/sell">Vendre</NavLink>
            <NavLink to="/favorites">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                Favoris
              </span>
            </NavLink>
            <NavLink to="/compare" badge={compareCount}>
              <span className="flex items-center gap-1.5">
                <GitCompareArrows className="w-4 h-4" />
                Comparer
              </span>
            </NavLink>
            {user && (
              <NavLink to="/messages" badge={hasUnread ? unreadCount : undefined}>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Actions - Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  <Globe className="w-4 h-4" />
                  FR
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[100px]">
                <DropdownMenuItem className="font-medium">Français</DropdownMenuItem>
                <DropdownMenuItem>Nederlands</DropdownMenuItem>
                <DropdownMenuItem>English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl gap-2">
                    <User className="w-4 h-4" />
                    {user.email?.split("@")[0]}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/faq")} className="cursor-pointer">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <nav className="flex flex-col gap-3">
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
                <Link to="/messages" className="text-foreground font-medium py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  {hasUnread && (
                    <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold px-1.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <div className="h-px bg-border my-2" />
              
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
                  <Button variant="outline" className="w-full rounded-xl mt-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button className="w-full rounded-xl mt-2" onClick={() => navigate("/auth")}>
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
