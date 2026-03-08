import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Plus,
  LogOut,
  FileText,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface AdminQuote {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  company: string | null;
  project_type: string;
  description: string | null;
  price: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  brouillon: "bg-muted text-muted-foreground",
  envoyé: "bg-primary/20 text-primary",
  accepté: "bg-green-100 text-green-700",
  refusé: "bg-destructive/20 text-destructive",
  payé: "bg-green-200 text-green-800",
};

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0 });

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("admin_quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    const q = (data || []) as AdminQuote[];
    setQuotes(q);
    setStats({
      total: q.length,
      pending: q.filter((x) => x.status === "envoyé").length,
      revenue: q.filter((x) => x.status === "payé").reduce((s, x) => s + Number(x.price), 0),
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const deleteQuote = async (id: string) => {
    const { error } = await supabase.from("admin_quotes").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Devis supprimé" });
    fetchQuotes();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(p);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => navigate("/admin/create")}>
              <Plus className="w-4 h-4 mr-1" />
              Nouveau devis
            </Button>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total devis</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold text-primary">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Revenus (payés)</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(stats.revenue)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quotes table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Devis ({quotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Chargement...</p>
            ) : quotes.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted-foreground">Aucun devis pour l'instant</p>
                <Button onClick={() => navigate("/admin/create")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Créer un devis
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead className="hidden sm:table-cell">Projet</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{q.client_name}</p>
                            <p className="text-xs text-muted-foreground">{q.company || q.client_email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{q.project_type}</TableCell>
                        <TableCell className="font-medium">{formatPrice(q.price)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[q.status] || ""}>{q.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {new Date(q.created_at).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => navigate(`/admin/edit/${q.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer ce devis ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteQuote(q.id)}>
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
