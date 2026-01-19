import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMinistries } from "@/hooks/useMinistries";
import { useProfiles } from "@/hooks/useProfiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

// Schema for new member registration
const newMemberSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  whatsapp: z.string().min(1, "WhatsApp é obrigatório"),
  birthDate: z.date({ required_error: "Data de nascimento é obrigatória" }),
  ministryId: z.string().min(1, "Ministério é obrigatório"),
  role: z.string().min(1, "Função é obrigatória"),
});

// Schema for existing user selection
const existingUserSchema = z.object({
  userId: z.string().min(1, "Selecione um usuário"),
  ministryId: z.string().min(1, "Ministério é obrigatório"),
  role: z.string().min(1, "Função é obrigatória"),
});

type NewMemberFormData = z.infer<typeof newMemberSchema>;
type ExistingUserFormData = z.infer<typeof existingUserSchema>;

const RegisterStudentForm = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>("existing");
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  
  const { ministries, loading: loadingMinistries, fetchMinistries } = useMinistries();
  const { profiles, loading: loadingProfiles, refetch: refetchProfiles } = useProfiles();

  // Form for new member
  const newMemberForm = useForm<NewMemberFormData>({
    resolver: zodResolver(newMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      whatsapp: "",
      ministryId: "",
      role: "",
    },
  });

  // Form for existing user
  const existingUserForm = useForm<ExistingUserFormData>({
    resolver: zodResolver(existingUserSchema),
    defaultValues: {
      userId: "",
      ministryId: "",
      role: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  // Submit for new member (manual registration)
  const onNewMemberSubmit = async (data: NewMemberFormData) => {
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
      newMemberForm.reset();
      setPhoto(null);
      fetchMinistries();
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  // Submit for existing user (user with account)
  const onExistingUserSubmit = async (data: ExistingUserFormData) => {
    try {
      const selectedProfile = profiles.find(p => p.user_id === data.userId);
      
      if (!selectedProfile) {
        toast({
          title: "Erro",
          description: "Usuário não encontrado.",
          variant: "destructive",
        });
        return;
      }

      // First check if user already has a member record
      const { data: existingMember, error: checkMemberError } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', data.userId)
        .maybeSingle();

      if (checkMemberError) {
        toast({
          title: "Erro ao verificar",
          description: checkMemberError.message,
          variant: "destructive",
        });
        return;
      }

      let memberId: string;

      if (existingMember) {
        // Use existing member record
        memberId = existingMember.id;
      } else {
        // Create a new member record linked to the user
        const { data: newMember, error: createMemberError } = await supabase
          .from('members')
          .insert({
            user_id: data.userId,
            first_name: selectedProfile.first_name || 'Sem nome',
            last_name: selectedProfile.last_name || '',
            whatsapp: selectedProfile.phone || '',
            birth_date: '2000-01-01', // Default date, can be updated later
          })
          .select()
          .single();

        if (createMemberError) {
          toast({
            title: "Erro ao criar registro",
            description: createMemberError.message,
            variant: "destructive",
          });
          return;
        }

        memberId = newMember.id;
      }

      // Check if member is already in this ministry
      const { data: existingEntry, error: checkError } = await supabase
        .from('ministry_members')
        .select('id')
        .eq('member_id', memberId)
        .eq('ministry_id', data.ministryId)
        .maybeSingle();

      if (checkError) {
        toast({
          title: "Erro ao verificar",
          description: checkError.message,
          variant: "destructive",
        });
        return;
      }

      if (existingEntry) {
        toast({
          title: "Usuário já cadastrado",
          description: "Este usuário já está cadastrado neste ministério.",
          variant: "destructive",
        });
        return;
      }

      // Add member to ministry
      const { error: ministryError } = await supabase
        .from('ministry_members')
        .insert({
          member_id: memberId,
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
        title: "Usuário adicionado com sucesso!",
        description: `${selectedProfile.first_name || ''} ${selectedProfile.last_name || ''} foi adicionado ao ministério ${selectedMinistry?.name} como ${data.role}.`,
      });
      existingUserForm.reset();
      fetchMinistries();
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const selectedUserId = existingUserForm.watch("userId");
  const selectedUser = profiles.find(p => p.user_id === selectedUserId);

  const getDisplayName = (profile: typeof profiles[0]) => {
    const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    return name || profile.email || 'Usuário sem nome';
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="existing" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Usuário com Conta
        </TabsTrigger>
        <TabsTrigger value="new" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Cadastro Manual
        </TabsTrigger>
      </TabsList>

      {/* Existing Member Tab */}
      <TabsContent value="existing">
        <Form {...existingUserForm}>
          <form onSubmit={existingUserForm.handleSubmit(onExistingUserSubmit)} className="space-y-6">
            <FormField
              control={existingUserForm.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Selecionar Usuário</FormLabel>
                  <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={userSearchOpen}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {selectedUser
                            ? getDisplayName(selectedUser)
                            : "Buscar usuário..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar por nome ou email..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingProfiles ? "Carregando..." : "Nenhum usuário encontrado."}
                          </CommandEmpty>
                          <CommandGroup>
                            {profiles.map((profile) => (
                              <CommandItem
                                key={profile.user_id}
                                value={`${profile.first_name || ''} ${profile.last_name || ''} ${profile.email || ''}`}
                                onSelect={() => {
                                  field.onChange(profile.user_id);
                                  setUserSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === profile.user_id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{getDisplayName(profile)}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {profile.email || profile.phone || 'Sem contato'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={existingUserForm.control}
                name="ministryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ministério</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                control={existingUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

            <p className="text-sm text-muted-foreground">
              💡 Selecione um usuário que já criou conta na plataforma para adicioná-lo ao ministério.
            </p>

            <Button type="submit" className="w-full" disabled={loadingMinistries || loadingProfiles}>
              {loadingMinistries || loadingProfiles ? "Carregando..." : "Adicionar ao Ministério"}
            </Button>
          </form>
        </Form>
      </TabsContent>

      {/* New Member Tab */}
      <TabsContent value="new">
        <Form {...newMemberForm}>
          <form onSubmit={newMemberForm.handleSubmit(onNewMemberSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={newMemberForm.control}
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
                control={newMemberForm.control}
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
                control={newMemberForm.control}
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
                control={newMemberForm.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <DateInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Digite ou selecione a data"
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={newMemberForm.control}
                name="ministryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ministério</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                control={newMemberForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <label className="block text-sm font-medium mb-2">Foto do Membro</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {photo ? photo.name : "Clique para fazer upload da foto"}
                  </p>
                </label>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              💡 <strong>Cadastro manual:</strong> Use esta opção para pessoas que ainda não têm conta na plataforma. Quando criarem uma conta, o administrador poderá vincular o cadastro.
            </p>

            <Button type="submit" className="w-full" disabled={loadingMinistries}>
              {loadingMinistries ? "Carregando..." : "Cadastrar Novo Membro"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default RegisterStudentForm;
