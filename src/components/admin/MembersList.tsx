import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock data - será substituído pela integração com o banco de dados
const mockMembers = [
  {
    id: 1,
    firstName: "Carlos",
    lastName: "Oliveira",
    birthDate: new Date("1985-12-03"),
    whatsapp: "(11) 99999-4444",
    photo: null,
    status: "Ativo"
  },
  {
    id: 2,
    firstName: "Ana",
    lastName: "Ferreira",
    birthDate: new Date("1990-07-18"),
    whatsapp: "(11) 99999-5555",
    photo: null,
    status: "Ativo"
  },
  {
    id: 3,
    firstName: "Lucas",
    lastName: "Rodrigues",
    birthDate: new Date("1987-11-25"),
    whatsapp: "(11) 99999-6666",
    photo: null,
    status: "Inativo"
  },
  {
    id: 4,
    firstName: "Beatriz",
    lastName: "Lima",
    birthDate: new Date("1993-04-12"),
    whatsapp: "(11) 99999-7777",
    photo: null,
    status: "Ativo"
  }
];

const MembersList = () => {
  const [members, setMembers] = useState(mockMembers);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    setMembers(members.filter(member => member.id !== id));
    toast({
      title: "Membro removido",
      description: "O membro foi removido da comunidade com sucesso.",
    });
  };

  const handleEdit = (member: any) => {
    setEditingMember({ ...member });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingMember) {
      setMembers(members.map(member => 
        member.id === editingMember.id ? editingMember : member
      ));
      setIsEditDialogOpen(false);
      setEditingMember(null);
      toast({
        title: "Membro atualizado",
        description: "As informações do membro foram atualizadas com sucesso.",
      });
    }
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  };

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
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={member.photo || ""} />
                  <AvatarFallback>
                    {member.firstName[0]}{member.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                {member.firstName} {member.lastName}
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
              <TableCell>{calculateAge(member.birthDate)} anos</TableCell>
              <TableCell>{format(member.birthDate, "dd/MM/yyyy")}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {member.status}
                </span>
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
                        <DialogTitle>{selectedMember?.firstName} {selectedMember?.lastName}</DialogTitle>
                        <DialogDescription>
                          Detalhes do membro
                        </DialogDescription>
                      </DialogHeader>
                      {selectedMember && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={selectedMember.photo || ""} />
                              <AvatarFallback className="text-lg">
                                {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{selectedMember.firstName} {selectedMember.lastName}</h3>
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
                            <strong>Data de Nascimento:</strong> {format(selectedMember.birthDate, "dd/MM/yyyy")}
                          </div>
                          <div>
                            <strong>Idade:</strong> {calculateAge(selectedMember.birthDate)} anos
                          </div>
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
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover {member.firstName} {member.lastName} da comunidade? Esta ação não pode ser desfeita.
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
      
      {members.length === 0 && (
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
                  value={editingMember.firstName}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    firstName: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={editingMember.lastName}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    lastName: e.target.value
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
                  value={formatDateForInput(editingMember.birthDate)}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    birthDate: new Date(e.target.value)
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={editingMember.status || "Ativo"} 
                  onValueChange={(value) => setEditingMember({
                    ...editingMember,
                    status: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersList;