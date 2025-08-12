import { User, Mail, Phone, MapPin, Calendar, Settings, Shield, Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Marcelo Silva",
    email: "marcelo@email.com", 
    phone: "(11) 99999-9999",
    address: "São Paulo, SP",
    birthdate: "1990-05-15"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aqui você pode implementar a lógica para salvar os dados
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: "Marcelo Silva",
      email: "marcelo@email.com", 
      phone: "(11) 99999-9999",
      address: "São Paulo, SP",
      birthdate: "1990-05-15"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header do Perfil */}
          <div className="text-center space-y-4">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage src="" alt="Foto do perfil" />
              <AvatarFallback className="text-3xl bg-netflix-red text-white">
                M
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Marcelo Silva</h1>
              <p className="text-muted-foreground">Membro desde Janeiro 2024</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-netflix-red" />
                    Informações Pessoais
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-netflix-red hover:bg-netflix-red/90 flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        Salvar
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Data de Nascimento</Label>
                  <Input 
                    id="birthdate" 
                    type="date" 
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange('birthdate', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informações da Igreja */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-netflix-red" />
                  Informações da Igreja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm">
                    Membro Ativo
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Data de Batismo</Label>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    15 de Março, 2024
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ministérios</Label>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-netflix-red/20 text-netflix-red rounded-md text-xs">
                      Louvor
                    </span>
                    <span className="px-2 py-1 bg-netflix-red/20 text-netflix-red rounded-md text-xs">
                      Jovens
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <div className="text-muted-foreground">Membro</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-netflix-red" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Alterar Senha</h3>
                  <p className="text-sm text-muted-foreground">Atualizar sua senha de acesso</p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;