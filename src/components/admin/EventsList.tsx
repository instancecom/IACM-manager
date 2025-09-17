import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Eye } from "lucide-react";
import { getEventStatus, formatEventDateTimeRange } from "@/lib/eventUtils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useEvents, type Event } from "@/hooks/useEvents";

const EventsList = () => {
  const { events, loading, fetchEvents, deleteEvent, updateEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent({ ...event });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;
    
    const success = await updateEvent(editingEvent.id, {
      title: editingEvent.title,
      address: editingEvent.address,
      start_date: editingEvent.start_date,
      start_time: editingEvent.start_time,
      end_date: editingEvent.end_date,
      end_time: editingEvent.end_time,
      description: editingEvent.description,
    });

    if (success) {
      setIsEditDialogOpen(false);
      setEditingEvent(null);
    }
  };

  const getStatusBadge = (startDate: string, startTime: string, endDate: string, endTime: string) => {
    const eventStatus = getEventStatus(startDate, startTime, endDate, endTime);
    
    const variantMap = {
      upcoming: "secondary" as const,
      active: "default" as const,
      finished: "outline" as const
    };

    return <Badge variant={variantMap[eventStatus.status]}>{eventStatus.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Carregando eventos...</p>
      </div>
    );
  }

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
                {formatEventDateTimeRange(event.start_date, event.start_time, event.end_date, event.end_time)}
              </TableCell>
              <TableCell>{event.address}</TableCell>
              <TableCell>{getStatusBadge(event.start_date, event.start_time, event.end_date, event.end_time)}</TableCell>
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
                            <strong>Data/Hora Início:</strong> {format(new Date(`${selectedEvent.start_date}T${selectedEvent.start_time}`), "dd/MM/yyyy 'às' HH:mm")}
                          </div>
                          <div>
                            <strong>Data/Hora Fim:</strong> {format(new Date(`${selectedEvent.end_date}T${selectedEvent.end_time}`), "dd/MM/yyyy 'às' HH:mm")}
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
                <Label htmlFor="edit-start-date">Data de Início</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={editingEvent.start_date}
                  onChange={(e) => setEditingEvent({...editingEvent, start_date: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-start-time">Hora de Início</Label>
                <Input
                  id="edit-start-time"
                  type="time"
                  value={editingEvent.start_time}
                  onChange={(e) => setEditingEvent({...editingEvent, start_time: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-end-date">Data de Fim</Label>
                <Input
                  id="edit-end-date"
                  type="date"
                  value={editingEvent.end_date}
                  onChange={(e) => setEditingEvent({...editingEvent, end_date: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-end-time">Hora de Fim</Label>
                <Input
                  id="edit-end-time"
                  type="time"
                  value={editingEvent.end_time}
                  onChange={(e) => setEditingEvent({...editingEvent, end_time: e.target.value})}
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