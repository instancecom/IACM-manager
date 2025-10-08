import { User, Calendar, Shield, Edit, Save, X, CalendarCheck, Download, Trash2, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Header from "@/components/Header";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useEventConfirmations } from "@/hooks/useEventConfirmations";
import { useEvents } from "@/hooks/useEvents";
import { useLGPDActions } from "@/hooks/useLGPDActions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { profile, loading, updateProfile, getFullName, getInitials } = useProfile();
  const { user } = useAuth();
  const { confirmations } = useEventConfirmations();
  const { events } = useEvents();
  const { exportUserData, deleteUserAccount, loading: lgpdLoading } = useLGPDActions();
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birth_date: ""
  });

  // Atualizar formData quando o profile carregar
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        birth_date: profile.birth_date || ""
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const success = await updateProfile({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone,
      birth_date: formData.birth_date
    });
    
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to profile values
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        birth_date: profile.birth_date || ""
      });
    }
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
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{getFullName()}</h1>
              <p className="text-muted-foreground">
                {user?.email || "Email não disponível"}
              </p>
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
                        disabled={loading}
                        className="bg-netflix-red hover:bg-netflix-red/90 flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nome</Label>
                  <Input 
                    id="first_name" 
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Digite seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Sobrenome</Label>
                  <Input 
                    id="last_name" 
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Digite seu sobrenome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ""}
                    disabled={true}
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">O email não pode ser alterado por aqui</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input 
                    id="birth_date" 
                    type="date" 
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange('birth_date', e.target.value)}
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

          {/* Eventos Confirmados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-netflix-red" />
                Eventos Confirmados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const userConfirmations = confirmations.filter(c => c.user_id === user?.id && c.confirmed);
                const confirmedEvents = events.filter(event => 
                  userConfirmations.some(c => c.event_id === event.id)
                );

                if (confirmedEvents.length === 0) {
                  return (
                    <p className="text-muted-foreground text-center py-4">
                      Você ainda não confirmou presença em nenhum evento
                    </p>
                  );
                }

                return (
                  <div className="space-y-3">
                    {confirmedEvents.map(event => {
                      const confirmation = userConfirmations.find(c => c.event_id === event.id);
                      return (
                        <div key={event.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{event.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {format(new Date(event.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {event.start_time}
                              </p>
                              {confirmation?.confirmed_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Confirmado em {format(new Date(confirmation.confirmed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Seção LGPD - Privacidade e Dados */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidade e Dados (LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Seus Direitos</h3>
                  <p className="text-sm text-muted-foreground">
                    De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direitos sobre seus dados pessoais.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => user?.id && exportUserData(user.id)}
                    disabled={lgpdLoading}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exportar Meus Dados
                  </Button>

                  <Link to="/privacy-policy" target="_blank">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Política de Privacidade
                    </Button>
                  </Link>

                  <Link to="/terms-of-service" target="_blank">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Termos de Uso
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Excluir Minha Conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso irá excluir permanentemente sua conta
                          e remover todos os seus dados de nossos servidores, incluindo:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Perfil e informações pessoais</li>
                            <li>Confirmações de eventos</li>
                            <li>Histórico de participações</li>
                            <li>Todos os registros relacionados</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => user?.id && deleteUserAccount(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sim, excluir minha conta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {profile?.privacy_consent_given_at && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Consentimento de privacidade dado em:{" "}
                      {format(new Date(profile.privacy_consent_given_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    {profile?.terms_accepted_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Termos de uso aceitos em:{" "}
                        {format(new Date(profile.terms_accepted_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;