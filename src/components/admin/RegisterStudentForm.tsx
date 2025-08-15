import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMinistries } from "@/hooks/useMinistries";

const studentSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  whatsapp: z.string().min(1, "WhatsApp é obrigatório"),
  birthDate: z.date({ required_error: "Data de nascimento é obrigatória" }),
  ministryId: z.string().min(1, "Ministério é obrigatório"),
  role: z.string().min(1, "Função é obrigatória"),
});

type StudentFormData = z.infer<typeof studentSchema>;

const RegisterStudentForm = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const { ministries, loading: loadingMinistries } = useMinistries();

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      whatsapp: "",
      ministryId: "",
      role: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      // First, create the member
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          birth_date: data.birthDate.toISOString().split('T')[0],
          whatsapp: data.whatsapp,
        })
        .select()
        .single();

      if (memberError) {
        toast({
          title: "Erro ao cadastrar membro",
          description: memberError.message,
          variant: "destructive",
        });
        return;
      }

      // Then, add them to the ministry
      const { error: ministryError } = await supabase
        .from('ministry_members')
        .insert({
          member_id: memberData.id,
          ministry_id: data.ministryId,
          role: data.role,
        });

      if (ministryError) {
        toast({
          title: "Erro ao adicionar ao ministério",
          description: ministryError.message,
          variant: "destructive",
        });
        return;
      }

      const selectedMinistry = ministries.find(m => m.id === data.ministryId);
      toast({
        title: "Membro cadastrado com sucesso!",
        description: `${data.firstName} ${data.lastName} foi adicionado ao ministério ${selectedMinistry?.name} como ${data.role}.`,
      });
      form.reset();
      setPhoto(null);
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o sobrenome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Nascimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ministryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ministério</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ministério" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ministries.map((ministry) => (
                      <SelectItem key={ministry.id} value={ministry.id}>
                        {ministry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Líder">Líder</SelectItem>
                    <SelectItem value="Vice-Líder">Vice-Líder</SelectItem>
                    <SelectItem value="Membro">Membro</SelectItem>
                    <SelectItem value="Estudante">Estudante</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Foto do Aluno</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {photo ? photo.name : "Clique para fazer upload da foto"}
              </p>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loadingMinistries}>
          {loadingMinistries ? "Carregando..." : "Cadastrar Membro no Ministério"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterStudentForm;