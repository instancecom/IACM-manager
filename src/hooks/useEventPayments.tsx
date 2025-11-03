import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EventPayment {
  id: string;
  confirmation_id: string;
  payment_type: string;
  payment_date: string;
  amount: number;
  created_at: string;
}

export interface PaymentData {
  payment_type: string;
  payment_date: string;
  amount: number;
}

export const useEventPayments = () => {
  const [payments, setPayments] = useState<EventPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (confirmationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('event_payments')
        .select('*')
        .eq('confirmation_id', confirmationId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (confirmationId: string, paymentData: PaymentData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('event_payments')
        .insert({
          confirmation_id: confirmationId,
          ...paymentData,
        })
        .select()
        .single();

      if (error) throw error;

      // Calculate total paid
      const { data: allPayments } = await supabase
        .from('event_payments')
        .select('amount')
        .eq('confirmation_id', confirmationId);

      const totalPaid = (allPayments || []).reduce((sum, p) => sum + Number(p.amount), 0) + Number(paymentData.amount);

      // Get confirmation to check total amount
      const { data: confirmation } = await supabase
        .from('event_confirmations')
        .select('total_amount')
        .eq('id', confirmationId)
        .single();

      const totalAmount = Number(confirmation?.total_amount || 0);
      const isPaid = totalPaid >= totalAmount;

      // Update confirmation paid status
      await supabase
        .from('event_confirmations')
        .update({ paid: isPaid })
        .eq('id', confirmationId);

      toast.success('Pagamento registrado com sucesso!');
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao registrar pagamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId: string, confirmationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('event_payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      // Recalculate total paid
      const { data: allPayments } = await supabase
        .from('event_payments')
        .select('amount')
        .eq('confirmation_id', confirmationId);

      const totalPaid = (allPayments || []).reduce((sum, p) => sum + Number(p.amount), 0);

      // Get confirmation to check total amount
      const { data: confirmation } = await supabase
        .from('event_confirmations')
        .select('total_amount')
        .eq('id', confirmationId)
        .single();

      const totalAmount = Number(confirmation?.total_amount || 0);
      const isPaid = totalPaid >= totalAmount;

      // Update confirmation paid status
      await supabase
        .from('event_confirmations')
        .update({ paid: isPaid })
        .eq('id', confirmationId);

      toast.success('Pagamento removido com sucesso!');
      await fetchPayments(confirmationId);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao remover pagamento');
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    fetchPayments,
    addPayment,
    deletePayment,
  };
};
