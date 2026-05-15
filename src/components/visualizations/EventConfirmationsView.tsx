import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Users, CalendarDays, Check, X, Eye, UserCheck, DollarSign, Trash2, Plus } from "lucide-react";
import { useEventConfirmations } from "@/hooks/useEventConfirmations";
import { useToast } from "@/hooks/use-toast";
import { useEventPayments } from "@/hooks/useEventPayments";
import { useEvents } from "@/hooks/useEvents";
import { useRoles } from "@/hooks/useRoles";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventConfirmationData {
  id: string;
  participant_name: string | null;
  responsible_name: string | null;
  whatsapp: string | null;
  guests: string[] | null;
  confirmed: boolean;
  confirmed_at?: string;
  paid: boolean;
  total_amount: number | null;
}

const EventConfirmationsView = () => {
  const { events, loading: eventsLoading } = useEvents();
  const { updateTotalAmount, deleteConfirmation } = useEventConfirmations();
  const { payments, fetchPayments, addPayment, deletePayment } = useEventPayments();
  const { canEdit } = useRoles();
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [confirmations, setConfirmations] = useState<EventConfirmationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConfirmation, setSelectedConfirmation] = useState<EventConfirmationData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isTotalAmountDialogOpen, setIsTotalAmountDialogOpen] = useState(false);
  const [paymentConfirmation, setPaymentConfirmation] = useState<EventConfirmationData | null>(null);
  const [newPaymentType, setNewPaymentType] = useState("");
  const [newPaymentDate, setNewPaymentDate] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [totalAmountInput, setTotalAmountInput] = useState("");

  const fetchEventConfirmations = async (eventId: string) => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const { data: confirmationData, error } = await supabase
        .from('event_confirmations')
        .select('*')
        .eq('event_id', eventId)
        .order('confirmed_at', { ascending: false });

      if (error) throw error;

      const confirmationsData: EventConfirmationData[] = confirmationData?.map(conf => ({
        id: conf.id,
        participant_name: conf.participant_name,
        responsible_name: conf.responsible_name,
        whatsapp: conf.whatsapp,
        guests: conf.guests,
        confirmed: conf.confirmed,
        confirmed_at: conf.confirmed_at,
        paid: conf.paid || false,
        total_amount: conf.total_amount
      })) || [];

      setConfirmations(confirmationsData);
    } catch (error) {
      console.error('Erro ao buscar confirmações:', error);
      setConfirmations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchEventConfirmations(selectedEventId);
    }
  }, [selectedEventId]);

  // Keep paymentConfirmation in sync with latest confirmations data
  useEffect(() => {
    if (paymentConfirmation) {
      const updated = confirmations.find(c => c.id === paymentConfirmation.id);
      if (updated) {
        setPaymentConfirmation(updated);
      }
    }
  }, [confirmations]);

  const openPaymentDialog = async (confirmation: EventConfirmationData) => {
    setPaymentConfirmation(confirmation);
    setNewPaymentType("");
    setNewPaymentDate("");
    setNewPaymentAmount("");
    setIsPaymentDialogOpen(true);
    await fetchPayments(confirmation.id);
  };

  const openTotalAmountDialog = (confirmation: EventConfirmationData) => {
    setPaymentConfirmation(confirmation);
    setTotalAmountInput(confirmation.total_amount?.toString() || "");
    setIsTotalAmountDialogOpen(true);
  };

  const handleAddPayment = async () => {
    if (!paymentConfirmation || !newPaymentType || !newPaymentDate || !newPaymentAmount) return;

    try {
      await addPayment(paymentConfirmation.id, {
        payment_type: newPaymentType,
        payment_date: newPaymentDate,
        amount: parseFloat(newPaymentAmount),
      });

      setNewPaymentType("");
      setNewPaymentDate("");
      setNewPaymentAmount("");
      await fetchEventConfirmations(selectedEventId!);
      await fetchPayments(paymentConfirmation.id);
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!paymentConfirmation) return;

    try {
      await deletePayment(paymentId, paymentConfirmation.id);
      await fetchEventConfirmations(selectedEventId!);
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleUpdateTotalAmount = async () => {
    if (!paymentConfirmation || !totalAmountInput) return;

    try {
      const newAmount = parseFloat(totalAmountInput);
      await updateTotalAmount(paymentConfirmation.id, newAmount);
      setPaymentConfirmation(prev => prev ? { ...prev, total_amount: newAmount } : null);
      setIsTotalAmountDialogOpen(false);
      await fetchEventConfirmations(selectedEventId!);
    } catch (error) {
      console.error("Error updating total amount:", error);
    }
  };

  const calculateTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  };

  const calculateRemaining = () => {
    const total = Number(paymentConfirmation?.total_amount || 0);
    const paid = calculateTotalPaid();
    return Math.max(0, total - paid);
  };

  const confirmedCount = confirmations.filter(conf => conf.confirmed).length;
  const totalCount = confirmations.length;

  const selectedEvent = events.find(event => event.id === selectedEventId);

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando eventos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Selecione um evento:
          </label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha um evento para ver as confirmações" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(event.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Event Info and Stats */}
      {selectedEvent && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-card-foreground">
                  {selectedEvent.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(selectedEvent.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedEvent.start_time}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {confirmedCount}/{totalCount} confirmados
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Confirmations List */}
      {selectedEventId && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Carregando confirmações...</span>
            </div>
          ) : confirmations.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Nenhuma confirmação encontrada para este evento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {confirmations.map((confirmation) => (
                <Card 
                  key={confirmation.id} 
                  className="border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedConfirmation(confirmation);
                    setIsPreviewOpen(true);
                  }}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {confirmation.participant_name?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-card-foreground text-sm sm:text-base truncate">
                            {confirmation.participant_name || 'Sem nome'}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            WhatsApp: {confirmation.whatsapp || 'Não informado'}
                          </p>
                          {confirmation.guests && confirmation.guests.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="text-[10px] font-medium text-muted-foreground uppercase mr-1 flex items-center">
                                <Users className="h-2.5 w-2.5 mr-1" />
                                Convidados:
                              </span>
                              {confirmation.guests.map((guest, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-1.5 h-4 bg-muted/80 text-muted-foreground border-none">
                                  {guest}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {confirmation.confirmed_at && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {format(new Date(confirmation.confirmed_at), "dd/MM/yy HH:mm", { locale: ptBR })}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          {confirmation.confirmed ? (
                            <Badge className="bg-green-600 text-white hover:bg-green-700 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Confirmado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-300 text-red-600 text-xs">
                              <X className="h-3 w-3 mr-1" />
                              Não confirmado
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {canEdit && (
                            <>
                              <Button
                                size="sm"
                                variant={confirmation.paid ? "default" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPaymentDialog(confirmation);
                                }}
                                className="gap-1 h-8 text-xs px-2 sm:px-3"
                              >
                                <DollarSign className="h-3 w-3" />
                                <span className="hidden xs:inline">{confirmation.paid ? "Pago" : "Registrar pagamento"}</span>
                                <span className="xs:hidden">{confirmation.paid ? "Pago" : "Registrar"}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Tem certeza que deseja excluir esta confirmação?')) {
                                    deleteConfirmation(confirmation.id).then(() => {
                                      fetchEventConfirmations(selectedEventId);
                                    });
                                  }
                                }}
                                className="gap-1 h-8 text-xs px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="hidden sm:inline">Excluir</span>
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Confirmação</DialogTitle>
          </DialogHeader>
          
          {selectedConfirmation && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {selectedConfirmation.participant_name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground">
                    {selectedConfirmation.participant_name || 'Sem nome'}
                  </h3>
                  {selectedConfirmation.whatsapp && (
                    <a 
                      href={`https://wa.me/55${selectedConfirmation.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:text-green-700 hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      WhatsApp: {selectedConfirmation.whatsapp}
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                {selectedConfirmation.responsible_name && (
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-muted-foreground block">Responsável:</span>
                      <span className="text-sm text-card-foreground">{selectedConfirmation.responsible_name}</span>
                    </div>
                  </div>
                )}

                {selectedConfirmation.guests && selectedConfirmation.guests.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-muted-foreground block">
                        Convidados ({selectedConfirmation.guests.length}):
                      </span>
                      <ul className="text-sm text-card-foreground list-disc list-inside">
                        {selectedConfirmation.guests.map((guest, index) => (
                          <li key={index}>{guest}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  {selectedConfirmation.confirmed ? (
                    <Badge className="bg-green-600 text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Confirmado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-300 text-red-600">
                      <X className="h-3 w-3 mr-1" />
                      Não confirmado
                    </Badge>
                  )}
                </div>

                {selectedConfirmation.confirmed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Confirmado em:</span>
                    <span className="text-sm text-card-foreground">
                      {format(new Date(selectedConfirmation.confirmed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                )}

                {canEdit && (
                  <>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm font-medium text-muted-foreground">Pagamento:</span>
                      <Badge variant={selectedConfirmation.paid ? "default" : "outline"}>
                        {selectedConfirmation.paid ? "✓ Pago" : "Não pago"}
                      </Badge>
                    </div>
                  </>
                )}

                {selectedEvent && (
                  <div className="space-y-2 pt-3 border-t">
                    <h4 className="text-sm font-medium text-card-foreground">Evento:</h4>
                    <p className="text-sm text-muted-foreground">{selectedEvent.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(selectedEvent.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedEvent.start_time}
                    </p>
                  </div>
                )}

                {canEdit && (
                  <div className="pt-3 border-t">
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja excluir esta confirmação?')) {
                          deleteConfirmation(selectedConfirmation.id).then(() => {
                            setIsPreviewOpen(false);
                            fetchEventConfirmations(selectedEventId);
                          });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir Confirmação
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Controle de Pagamentos</DialogTitle>
          </DialogHeader>
          
          {paymentConfirmation && (
            <div className="space-y-6">
              {/* Participant Info */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {paymentConfirmation.participant_name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">
                    {paymentConfirmation.participant_name || 'Sem nome'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentConfirmation.whatsapp || 'Sem WhatsApp'}
                  </p>
                </div>
              </div>

              {/* Total Amount Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-card-foreground">Valor Total a Pagar</h4>
                    <p className="text-2xl font-bold text-primary">
                      R$ {(paymentConfirmation.total_amount || 0).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTotalAmountDialog(paymentConfirmation)}
                  >
                    Definir Valor
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Pago</p>
                    <p className="text-lg font-semibold text-green-600">
                      R$ {calculateTotalPaid().toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Restante</p>
                    <p className="text-lg font-semibold text-orange-600">
                      R$ {calculateRemaining().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payments List */}
              <div className="space-y-3">
                <h4 className="font-medium text-card-foreground">Histórico de Pagamentos</h4>
                {payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum pagamento registrado ainda
                  </p>
                ) : (
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground capitalize">
                            {payment.payment_type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(payment.payment_date), "dd/MM/yyyy")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-green-600">
                            R$ {Number(payment.amount).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Add New Payment Form */}
              <div className="space-y-4">
                <h4 className="font-medium text-card-foreground flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Pagamento
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="new-payment-type">Tipo</Label>
                    <Select value={newPaymentType} onValueChange={setNewPaymentType}>
                      <SelectTrigger id="new-payment-type">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cartao">Cartão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-payment-date">Data</Label>
                    <Input
                      id="new-payment-date"
                      type="date"
                      value={newPaymentDate}
                      onChange={(e) => setNewPaymentDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-payment-amount">Valor</Label>
                    <Input
                      id="new-payment-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newPaymentAmount}
                      onChange={(e) => setNewPaymentAmount(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddPayment}
                  disabled={!newPaymentType || !newPaymentDate || !newPaymentAmount}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pagamento
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Total Amount Dialog */}
      <Dialog open={isTotalAmountDialogOpen} onOpenChange={setIsTotalAmountDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Definir Valor Total</DialogTitle>
          </DialogHeader>
          
          {paymentConfirmation && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {paymentConfirmation.participant_name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-card-foreground">
                    {paymentConfirmation.participant_name || 'Sem nome'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total-amount">Valor Total a Pagar</Label>
                <Input
                  id="total-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={totalAmountInput}
                  onChange={(e) => setTotalAmountInput(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTotalAmountDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateTotalAmount}
              disabled={!totalAmountInput}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventConfirmationsView;
