import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  LayoutDashboard, 
  Eye, 
  MessageCircle, 
  Heart, 
  Car,
  TrendingUp,
  Calendar,
  BarChart3,
  Pencil,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart
} from "recharts";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

interface ListingStats {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  photo: string | null;
  views: number;
  messages: number;
  favorites: number;
  created_at: string;
}

interface DailyStats {
  date: string;
  dateLabel: string;
  views: number;
  messages: number;
  favorites: number;
}

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<ListingStats[]>([]);
  const [totals, setTotals] = useState({ views: 0, messages: 0, favorites: 0 });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<ListingStats | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchDailyStats();
    }
  }, [user]);

  const fetchDailyStats = async () => {
    if (!user) return;

    try {
      // Get user's listing IDs first
      const { data: userListings } = await supabase
        .from("car_listings")
        .select("id")
        .eq("user_id", user.id);

      if (!userListings || userListings.length === 0) {
        setDailyStats([]);
        return;
      }

      const listingIds = userListings.map(l => l.id);
      const thirtyDaysAgo = subDays(new Date(), 30);

      // Fetch views with dates
      const { data: viewsData } = await supabase
        .from("car_views")
        .select("viewed_at")
        .in("car_listing_id", listingIds)
        .gte("viewed_at", thirtyDaysAgo.toISOString());

      // Fetch conversations with dates
      const { data: conversationsData } = await supabase
        .from("conversations")
        .select("created_at")
        .eq("seller_id", user.id)
        .in("car_listing_id", listingIds)
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Fetch favorites with dates
      const { data: favoritesData } = await supabase
        .from("favorites")
        .select("created_at")
        .in("car_listing_id", listingIds)
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Generate all days in the last 30 days
      const days = eachDayOfInterval({
        start: thirtyDaysAgo,
        end: new Date()
      });

      // Count views, messages and favorites per day
      const viewsByDay: Record<string, number> = {};
      const messagesByDay: Record<string, number> = {};
      const favoritesByDay: Record<string, number> = {};

      viewsData?.forEach(v => {
        const day = format(startOfDay(new Date(v.viewed_at)), "yyyy-MM-dd");
        viewsByDay[day] = (viewsByDay[day] || 0) + 1;
      });

      conversationsData?.forEach(c => {
        const day = format(startOfDay(new Date(c.created_at)), "yyyy-MM-dd");
        messagesByDay[day] = (messagesByDay[day] || 0) + 1;
      });

      favoritesData?.forEach(f => {
        const day = format(startOfDay(new Date(f.created_at)), "yyyy-MM-dd");
        favoritesByDay[day] = (favoritesByDay[day] || 0) + 1;
      });

      // Build daily stats array
      const stats: DailyStats[] = days.map(day => {
        const dateKey = format(day, "yyyy-MM-dd");
        return {
          date: dateKey,
          dateLabel: format(day, "d MMM", { locale: fr }),
          views: viewsByDay[dateKey] || 0,
          messages: messagesByDay[dateKey] || 0,
          favorites: favoritesByDay[dateKey] || 0,
        };
      });

      setDailyStats(stats);
    } catch (error) {
      console.error("Error fetching daily stats:", error);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user's listings
      const { data: userListings, error: listingsError } = await supabase
        .from("car_listings")
        .select("id, brand, model, year, price, status, photos, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (listingsError) throw listingsError;

      if (!userListings || userListings.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }

      const listingIds = userListings.map(l => l.id);

      // Fetch views count per listing
      const { data: viewsData } = await supabase
        .from("car_views")
        .select("car_listing_id")
        .in("car_listing_id", listingIds);

      // Fetch favorites count per listing
      const { data: favoritesData } = await supabase
        .from("favorites")
        .select("car_listing_id")
        .in("car_listing_id", listingIds);

      // Fetch conversations (messages) count per listing
      const { data: conversationsData } = await supabase
        .from("conversations")
        .select("car_listing_id")
        .eq("seller_id", user.id)
        .in("car_listing_id", listingIds);

      // Calculate counts per listing
      const viewsCounts: Record<string, number> = {};
      const favoritesCounts: Record<string, number> = {};
      const messagesCounts: Record<string, number> = {};

      viewsData?.forEach(v => {
        viewsCounts[v.car_listing_id] = (viewsCounts[v.car_listing_id] || 0) + 1;
      });

      favoritesData?.forEach(f => {
        favoritesCounts[f.car_listing_id] = (favoritesCounts[f.car_listing_id] || 0) + 1;
      });

      conversationsData?.forEach(c => {
        if (c.car_listing_id) {
          messagesCounts[c.car_listing_id] = (messagesCounts[c.car_listing_id] || 0) + 1;
        }
      });

      // Build listing stats
      const stats: ListingStats[] = userListings.map(listing => ({
        id: listing.id,
        brand: listing.brand,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        status: listing.status || "pending",
        photo: listing.photos?.[0] || null,
        views: viewsCounts[listing.id] || 0,
        messages: messagesCounts[listing.id] || 0,
        favorites: favoritesCounts[listing.id] || 0,
        created_at: listing.created_at,
      }));

      setListings(stats);
      setTotals({
        views: stats.reduce((sum, l) => sum + l.views, 0),
        messages: stats.reduce((sum, l) => sum + l.messages, 0),
        favorites: stats.reduce((sum, l) => sum + l.favorites, 0),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, listing: ListingStats) => {
    e.stopPropagation();
    setListingToDelete(listing);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("car_listings")
        .delete()
        .eq("id", listingToDelete.id);

      if (error) throw error;

      setListings(prev => prev.filter(l => l.id !== listingToDelete.id));
      toast.success("Annonce supprimée avec succès");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  const handleEditClick = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    navigate(`/sell?edit=${listingId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-BE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-500/10 text-green-500",
      pending: "bg-yellow-500/10 text-yellow-500",
      rejected: "bg-red-500/10 text-red-500",
    };
    const labels: Record<string, string> = {
      approved: "Publiée",
      pending: "En attente",
      rejected: "Refusée",
    };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <LayoutDashboard className="w-4 h-4" />
                Espace vendeur
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Tableau de <span className="gradient-text">bord</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Suivez les performances de vos annonces
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Annonces
                  </CardTitle>
                  <Car className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold text-foreground">{listings.length}</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Vues totales
                  </CardTitle>
                  <Eye className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold text-foreground">{totals.views}</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Messages
                  </CardTitle>
                  <MessageCircle className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold text-foreground">{totals.messages}</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Favoris
                  </CardTitle>
                  <Heart className="w-4 h-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold text-foreground">{totals.favorites}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Combined Chart */}
            <Card className="bg-card border-border mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Performance globale
                  <span className="text-sm font-normal text-muted-foreground ml-auto">
                    30 derniers jours
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : dailyStats.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViewsCombined" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="dateLabel" 
                        tick={{ fontSize: 11 }}
                        className="text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        className="text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: 20 }}
                        iconType="circle"
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        name="Vues"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViewsCombined)"
                      />
                      <Line
                        type="monotone"
                        dataKey="messages"
                        name="Messages"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#22c55e" }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="favorites"
                        name="Favoris"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#ef4444" }}
                        activeDot={{ r: 5 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Listings Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <BarChart3 className="w-5 h-5" />
                  Détail par annonce
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore d'annonces
                    </p>
                    <button
                      onClick={() => navigate("/sell")}
                      className="btn-primary-gradient"
                    >
                      Créer une annonce
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map(listing => (
                      <div
                        key={listing.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                        onClick={() => navigate(`/car/${listing.id}`)}
                      >
                        {/* Image */}
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {listing.photo ? (
                            <img
                              src={listing.photo}
                              alt={`${listing.brand} ${listing.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {listing.brand} {listing.model}
                            </h3>
                            {getStatusBadge(listing.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{listing.year}</span>
                            <span>{formatPrice(listing.price)}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(listing.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 md:gap-6">
                          <div className="text-center hidden sm:block">
                            <div className="flex items-center gap-1 text-blue-500">
                              <Eye className="w-4 h-4" />
                              <span className="font-semibold">{listing.views}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Vues</span>
                          </div>
                          <div className="text-center hidden sm:block">
                            <div className="flex items-center gap-1 text-green-500">
                              <MessageCircle className="w-4 h-4" />
                              <span className="font-semibold">{listing.messages}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Messages</span>
                          </div>
                          <div className="text-center hidden sm:block">
                            <div className="flex items-center gap-1 text-red-500">
                              <Heart className="w-4 h-4" />
                              <span className="font-semibold">{listing.favorites}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Favoris</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-lg"
                            onClick={(e) => handleEditClick(e, listing.id)}
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => handleDeleteClick(e, listing)}
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
            <AlertDialogDescription>
              {listingToDelete && (
                <>
                  Êtes-vous sûr de vouloir supprimer l'annonce pour{" "}
                  <strong>{listingToDelete.brand} {listingToDelete.model}</strong> ?
                  Cette action est irréversible.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default SellerDashboard;
