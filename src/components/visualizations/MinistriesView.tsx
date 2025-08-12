import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Music, Users, Search, Phone, Mail, MapPin, Calendar } from "lucide-react";

const MinistriesView = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - será substituído pela integração com o banco de dados
  const ministries = [
    {
      id: 1,
      name: "Jovens",
      description: "Ministério dedicado aos jovens da comunidade",
      leader: "João Silva",
      members: [
        { name: "João Silva", role: "Líder", phone: "(11) 99999-1111", email: "joao@email.com", birthDate: "25/05/1985" },
        { name: "Carlos Oliveira", role: "Membro", phone: "(11) 99999-5555", email: "carlos@email.com", birthDate: "22/07/1987" },
        { name: "Ana Beatriz", role: "Secretária", phone: "(11) 99999-6666", email: "ana.beatriz@email.com", birthDate: "15/03/1992" },
        { name: "Miguel Santos", role: "Membro", phone: "(11) 99999-7777", email: "miguel@email.com", birthDate: "10/11/1990" },
      ],
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Adolescentes",
      description: "Ministério voltado para os adolescentes",
      leader: "Maria Santos",
      members: [
        { name: "Maria Santos", role: "Líder", phone: "(11) 99999-2222", email: "maria@email.com", birthDate: "10/08/1990" },
        { name: "Fernanda Lima", role: "Vice-líder", phone: "(11) 99999-9999", email: "fernanda@email.com", birthDate: "18/09/1995" },
        { name: "Roberto Silva", role: "Membro", phone: "(11) 99999-0000", email: "roberto@email.com", birthDate: "12/04/1993" },
      ],
      color: "bg-green-500"
    },
    {
      id: 3,
      name: "Pré",
      description: "Ministério infantil - crianças pequenas",
      leader: "Sofia Costa",
      members: [
        { name: "Sofia Costa", role: "Líder", phone: "(11) 99999-8888", email: "sofia@email.com", birthDate: "28/01/1988" },
        { name: "Camila Oliveira", role: "Professora", phone: "(11) 99999-1010", email: "camila@email.com", birthDate: "05/06/1991" },
        { name: "Beatriz Santos", role: "Auxiliar", phone: "(11) 99999-1616", email: "beatriz@email.com", birthDate: "20/09/1994" },
      ],
      color: "bg-pink-500"
    },
    {
      id: 4,
      name: "Marketing",
      description: "Ministério responsável pela comunicação e divulgação",
      leader: "Pedro Costa",
      members: [
        { name: "Pedro Costa", role: "Líder", phone: "(11) 99999-3333", email: "pedro@email.com", birthDate: "15/12/1988" },
        { name: "Juliana Ferreira", role: "Social Media", phone: "(11) 99999-1313", email: "juliana@email.com", birthDate: "03/07/1996" },
        { name: "Roberto Santos", role: "Designer", phone: "(11) 99999-1212", email: "roberto.santos@email.com", birthDate: "05/11/1989" },
      ],
      color: "bg-purple-500"
    },
    {
      id: 5,
      name: "Louvor",
      description: "Ministério responsável pela música e louvor nos cultos",
      leader: "Ana Silva",
      members: [
        { name: "Ana Silva", role: "Líder", phone: "(11) 99999-4444", email: "ana@email.com", birthDate: "30/03/1992" },
        { name: "Carlos Oliveira", role: "Guitarrista", phone: "(11) 99999-5555", email: "carlos@email.com", birthDate: "22/07/1987" },
        { name: "Miguel Santos", role: "Baterista", phone: "(11) 99999-7777", email: "miguel@email.com", birthDate: "10/11/1990" },
        { name: "Sofia Costa", role: "Tecladista", phone: "(11) 99999-8888", email: "sofia@email.com", birthDate: "28/01/1988" },
      ],
      color: "bg-amber-500"
    },
    {
      id: 6,
      name: "Obreiros",
      description: "Ministério responsável pela organização e apoio geral",
      leader: "Fernando Oliveira",
      members: [
        { name: "Fernando Oliveira", role: "Líder", phone: "(11) 99999-1515", email: "fernando@email.com", birthDate: "08/02/1986" },
        { name: "Juliana Costa", role: "Obreiro", phone: "(11) 99999-1414", email: "juliana.costa@email.com", birthDate: "12/04/1993" },
        { name: "Rafael Costa", role: "Obreiro", phone: "(11) 99999-1717", email: "rafael@email.com", birthDate: "25/08/1991" },
      ],
      color: "bg-orange-500"
    }
  ];

  // Filtrar ministérios e membros baseado na busca
  const filteredMinistries = ministries.map(ministry => {
    if (!searchTerm) return ministry;
    
    const ministryMatches = ministry.name.toLowerCase().includes(searchTerm.toLowerCase());
    const filteredMembers = ministry.members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (ministryMatches || filteredMembers.length > 0) {
      return {
        ...ministry,
        members: ministryMatches ? ministry.members : filteredMembers
      };
    }
    return null;
  }).filter(Boolean) as typeof ministries;

  const calculateAge = (birthDate: string) => {
    const [day, month, year] = birthDate.split('/').map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    
    return age;
  };

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
      {filteredMinistries.map((ministry) => (
        <Card key={ministry.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${ministry.color} rounded-lg flex items-center justify-center`}>
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{ministry.name}</CardTitle>
                  <CardDescription>{ministry.description}</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {ministry.members.length} membros
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ministry.members.map((member, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src="" alt={member.name} />
                      <AvatarFallback className="text-sm">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <Badge 
                        variant={member.role === "Líder" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {member.role}
                      </Badge>
                    </div>
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
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">
                        {member.birthDate} ({calculateAge(member.birthDate)} anos)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

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