import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

// Mock data - será substituído pela integração com o banco de dados
const mockEvents = [
  {
    id: 1,
    title: "Culto de Domingo",
    address: "Rua das Flores, 123",
    startDate: new Date("2025-08-24T19:00:00"),
    endDate: new Date("2025-08-24T21:00:00"),
    description: "Culto especial de domingo com adoração e palavra.",
    banner: "banner1.jpg"
  },
  {
    id: 2,
    title: "Encontro de Jovens",
    address: "Sala de Jovens",
    startDate: new Date("2025-08-27T15:00:00"),
    endDate: new Date("2025-08-27T17:00:00"),
    description: "Encontro especial para os jovens da comunidade.",
    banner: "banner2.jpg"
  }
];

const EventsList = () => {
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Evento excluído",
      description: "O evento foi removido com sucesso.",
    });
  };

  const handleEdit = (event: any) => {
    setEditingEvent({ ...event });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingEvent) return;
    
    setEvents(events.map(event => 
      event.id === editingEvent.id ? editingEvent : event
    ));
    
    setIsEditDialogOpen(false);
    setEditingEvent(null);
    
    toast({
      title: "Evento atualizado",
      description: "As informações do evento foram atualizadas com sucesso.",
    });
  };

  const formatDateTimeForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const getStatusBadge = (startDate: Date) => {
    const now = new Date();
    if (startDate > now) {
      return <Badge variant="secondary">Próximo</Badge>;
    } else if (startDate.toDateString() === now.toDateString()) {
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
            <TableHead>Título</TableHead>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>
                {format(event.startDate, "dd/MM/yyyy 'às' HH:mm")}
              </TableCell>
              <TableCell>{event.address}</TableCell>
              <TableCell>{getStatusBadge(event.startDate)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                        <DialogDescription>
                          Detalhes do evento
                        </DialogDescription>
                      </DialogHeader>
                      {selectedEvent && (
                        <div className="space-y-4">
                          <div>
                            <strong>Endereço:</strong> {selectedEvent.address}
                          </div>
                          <div>
                            <strong>Data/Hora Início:</strong> {format(selectedEvent.startDate, "dd/MM/yyyy 'às' HH:mm")}
                          </div>
                          <div>
                            <strong>Data/Hora Fim:</strong> {format(selectedEvent.endDate, "dd/MM/yyyy 'às' HH:mm")}
                          </div>
                          <div>
                            <strong>Descrição:</strong> {selectedEvent.description}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(event)}
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
                          Tem certeza que deseja excluir o evento "{event.title}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(event.id)}>
                          Excluir
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
      
      {events.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum evento cadastrado
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>
              Atualize as informações do evento
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Título do Evento</Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-address">Endereço</Label>
                <Input
                  id="edit-address"
                  value={editingEvent.address}
                  onChange={(e) => setEditingEvent({...editingEvent, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start">Data/Hora Início</Label>
                  <Input
                    id="edit-start"
                    type="datetime-local"
                    value={formatDateTimeForInput(editingEvent.startDate)}
                    onChange={(e) => setEditingEvent({...editingEvent, startDate: new Date(e.target.value)})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-end">Data/Hora Fim</Label>
                  <Input
                    id="edit-end"
                    type="datetime-local"
                    value={formatDateTimeForInput(editingEvent.endDate)}
                    onChange={(e) => setEditingEvent({...editingEvent, endDate: new Date(e.target.value)})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  rows={3}
                />
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

export default EventsList;