import { Client } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface ClientFormProps {
  client: Client;
  onChange: (client: Client) => void;
}

export const ClientForm = ({ client, onChange }: ClientFormProps) => {
  const handleChange = (field: keyof Client, value: string) => {
    onChange({ ...client, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-primary" />
          Informations client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom / Société *</Label>
            <Input
              id="name"
              placeholder="Martin Dupont ou Dupont SARL"
              value={client.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@email.com"
              value={client.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
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
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              placeholder="75001"
              value={client.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
