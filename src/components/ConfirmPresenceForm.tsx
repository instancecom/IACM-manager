import { X, Plus, Trash2, User, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface ConfirmPresenceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => Promise<boolean>;
  eventTitle: string;
  eventId: string;
  allowGuests?: boolean;
}

const ConfirmPresenceForm = ({ isOpen, onClose, onConfirm, eventTitle, eventId, allowGuests = true }: ConfirmPresenceFormProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [formData, setFormData] = useState({
    responsibleName: "",
    participantName: "",
    whatsapp: "",
    guests: [""]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preenche automaticamente os dados se o usuário estiver logado
  useEffect(() => {
    if (user && profile && isOpen) {
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      setFormData(prev => ({
        ...prev,
        responsibleName: fullName || user.email || "",
        participantName: fullName || user.email || "",
        whatsapp: profile.phone || ""
      }));
    }
  }, [user, profile, isOpen]);

  const addGuest = () => {
    setFormData(prev => ({
      ...prev,
      guests: [...prev.guests, ""]
    }));
  };

  const removeGuest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index)
    }));
  };

  const updateGuest = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => i === index ? value : guest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        userId: user?.id // Adiciona o userId se o usuário estiver logado
      };
      
      const success = await onConfirm(dataToSubmit);
      if (success) {
        onClose();
        // Reset form apenas se não estiver logado
        if (!user) {
          setFormData({
            responsibleName: "",
            participantName: "",
            whatsapp: "",
            guests: [""]
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] p-0 bg-netflix-dark border-netflix-gray-dark overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-netflix-gray-dark">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-netflix-white">
                Confirmar Presença
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-netflix-gray-light hover:text-netflix-white"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-netflix-gray-light mt-2">
              Evento: <span className="text-netflix-red font-medium">{eventTitle}</span>
            </p>
            {user && (
              <p className="text-netflix-gray-light text-sm mt-1">
                Logado como: <span className="text-netflix-white">{profile?.first_name || user.email}</span>
              </p>
            )}
          </DialogHeader>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Responsável */}
            <div className="space-y-2">
              <Label htmlFor="responsibleName" className="text-netflix-white font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-netflix-red" />
                Nome do Responsável *
              </Label>
              <Input
                id="responsibleName"
                type="text"
                required
                value={formData.responsibleName}
                onChange={(e) => setFormData(prev => ({ ...prev, responsibleName: e.target.value }))}
                className="bg-netflix-gray-dark border-netflix-gray text-netflix-white placeholder:text-netflix-gray focus:border-netflix-red"
                placeholder="Digite o nome do responsável"
              />
            </div>

            {/* Nome do Participante */}
            <div className="space-y-2">
              <Label htmlFor="participantName" className="text-netflix-white font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-netflix-red" />
                Nome do Participante *
              </Label>
              <Input
                id="participantName"
                type="text"
                required
                value={formData.participantName}
                onChange={(e) => setFormData(prev => ({ ...prev, participantName: e.target.value }))}
                className="bg-netflix-gray-dark border-netflix-gray text-netflix-white placeholder:text-netflix-gray focus:border-netflix-red"
                placeholder="Digite o nome do participante"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-netflix-white font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-netflix-red" />
                WhatsApp *
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  whatsapp: formatWhatsApp(e.target.value)
                }))}
                className="bg-netflix-gray-dark border-netflix-gray text-netflix-white placeholder:text-netflix-gray focus:border-netflix-red"
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            {/* Convidados */}
            {allowGuests && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-netflix-white font-medium flex items-center gap-2">
                    <Plus className="h-4 w-4 text-netflix-red" />
                    Convidados (Opcional)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGuest}
                    className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.guests.map((guest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={guest}
                        onChange={(e) => updateGuest(index, e.target.value)}
                        className="bg-netflix-gray-dark border-netflix-gray text-netflix-white placeholder:text-netflix-gray focus:border-netflix-red"
                        placeholder={`Nome do convidado ${index + 1}`}
                      />
                      {formData.guests.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGuest(index)}
                          className="text-netflix-gray-light hover:text-netflix-red hover:bg-netflix-red/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-netflix-gray-dark bg-netflix-gray-dark/30">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-netflix flex-1 text-lg py-3"
            >
              {isSubmitting ? "Confirmando..." : "Confirmar Presença"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="btn-netflix-outline flex-1 text-lg py-3"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPresenceForm;