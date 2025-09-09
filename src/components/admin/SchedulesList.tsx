import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Eye, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSchedules } from "@/hooks/useSchedules";
import { supabase } from "@/integrations/supabase/client";

const scheduleLabels = {
  louvor: "Louvor",
  marketing: "Marketing",
  recepcao: "Recepção",
  obreiros: "Obreiros"
};

interface Schedule {
  id: string;
  schedule_type: string;
  date: string;
  member_id?: string;
  external_person_name?: string;
  external_person_phone?: string;
  notes?: string;
  members?: {
    first_name: string;
    last_name: string;
    whatsapp: string;
    photo_url?: string;
  };
}

const SchedulesList = () => {
  const { schedules, loading, error, refetch } = useSchedules();
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Escala removida",
        description: "A escala foi removida com sucesso.",
      });
      
      refetch();
    } catch (err) {
      console.error('Error deleting schedule:', err);
      toast({
        title: "Erro",
        description: "Erro ao remover a escala. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule({ ...schedule });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSchedule) return;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('schedules')
        .update({
          schedule_type: editingSchedule.schedule_type as any,
          date: editingSchedule.date,
          external_person_name: editingSchedule.external_person_name,
          external_person_phone: editingSchedule.external_person_phone,
          notes: editingSchedule.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSchedule.id);

      if (error) throw error;

      setIsEditDialogOpen(false);
      setEditingSchedule(null);
      toast({
        title: "Escala atualizada",
        description: "A escala foi atualizada com sucesso.",
      });
      
      refetch();
    } catch (err) {
      console.error('Error updating schedule:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar a escala. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getScheduleBadge = (scheduleType: string) => {
    const colors: Record<string, string> = {
      louvor: "default",
      marketing: "secondary",
      recepcao: "outline",
      obreiros: "destructive"
    };
    
    return (
      <Badge variant={colors[scheduleType] as any}>
        {scheduleLabels[scheduleType as keyof typeof scheduleLabels] || scheduleType}
      </Badge>
    );
  };

  const getStatusBadge = (dateString: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduleDate = new Date(dateString);
    const scheduleDateOnly = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate());
    
    if (scheduleDateOnly > today) {
      return <Badge variant="secondary">Próximo</Badge>;
    } else if (scheduleDateOnly.getTime() === today.getTime()) {
      return <Badge variant="default">Hoje</Badge>;
    } else {
      return <Badge variant="outline">Finalizado</Badge>;
    }
  };

  const getPersonName = (schedule: Schedule) => {
    if (schedule.members) {
      return `${schedule.members.first_name} ${schedule.members.last_name}`;
    }
    return schedule.external_person_name || "Não definido";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Carregando escalas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Erro ao carregar escalas: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo de Escala</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Pessoa Escalada</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{getScheduleBadge(schedule.schedule_type)}</TableCell>
              <TableCell>
                {format(new Date(schedule.date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="font-medium">{getPersonName(schedule)}</TableCell>
              <TableCell>{getStatusBadge(schedule.date)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSchedule(schedule)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Detalhes da Escala</DialogTitle>
                        <DialogDescription>
                          Informações completas da escala
                        </DialogDescription>
                      </DialogHeader>
                      {selectedSchedule && (
                        <div className="space-y-4">
                          <div>
                            <strong>Tipo de Escala:</strong> {getScheduleBadge(selectedSchedule.schedule_type)}
                          </div>
                          <div>
                            <strong>Data:</strong> {format(new Date(selectedSchedule.date), "dd/MM/yyyy")}
                          </div>
                          <div>
                            <strong>Pessoa Escalada:</strong> {getPersonName(selectedSchedule)}
                          </div>
                          {selectedSchedule.external_person_phone && (
                            <div>
                              <strong>Telefone:</strong> {selectedSchedule.external_person_phone}
                            </div>
                          )}
                          {selectedSchedule.notes && (
                            <div>
                              <strong>Observações:</strong> {selectedSchedule.notes}
                            </div>
                          )}
                          <div>
                            <strong>Status:</strong> {getStatusBadge(selectedSchedule.date)}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(schedule)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isDeleting === schedule.id}>
                        {isDeleting === schedule.id ? (
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
                          Tem certeza que deseja remover a escala de {scheduleLabels[schedule.schedule_type as keyof typeof scheduleLabels]} para {getPersonName(schedule)}? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(schedule.id)}>
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
      
      {schedules.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma escala cadastrada
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Escala</DialogTitle>
            <DialogDescription>
              Altere as informações da escala abaixo.
            </DialogDescription>
          </DialogHeader>
          {editingSchedule && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="scheduleType">Tipo de Escala</Label>
                <Select
                  value={editingSchedule.schedule_type}
                  onValueChange={(value) => setEditingSchedule({
                    ...editingSchedule,
                    schedule_type: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de escala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="louvor">Louvor</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="recepcao">Recepção</SelectItem>
                    <SelectItem value="obreiros">Obreiros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  value={formatDateTimeForInput(editingSchedule.date)}
                  onChange={(e) => setEditingSchedule({
                    ...editingSchedule,
                    date: e.target.value
                  })}
                />
              </div>
              {!editingSchedule.member_id && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="personName">Nome da Pessoa</Label>
                    <Input
                      id="personName"
                      value={editingSchedule.external_person_name || ""}
                      onChange={(e) => setEditingSchedule({
                        ...editingSchedule,
                        external_person_name: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="personPhone">Telefone</Label>
                    <Input
                      id="personPhone"
                      value={editingSchedule.external_person_phone || ""}
                      onChange={(e) => setEditingSchedule({
                        ...editingSchedule,
                        external_person_phone: e.target.value
                      })}
                    />
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  value={editingSchedule.notes || ""}
                  onChange={(e) => setEditingSchedule({
                    ...editingSchedule,
                    notes: e.target.value
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

export default SchedulesList;