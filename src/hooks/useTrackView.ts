import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useTrackView = (carListingId: string | undefined) => {
  useEffect(() => {
    if (!carListingId) return;

    const trackView = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from("car_views").insert({
          car_listing_id: carListingId,
          viewer_id: user?.id || null,
        });
      } catch (error) {
        // Silently fail - view tracking is not critical
        console.error("Failed to track view:", error);
      }
    };

    // Small delay to avoid tracking on quick navigation
    const timeout = setTimeout(trackView, 1000);
    return () => clearTimeout(timeout);
  }, [carListingId]);
};
