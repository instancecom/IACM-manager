import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/register">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <Card className="netflix-card">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">Política de Privacidade</CardTitle>
            </div>
            <CardDescription>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introdução</h2>
              <p>
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos
                suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Dados Coletados</h2>
              <p className="mb-2">Coletamos as seguintes informações:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone/WhatsApp</li>
                <li>Data de nascimento</li>
                <li>Foto de perfil (opcional)</li>
                <li>Informações de eventos e confirmações de presença</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Finalidade do Tratamento</h2>
              <p className="mb-2">Utilizamos seus dados para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Autenticação e gerenciamento de conta</li>
                <li>Gestão de eventos e confirmações de presença</li>
                <li>Comunicação sobre atividades da igreja</li>
                <li>Organização de ministérios e escalas</li>
                <li>Cumprimento de obrigações legais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Compartilhamento de Dados</h2>
              <p>
                Seus dados pessoais não serão compartilhados com terceiros, exceto quando necessário
                para cumprimento de obrigação legal ou mediante sua autorização expressa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Seus Direitos (LGPD)</h2>
              <p className="mb-2">Você tem direito a:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Confirmação da existência de tratamento de dados</li>
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminação dos dados tratados com seu consentimento</li>
                <li>Revogação do consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Segurança dos Dados</h2>
              <p>
                Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados
                contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Retenção de Dados</h2>
              <p>
                Seus dados serão mantidos apenas pelo tempo necessário para as finalidades descritas,
                ou conforme exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Cookies e Tecnologias Similares</h2>
              <p>
                Utilizamos cookies essenciais para o funcionamento da plataforma, incluindo autenticação
                e preferências de usuário.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas
                através do e-mail cadastrado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Contato</h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato
                através do e-mail: privacidade@igreja.com.br
              </p>
            </section>

            <section className="pt-4 border-t border-border">
              <p className="text-sm">
                Ao utilizar nossa plataforma, você concorda com esta Política de Privacidade e
                com o tratamento de seus dados pessoais conforme aqui descrito.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
