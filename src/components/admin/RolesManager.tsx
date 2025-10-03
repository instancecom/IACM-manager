import { useState, useEffect } from "react";
import { useRoles, UserWithRoles, AppRole } from "@/hooks/useRoles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserCog, Eye, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roleIcons = {
  admin: Shield,
  editor: UserCog,
  reader: Eye,
  user: Users,
};

const roleLabels = {
  admin: 'Administrador',
  editor: 'Editor',
  reader: 'Leitor',
  user: 'Usuário',
};

const roleDescriptions = {
  admin: 'Controle total do sistema',
  editor: 'Criar eventos, escalas e cadastros',
  reader: 'Apenas visualizar dados',
  user: 'Acesso básico',
};

export const RolesManager = () => {
  const { isAdmin, fetchAllUsersWithRoles, assignRole, removeRole } = useRoles();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    const usersData = await fetchAllUsersWithRoles();
    setUsers(usersData);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const handleAssignRole = async (userId: string, role: AppRole) => {
    const result = await assignRole(userId, role);
    if (result.success) {
      toast({
        title: "Role atribuído",
        description: `Role ${roleLabels[role]} foi atribuído com sucesso.`,
      });
      loadUsers();
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível atribuir o role.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    const result = await removeRole(userId, role);
    if (result.success) {
      toast({
        title: "Role removido",
        description: `Role ${roleLabels[role]} foi removido com sucesso.`,
      });
      loadUsers();
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível remover o role.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Você não tem permissão para acessar esta funcionalidade.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Carregando usuários...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Acessos</CardTitle>
          <CardDescription>
            Atribua roles aos usuários do sistema
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => {
                    const Icon = roleIcons[role];
                    return (
                      <Badge key={role} variant="secondary" className="gap-1">
                        <Icon className="h-3 w-3" />
                        {roleLabels[role]}
                        <button
                          onClick={() => handleRemoveRole(user.id, role)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                  {user.roles.length === 0 && (
                    <Badge variant="outline">Sem roles atribuídos</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Select onValueChange={(value) => handleAssignRole(user.id, value as AppRole)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Atribuir role" />
                    </SelectTrigger>
                    <SelectContent>
                      {(['admin', 'editor', 'reader', 'user'] as AppRole[]).map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          disabled={user.roles.includes(role)}
                        >
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = roleIcons[role];
                              return <Icon className="h-4 w-4" />;
                            })()}
                            <div>
                              <div className="font-medium">{roleLabels[role]}</div>
                              <div className="text-xs text-muted-foreground">
                                {roleDescriptions[role]}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
