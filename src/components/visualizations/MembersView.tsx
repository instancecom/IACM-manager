import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Phone, Mail, MapPin, Calendar } from "lucide-react";

const MembersView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const calculateAge = (birthDateString: string) => {
    const [day, month, year] = birthDateString.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Mock data - será substituído pela integração com o banco de dados
  const members = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-1111",
      address: "São Paulo, SP",
      joinDate: "15/01/2024",
      ministry: "Louvor",
      role: "Líder",
      status: "Ativo",
      birthDate: "25/05/1985"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 99999-2222",
      address: "São Paulo, SP",
      joinDate: "20/02/2024",
      ministry: "Recepção",
      role: "Líder",
      status: "Ativo",
      birthDate: "10/08/1990"
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@email.com",
      phone: "(11) 99999-3333",
      address: "Guarulhos, SP",
      joinDate: "05/03/2024",
      ministry: "Marketing",
      role: "Líder",
      status: "Ativo",
      birthDate: "15/12/1988"
    },
    {
      id: 4,
      name: "Ana Silva",
      email: "ana@email.com",
      phone: "(11) 99999-4444",
      address: "Osasco, SP",
      joinDate: "10/04/2024",
      ministry: "Obreiros",
      role: "Líder",
      status: "Ativo",
      birthDate: "30/03/1992"
    },
    {
      id: 5,
      name: "Carlos Oliveira",
      email: "carlos@email.com",
      phone: "(11) 99999-5555",
      address: "São Paulo, SP",
      joinDate: "15/08/2025",
      ministry: "Louvor",
      role: "Guitarrista",
      status: "Ativo",
      birthDate: "22/07/1987"
    },
    {
      id: 6,
      name: "Fernanda Lima",
      email: "fernanda@email.com",
      phone: "(11) 99999-9999",
      address: "Santo André, SP",
      joinDate: "10/08/2025",
      ministry: "Recepção",
      role: "Recepcionista",
      status: "Ativo",
      birthDate: "18/09/1995"
    },
    {
      id: 7,
      name: "Roberto Santos",
      email: "roberto.santos@email.com",
      phone: "(11) 99999-1212",
      address: "São Bernardo, SP",
      joinDate: "08/08/2025",
      ministry: "Marketing",
      role: "Designer",
      status: "Ativo",
      birthDate: "05/11/1989"
    },
    {
      id: 8,
      name: "Juliana Costa",
      email: "juliana.costa@email.com",
      phone: "(11) 99999-1414",
      address: "Diadema, SP",
      joinDate: "05/08/2025",
      ministry: "Obreiros",
      role: "Obreiro",
      status: "Ativo",
      birthDate: "12/04/1993"
    },
    {
      id: 9,
      name: "Leonardo Ferreira",
      email: "leonardo@email.com",
      phone: "(11) 99999-1818",
      address: "São Paulo, SP",
      joinDate: "01/06/2024",
      ministry: null,
      role: "Membro",
      status: "Inativo",
      birthDate: "28/01/1991"
    }
  ];

  // Filtrar membros
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    
    const matchesMinistry = filterMinistry === "all" || 
                           (filterMinistry === "none" && !member.ministry) ||
                           member.ministry === filterMinistry;
    
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesMinistry && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "Ativo" ? "default" : "secondary"}>
        {status}
      </Badge>
    );
  };

  const getMinistryBadge = (ministry: string | null, role: string) => {
    if (!ministry) {
      return <Badge variant="outline">Sem ministério</Badge>;
    }
    return (
      <div className="flex flex-col gap-1">
        <Badge variant="secondary">{ministry}</Badge>
        <span className="text-xs text-muted-foreground">{role}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <SelectItem value="Louvor">Louvor</SelectItem>
            <SelectItem value="Recepção">Recepção</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Obreiros">Obreiros</SelectItem>
            <SelectItem value="none">Sem ministério</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="text-2xl font-bold text-green-600">
                {members.filter(m => m.status === "Ativo").length}
              </div>
              <p className="text-sm text-muted-foreground">Membros Ativos</p>
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
                    <AvatarImage src="" alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    {getMinistryBadge(member.ministry, member.role)}
                  </div>
                </div>
                {getStatusBadge(member.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`https://wa.me/55${member.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                  >
                    {member.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{member.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Nascimento: {member.birthDate} ({calculateAge(member.birthDate)} anos)</span>
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