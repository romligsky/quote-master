import { CompanyInfo } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyFormProps {
  company: CompanyInfo;
  onChange: (company: CompanyInfo) => void;
}

export const CompanyForm = ({ company, onChange }: CompanyFormProps) => {
  const handleChange = (field: keyof CompanyInfo, value: string) => {
    onChange({ ...company, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l'entreprise *</Label>
          <Input
            id="companyName"
            placeholder="Mon Entreprise SARL"
            value={company.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyEmail">Email</Label>
          <Input
            id="companyEmail"
            type="email"
            placeholder="contact@entreprise.fr"
            value={company.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyPhone">Téléphone</Label>
          <Input
            id="companyPhone"
            placeholder="01 23 45 67 89"
            value={company.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companySiret">SIRET</Label>
          <Input
            id="companySiret"
            placeholder="123 456 789 00012"
            value={company.siret || ""}
            onChange={(e) => handleChange("siret", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyAddress">Adresse</Label>
        <Input
          id="companyAddress"
          placeholder="12 rue des Artisans"
          value={company.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyCity">Ville</Label>
          <Input
            id="companyCity"
            placeholder="Paris"
            value={company.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyPostalCode">Code postal</Label>
          <Input
            id="companyPostalCode"
            placeholder="75001"
            value={company.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
