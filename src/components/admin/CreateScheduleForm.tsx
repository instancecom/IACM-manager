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

const scheduleSchema = z.object({
  scheduleType: z.string().min(1, "Tipo de escala é obrigatório"),
  date: z.date({ required_error: "Data é obrigatória" }),
  personName: z.string().min(1, "Nome da pessoa é obrigatório"),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

const scheduleTypes = [
  { value: "louvor", label: "Louvor" },
  { value: "marketing", label: "Marketing" },
  { value: "recepcao", label: "Recepção" },
  { value: "obreiros", label: "Obreiros" },
];

const CreateScheduleForm = () => {
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      scheduleType: "",
      personName: "",
    },
  });

  const onSubmit = (data: ScheduleFormData) => {
    console.log("Schedule data:", data);
    toast({
      title: "Escala criada com sucesso!",
      description: `${data.personName} foi escalado(a) para ${data.scheduleType} no dia ${format(data.date, "dd/MM/yyyy")}.`,
    });
    form.reset();
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
            <FormItem>
              <FormLabel>Nome da Pessoa</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome da pessoa escalada" {...field} />
              </FormControl>
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