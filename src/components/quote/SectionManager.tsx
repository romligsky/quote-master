import { useState } from "react";
import { QuoteSection } from "@/types/quote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Layers } from "lucide-react";
import { createDefaultSection } from "@/lib/quote-utils";

interface SectionManagerProps {
  sections: QuoteSection[];
  onAddSection: (section: QuoteSection) => void;
  onRenameSection: (sectionId: string, newName: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export const SectionManager = ({
  sections,
  onAddSection,
  onRenameSection,
  onDeleteSection,
}: SectionManagerProps) => {
  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      const newSection = createDefaultSection(newSectionName.trim(), sections.length);
      onAddSection(newSection);
      setNewSectionName("");
    }
  };

  const handleStartEditing = (section: QuoteSection) => {
    setEditingSectionId(section.id);
    setEditingName(section.name);
  };

  const handleSaveEdit = () => {
    if (editingSectionId && editingName.trim()) {
      onRenameSection(editingSectionId, editingName.trim());
      setEditingSectionId(null);
      setEditingName("");
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    if (sections.length > 1) {
      onDeleteSection(sectionId);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Sections du devis
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Nom de la section (ex: Tableau électrique)"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddSection} disabled={!newSectionName.trim()}>
                    Ajouter
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
            >
              {editingSectionId === section.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                  onBlur={handleSaveEdit}
                  className="flex-1 mr-2"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-medium">{section.name}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleStartEditing(section)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteSection(section.id)}
                  disabled={sections.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {sections.length === 1 && (
          <p className="text-xs text-muted-foreground mt-2">
            Au moins une section est obligatoire
          </p>
        )}
      </CardContent>
    </Card>
  );
};
