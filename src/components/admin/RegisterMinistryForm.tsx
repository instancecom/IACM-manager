import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Music, Plus } from "lucide-react";

const ministrySchema = z.object({
  name: z.string().min(1, "Nome do ministério é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
});

type MinistryFormData = z.infer<typeof ministrySchema>;

const RegisterMinistryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<MinistryFormData>({
    resolver: zodResolver(ministrySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: MinistryFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('ministries')
        .insert([
          {
            name: data.name,
            description: data.description,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Ministério cadastrado!",
        description: `${data.name} foi cadastrado com sucesso.`,
      });

      form.reset();
    } catch (error) {
      console.error('Erro ao cadastrar ministério:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o ministério. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Music className="w-5 h-5 text-primary" />
          <CardTitle>Cadastrar Novo Ministério</CardTitle>
        </div>
        <CardDescription>
          Cadastre um novo ministério na comunidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Ministério</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Louvor, Jovens, Marketing..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o propósito e atividades do ministério..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              {isLoading ? "Cadastrando..." : "Cadastrar Ministério"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterMinistryForm;