import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const FeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);

    // Simple mailto fallback — can be replaced with Formspree or similar
    try {
      const subject = encodeURIComponent("Avis Easy Devis (bêta)");
      const body = encodeURIComponent(message);
      window.open(`mailto:romainligneres77@gmail.com?subject=${subject}&body=${body}`, "_blank");
      toast({
        title: "Merci pour votre retour !",
        description: "Votre avis nous aide à améliorer l'application.",
      });
      setMessage("");
      setOpen(false);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Donner mon avis
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Votre avis compte 💬</DialogTitle>
            <DialogDescription>
              Vous testez la version bêta. Dites-nous ce qu'on peut améliorer !
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Que peut-on améliorer ? Une fonctionnalité manquante ? Un bug ?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={!message.trim() || sending}>
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
