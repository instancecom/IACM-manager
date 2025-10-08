import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
              <FileText className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">Termos de Uso</CardTitle>
            </div>
            <CardDescription>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
              <p>
                Ao criar uma conta e utilizar esta plataforma, você concorda com estes Termos de Uso
                e com nossa Política de Privacidade. Se você não concordar, não utilize a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Descrição do Serviço</h2>
              <p>
                Nossa plataforma oferece ferramentas para gestão de membros, eventos, ministérios e
                comunicação dentro da comunidade da igreja.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Cadastro e Conta</h2>
              <p className="mb-2">Ao criar uma conta, você concorda em:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                <li>Manter a segurança de sua senha</li>
                <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Uso Aceitável</h2>
              <p className="mb-2">Você concorda em NÃO:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Usar a plataforma para fins ilegais ou não autorizados</li>
                <li>Compartilhar conteúdo ofensivo, difamatório ou inadequado</li>
                <li>Tentar acessar áreas restritas da plataforma</li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Coletar dados de outros usuários sem autorização</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logos e software,
                é propriedade da igreja e protegido por leis de propriedade intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Privacidade e Proteção de Dados</h2>
              <p>
                O tratamento de seus dados pessoais está detalhado em nossa Política de Privacidade,
                em conformidade com a LGPD (Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Conteúdo do Usuário</h2>
              <p>
                Você é responsável pelo conteúdo que compartilha na plataforma e garante que possui
                todos os direitos necessários para publicá-lo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Suspensão e Encerramento</h2>
              <p>
                Reservamo-nos o direito de suspender ou encerrar sua conta em caso de violação
                destes termos, sem aviso prévio e sem qualquer responsabilidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Isenção de Garantias</h2>
              <p>
                A plataforma é fornecida "como está", sem garantias de qualquer tipo. Não garantimos
                que o serviço será ininterrupto ou livre de erros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Limitação de Responsabilidade</h2>
              <p>
                Não seremos responsáveis por danos indiretos, incidentais ou consequenciais
                resultantes do uso ou impossibilidade de uso da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Modificações dos Termos</h2>
              <p>
                Podemos modificar estes termos a qualquer momento. Mudanças significativas serão
                comunicadas através do e-mail cadastrado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis da República Federativa do Brasil.
                Qualquer disputa será resolvida no foro da comarca da igreja.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. Contato</h2>
              <p>
                Para dúvidas sobre estes termos, entre em contato através do e-mail:
                contato@igreja.com.br
              </p>
            </section>

            <section className="pt-4 border-t border-border">
              <p className="text-sm">
                Ao utilizar nossa plataforma, você declara ter lido, compreendido e concordado
                com estes Termos de Uso.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
