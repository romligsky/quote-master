
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

  const handleLogoUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    onChange({
      ...company,
      logo: reader.result as string,
    });
  };
  reader.readAsDataURL(file);
};

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {company.logo ? (
          <img
            src={company.logo}
            alt="Logo entreprise"
            className="h-20 w-auto object-contain rounded border bg-white p-2"
          />
        ) : (
          <div className="h-20 w-32 flex items-center justify-center border border-dashed rounded text-xs text-muted-foreground">
            Aucun logo
          </div>
        )}

        <div className="flex flex-col gap-1">
          <Label>Logo de l’entreprise</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoUpload(file);
            }}
          />
          <p className="text-xs text-muted-foreground">
            PNG ou JPG – recommandé : fond transparent
          </p>
        </div>
      </div>

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
