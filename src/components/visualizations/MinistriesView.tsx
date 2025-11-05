import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Music, Users, Search, Phone, Calendar, Loader2, Heart, BookOpen, Baby, Handshake, Megaphone, Video, Mic2, Guitar, Drum } from "lucide-react";
import { useMinistries } from "@/hooks/useMinistries";

const MinistriesView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { ministries, loading, error } = useMinistries();

  const ministryColors = [
    "bg-blue-500",
    "bg-green-500", 
    "bg-pink-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-emerald-500"
  ];

  // Filtrar ministérios e membros baseado na busca
  const filteredMinistries = ministries.map((ministry, index) => {
    if (!searchTerm) return { ...ministry, color: ministryColors[index % ministryColors.length] };
    
    const ministryMatches = ministry.name.toLowerCase().includes(searchTerm.toLowerCase());
    const filteredMembers = ministry.members?.filter(member =>
      `${member.member.first_name} ${member.member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.role && member.role.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];
    
    if (ministryMatches || filteredMembers.length > 0) {
      return {
        ...ministry,
        color: ministryColors[index % ministryColors.length],
        members: ministryMatches ? ministry.members : filteredMembers
      };
    }
    return null;
  }).filter(Boolean);

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getMinistryIcon = (ministryName: string) => {
    const name = ministryName.toLowerCase();
    
    if (name.includes('louvor') || name.includes('música') || name.includes('music')) return Music;
    if (name.includes('jovem') || name.includes('juventude')) return Users;
    if (name.includes('infantil') || name.includes('criança') || name.includes('kid')) return Baby;
    if (name.includes('intercessão') || name.includes('oração')) return Heart;
    if (name.includes('ensino') || name.includes('escola') || name.includes('bíblia')) return BookOpen;
    if (name.includes('mídia') || name.includes('comunicação')) return Video;
    if (name.includes('marketing') || name.includes('divulgação')) return Megaphone;
    if (name.includes('recepção') || name.includes('hospitalidade')) return Handshake;
    if (name.includes('vocal') || name.includes('canto')) return Mic2;
    if (name.includes('guitarra') || name.includes('violão')) return Guitar;
    if (name.includes('bateria') || name.includes('percussão')) return Drum;
    
    return Music; // Ícone padrão
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando ministérios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">Erro ao carregar ministérios</div>
        <div className="text-muted-foreground text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por ministério, nome ou função..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Ministérios */}
      {filteredMinistries.map((ministry) => {
        const MinistryIcon = getMinistryIcon(ministry.name);
        return (
          <Card key={ministry.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${ministry.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <MinistryIcon className="w-6 h-6 text-white" />
                  </div>
                <div>
                  <CardTitle className="text-xl">{ministry.name}</CardTitle>
                  <CardDescription>{ministry.description || "Sem descrição"}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm font-semibold px-3 py-1 rounded-sm">
                {ministry.members?.length || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {ministry.members && ministry.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ministry.members.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar>
                        <AvatarImage src={member.member.photo_url || ""} alt={`${member.member.first_name} ${member.member.last_name}`} />
                        <AvatarFallback className="text-sm">
                          {member.member.first_name[0]}{member.member.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{member.member.first_name} {member.member.last_name}</h4>
                        <Badge 
                          variant={member.role === "Líder" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {member.role || "Membro"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a 
                          href={`https://wa.me/55${member.member.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                        >
                          {member.member.whatsapp}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs">
                          {formatDate(member.member.birth_date)} ({calculateAge(member.member.birth_date)} anos)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum membro cadastrado neste ministério ainda.
              </div>
            )}
          </CardContent>
        </Card>
      )})}
      

      {filteredMinistries.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
          <p className="text-muted-foreground">
            Tente buscar por outro termo ou verifique a ortografia.
          </p>
        </div>
      )}
    </div>
  );
};

export default MinistriesView;