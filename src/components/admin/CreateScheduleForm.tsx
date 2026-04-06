import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUnifiedProfiles, UnifiedProfile } from "@/hooks/useUnifiedProfiles";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";

const scheduleSchema = z.object({
  scheduleType: z.string().min(1, "Tipo de escala é obrigatório"),
  date: z.date({ required_error: "Data é obrigatória" }),
  personName: z.string().min(1, "Pessoa é obrigatória"),
  memberId: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

const scheduleTypes = [
  { value: "louvor", label: "Louvor" },
  { value: "marketing", label: "Marketing" },
  { value: "recepcao", label: "Recepção" },
  { value: "obreiros", label: "Obreiros" },
];

const CreateScheduleForm = () => {
  const { profiles, loading: loadingProfiles } = useUnifiedProfiles();
  const [open, setOpen] = useState(false);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      scheduleType: "",
      personName: "",
      memberId: "",
    },
  });

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .insert({
          schedule_type: data.scheduleType as any,
          date: data.date.toISOString().split('T')[0],
          member_id: data.memberId || null,
          external_person_name: !data.memberId ? data.personName : null,
        });

      if (error) {
        toast({
          title: "Erro ao criar escala",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Escala criada com sucesso!",
        description: `${data.personName} foi escalado(a) para ${data.scheduleType} no dia ${format(data.date, "dd/MM/yyyy")}.`,
      });
      form.reset();
      
      // Refresh the page to show updated schedule list
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
        <FormField
          control={form.control}
          name="scheduleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Escala</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de escala" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {scheduleTypes.map((schedule) => (
                    <SelectItem key={schedule.value} value={schedule.value}>
                      {schedule.label}
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Escala</FormLabel>
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
                    disabled={(date) => date < new Date()}
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
          name="personName"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Pessoa Escalada</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value || "Buscar pessoa ou digitar novo nome..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Buscar pessoa..." 
                      onValueChange={(val) => {
                        // Se não encontrar na lista, permite usar o que foi digitado
                        field.onChange(val);
                        form.setValue("memberId", "");
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>
                        Nenhum cadastro encontrado. Pressione Enter para usar "<strong>{field.value}</strong>" como convidado externo.
                      </CommandEmpty>
                      <CommandGroup heading="Pessoas Cadastradas">
                        {profiles.map((profile) => (
                          <CommandItem
                            key={profile.member_id || profile.id}
                            value={`${profile.first_name} ${profile.last_name}`}
                            onSelect={() => {
                              const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
                              field.onChange(fullName);
                              form.setValue("memberId", profile.member_id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.getValues("memberId") === profile.member_id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{profile.first_name} {profile.last_name}</span>
                                {profile.isManual && (
                                  <Badge variant="outline" className="text-[10px] h-4 bg-muted/30 text-muted-foreground border-muted-foreground/20">
                                    Sem conta
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {profile.phone || profile.email || 'Sem contato'}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Criar Escala
        </Button>
      </form>
    </Form>
  );
};

export default CreateScheduleForm;