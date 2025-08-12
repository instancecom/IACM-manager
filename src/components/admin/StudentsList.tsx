import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock data - será substituído pela integração com o banco de dados
const mockStudents = [
  {
    id: 1,
    firstName: "João",
    lastName: "Silva",
    whatsapp: "(11) 99999-1111",
    birthDate: new Date("1995-05-15"),
    ministryType: "louvor",
    photo: null
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Santos",
    whatsapp: "(11) 99999-2222",
    birthDate: new Date("1998-03-20"),
    ministryType: "marketing",
    photo: null
  },
  {
    id: 3,
    firstName: "Pedro",
    lastName: "Costa",
    whatsapp: "(11) 99999-3333",
    birthDate: new Date("1992-08-10"),
    ministryType: "recepcao",
    photo: null
  }
];

const ministryLabels = {
  louvor: "Louvor",
  marketing: "Marketing",
  recepcao: "Recepção",
  obreiros: "Obreiros",
  jovens: "Jovens",
  criancas: "Crianças"
};

const StudentsList = () => {
  const [students, setStudents] = useState(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
    toast({
      title: "Aluno removido",
      description: "O aluno foi removido do ministério com sucesso.",
    });
  };

  const handleEdit = (student: any) => {
    setEditingStudent({ ...student });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingStudent) return;
    
    setStudents(students.map(student => 
      student.id === editingStudent.id ? editingStudent : student
    ));
    
    setIsEditDialogOpen(false);
    setEditingStudent(null);
    
    toast({
      title: "Aluno atualizado",
      description: "As informações do aluno foram atualizadas com sucesso.",
    });
  };

  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const getMinistryBadge = (ministry: string) => {
    const colors = {
      louvor: "default",
      marketing: "secondary",
      recepcao: "outline",
      obreiros: "destructive",
      jovens: "default",
      criancas: "secondary"
    };
    
    return (
      <Badge variant={colors[ministry as keyof typeof colors] as any}>
        {ministryLabels[ministry as keyof typeof ministryLabels]}
      </Badge>
    );
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
            <TableHead>Ministério</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={student.photo || ""} />
                  <AvatarFallback>
                    {student.firstName[0]}{student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                {student.firstName} {student.lastName}
              </TableCell>
              <TableCell>
                <a 
                  href={`https://wa.me/55${student.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                >
                  {student.whatsapp}
                </a>
              </TableCell>
              <TableCell>{calculateAge(student.birthDate)} anos</TableCell>
              <TableCell>{getMinistryBadge(student.ministryType)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedStudent?.firstName} {selectedStudent?.lastName}</DialogTitle>
                        <DialogDescription>
                          Detalhes do aluno
                        </DialogDescription>
                      </DialogHeader>
                      {selectedStudent && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={selectedStudent.photo || ""} />
                              <AvatarFallback className="text-lg">
                                {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                              {getMinistryBadge(selectedStudent.ministryType)}
                            </div>
                          </div>
                          <div>
                            <strong>WhatsApp:</strong> 
                            <a 
                              href={`https://wa.me/55${selectedStudent.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 hover:underline cursor-pointer ml-2"
                            >
                              {selectedStudent.whatsapp}
                            </a>
                          </div>
                          <div>
                            <strong>Data de Nascimento:</strong> {format(selectedStudent.birthDate, "dd/MM/yyyy")}
                          </div>
                          <div>
                            <strong>Idade:</strong> {calculateAge(selectedStudent.birthDate)} anos
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(student)}
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
                          Tem certeza que deseja remover {student.firstName} {student.lastName} do ministério? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(student.id)}>
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
      
      {students.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum aluno cadastrado nos ministérios
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription>
              Atualize as informações do aluno
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName">Nome</Label>
                  <Input
                    id="edit-firstName"
                    value={editingStudent.firstName}
                    onChange={(e) => setEditingStudent({...editingStudent, firstName: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-lastName">Sobrenome</Label>
                  <Input
                    id="edit-lastName"
                    value={editingStudent.lastName}
                    onChange={(e) => setEditingStudent({...editingStudent, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-whatsapp">WhatsApp</Label>
                <Input
                  id="edit-whatsapp"
                  value={editingStudent.whatsapp}
                  onChange={(e) => setEditingStudent({...editingStudent, whatsapp: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-birthDate">Data de Nascimento</Label>
                <Input
                  id="edit-birthDate"
                  type="date"
                  value={formatDateForInput(editingStudent.birthDate)}
                  onChange={(e) => setEditingStudent({...editingStudent, birthDate: new Date(e.target.value)})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-ministry">Ministério</Label>
                <Select 
                  value={editingStudent.ministryType} 
                  onValueChange={(value) => setEditingStudent({...editingStudent, ministryType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ministério" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="louvor">Louvor</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="recepcao">Recepção</SelectItem>
                    <SelectItem value="obreiros">Obreiros</SelectItem>
                    <SelectItem value="jovens">Jovens</SelectItem>
                    <SelectItem value="criancas">Crianças</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsList;