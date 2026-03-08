import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PROJECT_TYPES = [
  "Site vitrine",
  "Site e-commerce",
  "Landing page",
  "Refonte site",
  "SEO",
  "Maintenance",
  "Automatisation",
  "Développement sur mesure",
];

const STATUSES = ["brouillon", "envoyé", "accepté", "refusé", "payé"];

const AdminCreateQuote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const isEdit = !!id;

  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    company: "",
    project_type: "Site vitrine",
    description: "",
    price: "",
    status: "brouillon",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      supabase
        .from("admin_quotes")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            toast({ title: "Devis introuvable", variant: "destructive" });
            navigate("/admin-dashboard");
            return;
          }
          setForm({
            client_name: data.client_name || "",
            client_email: data.client_email || "",
            client_phone: data.client_phone || "",
            company: data.company || "",
            project_type: data.project_type || "Site vitrine",
            description: data.description || "",
            price: String(data.price || ""),
            status: data.status || "brouillon",
            notes: data.notes || "",
          });
        });
    }
  }, [id]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.project_type) {
      toast({ title: "Veuillez remplir le nom du client et le type de projet", variant: "destructive" });
      return;
    }

    setSaving(true);

    const payload = {
      client_name: form.client_name.trim(),
      client_email: form.client_email.trim() || null,
      client_phone: form.client_phone.trim() || null,
      company: form.company.trim() || null,
      project_type: form.project_type,
      description: form.description.trim() || null,
      price: parseFloat(form.price) || 0,
      status: form.status,
      notes: form.notes.trim() || null,
      created_by: user?.id || null,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("admin_quotes").update(payload).eq("id", id));
    } else {
      ({ error } = await supabase.from("admin_quotes").insert(payload));
    }

    setSaving(false);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: isEdit ? "Devis mis à jour" : "Devis créé !" });
    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container flex items-center h-14 px-4 gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="font-bold">{isEdit ? "Modifier le devis" : "Nouveau devis"}</h1>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Modifier le devis" : "Créer un devis client"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nom du client *</label>
                  <Input
                    value={form.client_name}
                    onChange={(e) => handleChange("client_name", e.target.value)}
                    placeholder="Nom complet"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={form.client_email}
                    onChange={(e) => handleChange("client_email", e.target.value)}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input
                    value={form.client_phone}
                    onChange={(e) => handleChange("client_phone", e.target.value)}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Entreprise</label>
                  <Input
                    value={form.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Type de projet *</label>
                  <Select value={form.project_type} onValueChange={(v) => handleChange("project_type", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Prix (€)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Description du projet..."
                  rows={4}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Statut</label>
                <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Notes internes</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Notes privées..."
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                <Save className="w-4 h-4 mr-1" />
                {saving ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le devis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminCreateQuote;
