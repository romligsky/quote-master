import { useState, useEffect } from "react";
import { Client } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserPlus, AlertCircle } from "lucide-react";

const CLIENTS_KEY = "deviselec_saved_clients";

const loadSavedClients = (): Client[] => {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveClientToHistory = (client: Client) => {
  if (!client.name.trim()) return;
  try {
    const existing = loadSavedClients();
    const filtered = existing.filter(
      (c) => c.name.trim().toLowerCase() !== client.name.trim().toLowerCase()
    );
    const updated = [client, ...filtered].slice(0, 20); // max 20 clients
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(updated));
  } catch {}
};

const isValidEmail = (email: string) =>
  email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPostalCode = (cp: string) =>
  cp === "" || /^\d{5}$/.test(cp);

interface ClientFormProps {
  client: Client;
  onChange: (client: Client) => void;
}

export const ClientForm = ({ client, onChange }: ClientFormProps) => {
  const [savedClients, setSavedClients] = useState<Client[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSavedClients(loadSavedClients());
  }, []);

  const handleChange = (field: keyof Client, value: string) => {
    onChange({ ...client, [field]: value });
  };

  const handleSelectClient = (name: string) => {
    const found = savedClients.find((c) => c.name === name);
    if (found) onChange(found);
  };

  const handleSave = () => {
    if (!client.name.trim()) return;
    saveClientToHistory(client);
    setSavedClients(loadSavedClients());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const emailInvalid = !isValidEmail(client.email);
  const cpInvalid = !isValidPostalCode(client.postalCode);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Informations client
          </span>
          {savedClients.length > 0 && (
            <Select onValueChange={handleSelectClient}>
              <SelectTrigger className="w-44 h-8 text-xs">
                <SelectValue placeholder="Clients précédents" />
              </SelectTrigger>
              <SelectContent>
                {savedClients.map((c, i) => (
                  <SelectItem key={i} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom / Société *</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                placeholder="Martin Dupont ou Dupont SARL"
                value={client.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={handleSave}
                disabled={!client.name.trim()}
                title="Sauvegarder ce client"
              >
                {saved ? (
                  <span className="text-green-500 text-xs font-bold">✓</span>
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              Email
              {client.email && emailInvalid && (
                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
              )}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="client@email.com"
              value={client.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={client.email && emailInvalid ? "border-destructive" : ""}
            />
            {client.email && emailInvalid && (
              <p className="text-xs text-destructive">Adresse email invalide</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              placeholder="06 12 34 56 78"
              value={client.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="12 rue des Lilas"
              value={client.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              placeholder="Paris"
              value={client.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="flex items-center gap-1">
              Code postal
              {client.postalCode && cpInvalid && (
                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
              )}
            </Label>
            <Input
              id="postalCode"
              placeholder="75001"
              maxLength={5}
              value={client.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value.replace(/\D/g, ""))}
              className={client.postalCode && cpInvalid ? "border-destructive" : ""}
            />
            {client.postalCode && cpInvalid && (
              <p className="text-xs text-destructive">5 chiffres requis</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
