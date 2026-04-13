# Documentação de Funcionalidades - Plataforma IACM Manager

Esta documentação detalha todas as capacidades e módulos da plataforma IACM Manager, projetada para a gestão eclesiástica e operacional da igreja.

## 1. Visão Geral
A plataforma IACM Manager é um sistema integrado de gestão que permite o controle de membros, escalas de serviço, eventos, ministérios e comunicação visual (banners). Ela oferece interfaces distintas para o público geral, membros registrados e administradores.

---

## 2. Interface Pública (Landing Page)
Ponto de entrada para visitantes e membros, focada em informação e engajamento.

- **Hero Section**: Apresentação visual da igreja com chamadas para ação.
- **Versículo do Dia**: Exibição dinâmica de passagens bíblicas para inspiração diária.
- **Escala de Serviços**: Visualização das escalas futuras (quem estará servindo em quais datas).
- **Localização**: Integração com mapas para facilitar o acesso à igreja.
- **Redes Sociais**: Links rápidos para Instagram, YouTube e outras plataformas.
- **Sobre a Igreja**: Seção institucional com história e valores.

---

## 3. Autenticação e Gestão de Contas
Segurança e personalização do acesso.

- **Cadastro (Register)**: Criação de novas contas integradas ao sistema de membros.
- **Login**: Acesso seguro para membros e administradores.
- **Recuperação de Senha**: Fluxo completo de "Esqueci minha senha" via e-mail.
- **Gestão de Perfil**: Edição de dados pessoais, foto e preferências.

---

## 4. Módulo Administrativo (Dashboard Admin)
Área restrita para liderança e equipe operacional gerir a igreja.

### A. Gestão de Membros
- **Lista de Membros**: Tabela completa com busca e filtros (por ministério, status, etc.).
- **Cadastro de Membros**: Formulário detalhado para inclusão de novos membros.
- **Vinculação de Usuário**: Processo de unir contas de site com registros de membros ("Sem conta" -> "Vinculado").

### B. Gestão de Escalas (Schedules)
- **Criação de Escalas**: Definir quem serve em qual data e função (ex: Som, Louvor, Recepção).
- **Lista de Escalas**: Visualização e edição de escalas futuras e passadas.
- **Confirmação de Presença**: Sistema para membros confirmarem ou recusarem sua participação na escala.

### C. Gestão de Eventos
- **Criação de Eventos**: Cadastro de cultos especiais, conferências e reuniões.
- **Galeria de Eventos**: Gestão visual dos eventos que aparecerão no site.
- **Visualização Prévia (Preview)**: Ferramenta para ver como o evento será exibido antes de publicar.

### D. Gestão de Ministérios
- **Cadastro de Ministérios**: Organização da igreja por departamentos (Louvor, Kids, Mídia, etc.).
- **Atribuição de Membros**: Definir quais membros pertencem a quais ministérios.

### E. Gestão de Alunos (Educação)
- **Cadastro de Alunos**: Foco em cursos internos ou escola dominical.
- **Lista de Alunos**: Acompanhamento de progresso e dados acadêmicos/eclesiásticos.

### F. Controle de Acesso (Roles)
- **Gestão de Cargos**: Definição de níveis de acesso (Admin, Membro, Moderador).

---

## 5. Módulo Institucional e Conteúdo
- **Gerenciador de Banners**: Upload e controle de banners rotativos para a Landing Page.
- **Checklist de Segurança**: Ferramenta administrativa para auditoria rápida de configurações.

---

## 6. Visualizações e Relatórios
- **Dashboard de Dados**: Gráficos e tabelas com estatísticas da igreja (crescimento, participação em escalas, etc.).
- **Visualizações Customizadas**: Filtros avançados para exportação ou consulta rápida de dados operacionais.

---

## 7. Políticas e Conformidade
- **Política de Privacidade**: Documentação legal sobre o tratamento de dados (LGPD).
- **Termos de Uso**: Regras de utilização da plataforma.

---

> [!TIP]
> A plataforma utiliza tecnologias modernas como **React**, **TypeScript**, **Tailwind CSS** e **Supabase** para garantir performance e segurança. Além disso, possui suporte para dispositivos móveis via **Capacitor**.
