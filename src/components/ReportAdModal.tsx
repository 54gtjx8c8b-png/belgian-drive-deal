import { useState } from "react";
import { Flag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReportAdModalProps {
  carListingId: string;
  carBrand: string;
  carModel: string;
}

const ReportAdModal = ({ carListingId, carBrand, carModel }: ReportAdModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    { value: "fake_ad", label: t("report.reasonFake") },
    { value: "scam", label: t("report.reasonScam") },
    { value: "inappropriate", label: t("report.reasonInappropriate") },
    { value: "sold", label: t("report.reasonSold") },
    { value: "wrong_info", label: t("report.reasonWrongInfo") },
    { value: "other", label: t("report.reasonOther") },
  ];

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: t("report.error"),
        description: t("report.selectReason"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: t("report.loginRequired"),
          description: t("report.loginRequiredDesc"),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from("reports").insert({
        car_listing_id: carListingId,
        user_id: session.user.id,
        reason: reason,
        comment: comment.trim() || null,
      });

      if (error) {
        // Check for unique constraint violation (already reported)
        if (error.code === "23505") {
          toast({
            title: t("report.alreadyReported"),
            description: t("report.alreadyReportedDesc"),
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: t("report.success"),
          description: t("report.successDesc"),
        });
      }

      setIsOpen(false);
      setReason("");
      setComment("");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: t("report.error"),
        description: t("report.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive gap-2"
        >
          <Flag className="w-4 h-4" />
          <span className="hidden sm:inline">{t("report.button")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-destructive" />
            {t("report.title")}
          </DialogTitle>
          <DialogDescription>
            {t("report.description")} <strong>{carBrand} {carModel}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">{t("report.reasonLabel")}</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder={t("report.selectReason")} />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">{t("report.commentLabel")}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("report.commentPlaceholder")}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            {t("report.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason}
            className="flex-1 bg-destructive hover:bg-destructive/90"
          >
            {isSubmitting ? t("report.submitting") : t("report.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportAdModal;
