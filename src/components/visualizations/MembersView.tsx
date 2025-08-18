import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Phone, Mail, MapPin, Calendar, Loader2 } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { useMinistries } from "@/hooks/useMinistries";

const MembersView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMinistry, setFilterMinistry] = useState("all");
  const { members, loading, error } = useMembers();
  const { ministries } = useMinistries();

  const calculateAge = (birthDateString: string) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Filtrar membros
  const filteredMembers = members.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.whatsapp.includes(searchTerm);
    
    const matchesMinistry = filterMinistry === "all" || 
                           (filterMinistry === "none" && !member.ministry) ||
                           member.ministry?.name === filterMinistry;
    
    return matchesSearch && matchesMinistry;
  });

  const getMinistryBadge = (ministry: { name: string; role: string } | null) => {
    if (!ministry) {
      return <Badge variant="outline">Sem ministério</Badge>;
    }
    return (
      <div className="flex flex-col gap-1">
        <Badge variant="secondary">{ministry.name}</Badge>
        <span className="text-xs text-muted-foreground">{ministry.role}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando membros...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar membros: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterMinistry} onValueChange={setFilterMinistry}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por ministério" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os ministérios</SelectItem>
            {ministries.map((ministry) => (
              <SelectItem key={ministry.id} value={ministry.name}>
                {ministry.name}
              </SelectItem>
            ))}
            <SelectItem value="none">Sem ministério</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-sm text-muted-foreground">Total de Membros</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {members.filter(m => m.ministry).length}
              </div>
              <p className="text-sm text-muted-foreground">Em Ministérios</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {members.filter(m => !m.ministry).length}
              </div>
              <p className="text-sm text-muted-foreground">Sem Ministério</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Membros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.photo_url || ""} alt={`${member.first_name} ${member.last_name}`} />
                    <AvatarFallback>
                      {member.first_name[0]}{member.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{member.first_name} {member.last_name}</h4>
                    {getMinistryBadge(member.ministry)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`https://wa.me/55${member.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                  >
                    {member.whatsapp}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Nascimento: {formatDate(member.birth_date)} ({calculateAge(member.birth_date)} anos)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum membro encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou termo de busca.
          </p>
        </div>
      )}
    </div>
  );
};

export default MembersView;