import { useState } from "react";
import { CompanyInfo } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CompanyFormProps {
  company: CompanyInfo;
  onChange: (company: CompanyInfo) => void;
}

// Compresse l'image via Canvas (max 400px de large, max 2 Mo en entrée)
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("Image trop lourde (max 2 Mo)"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 400;
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png", 0.85));
      };
      img.onerror = () => reject(new Error("Impossible de charger l'image"));
      img.src = e.target!.result as string;
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
    reader.readAsDataURL(file);
  });
};

export const CompanyForm = ({ company, onChange }: CompanyFormProps) => {
  const [logoError, setLogoError] = useState<string | null>(null);

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    onChange({ ...company, [field]: value });
  };

  const handleLogoUpload = async (file: File) => {
    setLogoError(null);
    try {
      const dataUrl = await compressImage(file);
      onChange({ ...company, logo: dataUrl });
    } catch (err: any) {
      setLogoError(err.message ?? "Erreur lors du chargement");
    }
  };

  const handleRemoveLogo = () => {
    onChange({ ...company, logo: undefined });
    setLogoError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {company.logo ? (
          <div className="relative shrink-0">
            <img
              src={company.logo}
              alt="Logo entreprise"
              className="h-20 w-auto max-w-[120px] object-contain rounded border bg-white p-2"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemoveLogo}
              title="Supprimer le logo"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="h-20 w-32 shrink-0 flex items-center justify-center border border-dashed rounded text-xs text-muted-foreground">
            Aucun logo
          </div>
        )}

        <div className="flex flex-col gap-1">
          <Label>Logo de l'entreprise</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoUpload(file);
              e.target.value = "";
            }}
          />
          <p className="text-xs text-muted-foreground">
            PNG ou JPG — max 2 Mo — redimensionné automatiquement
          </p>
          {logoError && (
            <p className="text-xs text-destructive font-medium">{logoError}</p>
          )}
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
            maxLength={5}
            value={company.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value.replace(/\D/g, ""))}
          />
        </div>
      </div>
    </div>
  );
};
