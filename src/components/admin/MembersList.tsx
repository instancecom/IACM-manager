import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useMembers, type Member } from "@/hooks/useMembers";
import { supabase } from "@/integrations/supabase/client";

const MembersList = () => {
  const { members, loading, error, refetch } = useMembers();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      
      // Delete from ministry_members first (if exists)
      await supabase
        .from('ministry_members')
        .delete()
        .eq('member_id', id);
      
      // Then delete from members
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Membro removido",
        description: "O membro foi removido da comunidade com sucesso.",
      });
      
      refetch();
    } catch (err) {
      console.error('Error deleting member:', err);
      toast({
        title: "Erro",
        description: "Erro ao remover o membro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember({ ...member });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('members')
        .update({
          first_name: editingMember.first_name,
          last_name: editingMember.last_name,
          whatsapp: editingMember.whatsapp,
          birth_date: editingMember.birth_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingMember.id);

      if (error) throw error;

      setIsEditDialogOpen(false);
      setEditingMember(null);
      toast({
        title: "Membro atualizado",
        description: "As informações do membro foram atualizadas com sucesso.",
      });
      
      refetch();
    } catch (err) {
      console.error('Error updating member:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar o membro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateAge = (birthDateString: string) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Carregando membros...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Erro ao carregar membros: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>Ministério</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={member.photo_url || ""} />
                  <AvatarFallback>
                    {member.first_name[0]}{member.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                {member.first_name} {member.last_name}
              </TableCell>
              <TableCell>
                <a 
                  href={`https://wa.me/55${member.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                >
                  {member.whatsapp}
                </a>
              </TableCell>
              <TableCell>{calculateAge(member.birth_date)} anos</TableCell>
              <TableCell>{format(new Date(member.birth_date), "dd/MM/yyyy")}</TableCell>
              <TableCell>
                {member.ministry ? (
                  <Badge variant="secondary">
                    {member.ministry.name} - {member.ministry.role}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Sem ministério</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedMember?.first_name} {selectedMember?.last_name}</DialogTitle>
                        <DialogDescription>
                          Detalhes do membro
                        </DialogDescription>
                      </DialogHeader>
                      {selectedMember && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={selectedMember.photo_url || ""} />
                              <AvatarFallback className="text-lg">
                                {selectedMember.first_name[0]}{selectedMember.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{selectedMember.first_name} {selectedMember.last_name}</h3>
                              <p className="text-muted-foreground">Membro da Comunidade</p>
                            </div>
                          </div>
                          <div>
                            <strong>WhatsApp:</strong> 
                            <a 
                              href={`https://wa.me/55${selectedMember.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 hover:underline cursor-pointer ml-2"
                            >
                              {selectedMember.whatsapp}
                            </a>
                          </div>
                          <div>
                            <strong>Data de Nascimento:</strong> {format(new Date(selectedMember.birth_date), "dd/MM/yyyy")}
                          </div>
                          <div>
                            <strong>Idade:</strong> {calculateAge(selectedMember.birth_date)} anos
                          </div>
                          {selectedMember.ministry && (
                            <div>
                              <strong>Ministério:</strong> {selectedMember.ministry.name} ({selectedMember.ministry.role})
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isDeleting === member.id}>
                        {isDeleting === member.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover {member.first_name} {member.last_name} da comunidade? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(member.id)}>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {members.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum membro cadastrado
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
            <DialogDescription>
              Altere as informações do membro abaixo.
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  value={editingMember.first_name}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    first_name: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={editingMember.last_name}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    last_name: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={editingMember.whatsapp}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    whatsapp: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formatDateForInput(editingMember.birth_date)}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    birth_date: e.target.value
                  })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersList;