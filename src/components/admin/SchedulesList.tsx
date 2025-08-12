import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Mock data - será substituído pela integração com o banco de dados
const mockSchedules = [
  {
    id: 1,
    scheduleType: "louvor",
    date: new Date("2025-08-24T19:00:00"),
    personName: "João Silva"
  },
  {
    id: 2,
    scheduleType: "recepcao",
    date: new Date("2025-08-25T09:00:00"),
    personName: "Maria Santos"
  },
  {
    id: 3,
    scheduleType: "marketing",
    date: new Date("2025-08-27T15:00:00"),
    personName: "Pedro Costa"
  },
  {
    id: 4,
    scheduleType: "obreiros",
    date: new Date("2025-08-30T18:00:00"),
    personName: "Ana Silva"
  }
];

const scheduleLabels = {
  louvor: "Louvor",
  marketing: "Marketing",
  recepcao: "Recepção",
  obreiros: "Obreiros"
};

const SchedulesList = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast({
      title: "Escala removida",
      description: "A escala foi removida com sucesso.",
    });
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule({ ...schedule });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingSchedule) {
      setSchedules(schedules.map(schedule => 
        schedule.id === editingSchedule.id ? editingSchedule : schedule
      ));
      setIsEditDialogOpen(false);
      setEditingSchedule(null);
      toast({
        title: "Escala atualizada",
        description: "A escala foi atualizada com sucesso.",
      });
    }
  };

  const formatDateTimeForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getScheduleBadge = (scheduleType: string) => {
    const colors = {
      louvor: "default",
      marketing: "secondary",
      recepcao: "outline",
      obreiros: "destructive"
    };
    
    return (
      <Badge variant={colors[scheduleType as keyof typeof colors] as any}>
        {scheduleLabels[scheduleType as keyof typeof scheduleLabels]}
      </Badge>
    );
  };

  const getStatusBadge = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduleDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (scheduleDate > today) {
      return <Badge variant="secondary">Próximo</Badge>;
    } else if (scheduleDate.getTime() === today.getTime()) {
      return <Badge variant="default">Hoje</Badge>;
    } else {
      return <Badge variant="outline">Finalizado</Badge>;
    }
  };

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
              <TableCell>{getScheduleBadge(schedule.scheduleType)}</TableCell>
              <TableCell>
                {format(schedule.date, "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="font-medium">{schedule.personName}</TableCell>
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
                            <strong>Tipo de Escala:</strong> {getScheduleBadge(selectedSchedule.scheduleType)}
                          </div>
                          <div>
                            <strong>Data:</strong> {format(selectedSchedule.date, "dd/MM/yyyy")}
                          </div>
                          <div>
                            <strong>Pessoa Escalada:</strong> {selectedSchedule.personName}
                          </div>
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
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover a escala de {scheduleLabels[schedule.scheduleType as keyof typeof scheduleLabels]} para {schedule.personName}? Esta ação não pode ser desfeita.
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
      
      {schedules.length === 0 && (
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
                  value={editingSchedule.scheduleType}
                  onValueChange={(value) => setEditingSchedule({
                    ...editingSchedule,
                    scheduleType: value
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
                <Label htmlFor="date">Data e Horário</Label>
                <Input
                  type="datetime-local"
                  value={formatDateTimeForInput(editingSchedule.date)}
                  onChange={(e) => setEditingSchedule({
                    ...editingSchedule,
                    date: new Date(e.target.value)
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="personName">Pessoa Escalada</Label>
                <Input
                  id="personName"
                  value={editingSchedule.personName}
                  onChange={(e) => setEditingSchedule({
                    ...editingSchedule,
                    personName: e.target.value
                  })}
                />
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

export default SchedulesList;