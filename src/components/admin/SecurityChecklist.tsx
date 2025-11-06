import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Lock, UserCheck, AlertTriangle, FileCheck, Server, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SecurityChecklist = () => {
  const checklistSections = [
    {
      title: "Banco de Dados e RLS",
      icon: Database,
      level: "critical",
      items: [
        "✅ RLS habilitado em todas as tabelas sensíveis (profiles, event_confirmations, event_payments, user_roles)",
        "✅ Políticas RLS implementadas corretamente para cada operação (SELECT, INSERT, UPDATE, DELETE)",
        "✅ Funções security definer (has_role, is_admin, can_edit) implementadas sem recursão",
        "✅ Tabela user_roles separada - roles NÃO armazenadas no profile/users",
        "✅ Colunas user_id definidas como NOT NULL onde RLS depende delas",
        "✅ Dados financeiros (event_payments) restritos apenas a admins/editores",
        "✅ Confirmações de eventos protegidas mas permitindo inserção anônima",
        "⚠️ Verificar sample data periodicamente para confirmar que RLS está funcionando"
      ]
    },
    {
      title: "Autenticação e Autorização",
      icon: UserCheck,
      level: "critical",
      items: [
        "✅ Sistema de roles baseado em enum (admin, editor, reader, user)",
        "✅ Verificação de admin NUNCA usa localStorage ou variáveis client-side",
        "✅ Edge functions validam autenticação via JWT em operações sensíveis",
        "✅ Função is_admin() usa SECURITY DEFINER para evitar escalação de privilégios",
        "✅ Email redirect URLs configurados corretamente (emailRedirectTo)",
        "✅ Session handling implementado com onAuthStateChange",
        "⚠️ Considerar implementar 2FA para contas admin/editor",
        "⚠️ Configurar Site URL e Redirect URLs no Supabase Auth settings"
      ]
    },
    {
      title: "Validação de Entrada",
      icon: FileCheck,
      level: "high",
      items: [
        "✅ Validação server-side com Zod implementada em event confirmations",
        "✅ Limites de tamanho para campos de texto (max 100-255 chars)",
        "✅ Validação de formato para WhatsApp (10-11 dígitos)",
        "✅ Limite de convidados por evento (max 20)",
        "✅ Sanitização de input antes de enviar para APIs externas",
        "❌ Sem uso de dangerouslySetInnerHTML com dados do usuário",
        "⚠️ Adicionar validação em outros formulários (Register, Profile, Admin forms)"
      ]
    },
    {
      title: "Edge Functions",
      icon: Server,
      level: "medium",
      items: [
        "✅ CORS headers configurados corretamente em todas as edge functions",
        "✅ Validação de autenticação implementada (list-users-with-roles, delete-user-account)",
        "✅ Nunca executa SQL raw - sempre usa métodos do Supabase client",
        "✅ Logging adequado para debugging e auditoria",
        "✅ Secrets gerenciados via Supabase (não hardcoded)",
        "⚠️ Rate limiting ausente em list-users-with-roles (10 req/min recomendado)",
        "⚠️ Considerar adicionar audit logging para operações de admin"
      ]
    },
    {
      title: "Proteção de Dados Sensíveis",
      icon: Lock,
      level: "critical",
      items: [
        "✅ API keys e secrets armazenados no Supabase (não no código)",
        "❌ Sem logs de dados sensíveis no console (senhas, tokens, etc)",
        "❌ Sem API keys expostas no código client-side",
        "✅ Dados de pagamento visíveis apenas para admins/editores",
        "✅ WhatsApp e informações pessoais protegidas por RLS",
        "✅ Profile data restrita ao próprio usuário",
        "⚠️ Revisar se há algum console.log() com dados sensíveis em produção"
      ]
    },
    {
      title: "LGPD e Conformidade",
      icon: Shield,
      level: "high",
      items: [
        "✅ Sistema de consentimento implementado (consent_logs table)",
        "✅ Privacy policy e terms of service exigidos no cadastro",
        "✅ Timestamps de aceite registrados (privacy_consent_given_at, terms_accepted_at)",
        "✅ Função de exportação de dados implementada (useLGPDActions)",
        "✅ Função de exclusão de conta implementada via edge function",
        "✅ Exclusão em cascata de todos os dados relacionados ao usuário",
        "⚠️ Manter privacy policy e terms attualizados",
        "⚠️ Documentar período de retenção de dados"
      ]
    },
    {
      title: "Configurações do Supabase",
      icon: Eye,
      level: "medium",
      items: [
        "⚠️ Habilitar leaked password protection (Auth settings)",
        "⚠️ Configurar OTP expiry para valores recomendados (Auth settings)",
        "⚠️ Atualizar versão do Postgres para aplicar patches de segurança",
        "⚠️ Configurar backup automático do banco de dados",
        "⚠️ Revisar logs de autenticação periodicamente",
        "⚠️ Monitorar edge function logs para atividades suspeitas",
        "⚠️ Configurar alertas para tentativas de login falhadas"
      ]
    },
    {
      title: "Segurança Geral",
      icon: AlertTriangle,
      level: "high",
      items: [
        "✅ Sem injeção de HTML/XSS - componentes React escapam automaticamente",
        "✅ Design system usando semantic tokens HSL (não cores hardcoded)",
        "✅ Implementação responsiva com boas práticas de UI/UX",
        "❌ Sem dependências desatualizadas com vulnerabilidades conhecidas",
        "⚠️ Realizar testes de penetração antes do lançamento para grande público",
        "⚠️ Implementar monitoramento de erros (Sentry, LogRocket, etc)",
        "⚠️ Configurar HTTPS em domínio customizado",
        "⚠️ Revisar permissões de storage buckets (event-banners é público)"
      ]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "critical": return "Crítico";
      case "high": return "Alto";
      case "medium": return "Médio";
      default: return "Baixo";
    }
  };

  const getStatusIcon = (item: string) => {
    if (item.startsWith("✅")) return "✅";
    if (item.startsWith("⚠️")) return "⚠️";
    if (item.startsWith("❌")) return "❌";
    return "⬜";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Checklist de Segurança</CardTitle>
          </div>
          <CardDescription>
            Revisão completa da segurança do seu sistema de gestão da igreja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-muted-foreground">Implementado</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span className="text-muted-foreground">Requer atenção</span>
              </div>
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span className="text-muted-foreground">Verificado (OK)</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {checklistSections.map((section, idx) => {
              const Icon = section.icon;
              const completedItems = section.items.filter(item => item.startsWith("✅")).length;
              const totalItems = section.items.length;
              const completionRate = Math.round((completedItems / totalItems) * 100);

              return (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <Badge variant={getLevelColor(section.level)}>
                        {getLevelText(section.level)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {completedItems}/{totalItems} ({completionRate}%)
                    </div>
                  </div>

                  <div className="space-y-3 pl-8">
                    {section.items.map((item, itemIdx) => {
                      const icon = getStatusIcon(item);
                      const text = item.substring(2).trim();
                      
                      return (
                        <div key={itemIdx} className="flex items-start gap-3">
                          <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                          <span className="text-sm leading-relaxed">{text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {idx < checklistSections.length - 1 && <Separator className="mt-6" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">📋 Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>✅ Excelente:</strong> Todos os problemas críticos (ERROR) foram resolvidos. 
            Seu sistema tem uma base de segurança sólida com controle de acesso baseado em roles, 
            RLS implementado corretamente, e proteção de dados sensíveis.
          </p>
          <p>
            <strong>⚠️ Recomendações:</strong> Implemente rate limiting na edge function de listagem 
            de usuários, habilite leaked password protection no Supabase, e considere 2FA para contas 
            administrativas antes do lançamento em produção.
          </p>
          <p>
            <strong>🎯 Próximos Passos:</strong> Para produção com grande base de usuários, considere 
            contratar uma auditoria de segurança profissional. Este checklist cobre vulnerabilidades 
            comuns, mas não substitui testes de penetração avançados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityChecklist;
