import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useMinistries } from "@/hooks/useMinistries";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  whatsapp: string;
  birth_date: string;
  photo_url: string | null;
  ministry_id: string;
  ministry_name: string;
  role: string;
}

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { ministries } = useMinistries();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ministry_members')
        .select(`
          id,
          role,
          member_id,
          ministry_id,
          members!inner (
            id,
            first_name,
            last_name,
            whatsapp,
            birth_date,
            photo_url
          ),
          ministries!inner (
            id,
            name
          )
        `);

      if (error) throw error;

      const formattedStudents: Student[] = data?.map((item: any) => ({
        id: item.member_id,
        first_name: item.members.first_name,
        last_name: item.members.last_name,
        whatsapp: item.members.whatsapp,
        birth_date: item.members.birth_date,
        photo_url: item.members.photo_url,
        ministry_id: item.ministry_id,
        ministry_name: item.ministries.name,
        role: item.role
      })) || [];

      setStudents(formattedStudents);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os alunos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId: string, ministryId: string) => {
    try {
      const { error } = await supabase
        .from('ministry_members')
        .delete()
        .eq('member_id', memberId)
        .eq('ministry_id', ministryId);

      if (error) throw error;

      setStudents(students.filter(student => 
        !(student.id === memberId && student.ministry_id === ministryId)
      ));
      
      toast({
        title: "Aluno removido",
        description: "O aluno foi removido do ministério com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent({ ...student });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    
    try {
      // Atualizar dados do membro
      const { error: memberError } = await supabase
        .from('members')
        .update({
          first_name: editingStudent.first_name,
          last_name: editingStudent.last_name,
          whatsapp: editingStudent.whatsapp,
          birth_date: editingStudent.birth_date,
        })
        .eq('id', editingStudent.id);

      if (memberError) throw memberError;

      // Atualizar ministério se mudou
      const { error: ministryError } = await supabase
        .from('ministry_members')
        .update({
          ministry_id: editingStudent.ministry_id,
          role: editingStudent.role
        })
        .eq('member_id', editingStudent.id);

      if (ministryError) throw ministryError;

      // Atualizar estado local
      setStudents(students.map(student => 
        student.id === editingStudent.id ? editingStudent : student
      ));
      
      setIsEditDialogOpen(false);
      setEditingStudent(null);
      
      toast({
        title: "Aluno atualizado",
        description: "As informações do aluno foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o aluno.",
        variant: "destructive",
      });
    }
  };

  const formatDateForInput = (dateString: string) => {
    return dateString;
  };

  const getMinistryBadge = (ministryName: string) => {
    return (
      <Badge variant="default">
        {ministryName}
      </Badge>
    );
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
        <span className="ml-2">Carregando alunos...</span>
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
            <TableHead>Ministério</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={`${student.id}-${student.ministry_id}`}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={student.photo_url || ""} />
                  <AvatarFallback>
                    {student.first_name[0]}{student.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                {student.first_name} {student.last_name}
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
              <TableCell>{calculateAge(student.birth_date)} anos</TableCell>
              <TableCell>{getMinistryBadge(student.ministry_name)}</TableCell>
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
                        <DialogTitle>{selectedStudent?.first_name} {selectedStudent?.last_name}</DialogTitle>
                        <DialogDescription>
                          Detalhes do aluno
                        </DialogDescription>
                      </DialogHeader>
                      {selectedStudent && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={selectedStudent.photo_url || ""} />
                              <AvatarFallback className="text-lg">
                                {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{selectedStudent.first_name} {selectedStudent.last_name}</h3>
                              {getMinistryBadge(selectedStudent.ministry_name)}
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
                            <strong>Data de Nascimento:</strong> {format(new Date(selectedStudent.birth_date), "dd/MM/yyyy")}
                          </div>
                          <div>
                            <strong>Idade:</strong> {calculateAge(selectedStudent.birth_date)} anos
                          </div>
                          <div>
                            <strong>Função:</strong> {selectedStudent.role}
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
                          Tem certeza que deseja remover {student.first_name} {student.last_name} do ministério? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(student.id, student.ministry_id)}>
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
                      value={editingStudent.first_name}
                      onChange={(e) => setEditingStudent({...editingStudent, first_name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-lastName">Sobrenome</Label>
                    <Input
                      id="edit-lastName"
                      value={editingStudent.last_name}
                      onChange={(e) => setEditingStudent({...editingStudent, last_name: e.target.value})}
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
                    value={formatDateForInput(editingStudent.birth_date)}
                    onChange={(e) => setEditingStudent({...editingStudent, birth_date: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-ministry">Ministério</Label>
                  <Select 
                    value={editingStudent.ministry_id} 
                    onValueChange={(value) => {
                      const ministry = ministries.find(m => m.id === value);
                      setEditingStudent({
                        ...editingStudent, 
                        ministry_id: value,
                        ministry_name: ministry?.name || ''
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ministério" />
                    </SelectTrigger>
                    <SelectContent>
                      {ministries.map((ministry) => (
                        <SelectItem key={ministry.id} value={ministry.id}>
                          {ministry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-role">Função</Label>
                  <Select 
                    value={editingStudent.role} 
                    onValueChange={(value) => setEditingStudent({...editingStudent, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Aluno</SelectItem>
                      <SelectItem value="leader">Líder</SelectItem>
                      <SelectItem value="coordinator">Coordenador</SelectItem>
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