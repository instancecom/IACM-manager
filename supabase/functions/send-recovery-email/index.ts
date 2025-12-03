import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'
import { Resend } from 'npm:resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface RecoveryEmailRequest {
  email: string
  redirectTo: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, redirectTo }: RecoveryEmailRequest = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate password recovery link using Supabase Admin API
    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectTo
      }
    })

    if (linkError) {
      console.error('Error generating recovery link:', linkError)
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar link de recuperação' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const recoveryLink = data.properties?.action_link

    if (!recoveryLink) {
      console.error('No recovery link generated')
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar link de recuperação' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Recovery link generated:', recoveryLink)

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Igreja Apostólica dos Cinco Ministérios <iacm@resend.dev>',
      to: [email],
      subject: 'Recuperação de Senha - AD Plenitude',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Recuperação de Senha</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">AD Plenitude</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="color: #18181b; margin: 0 0 16px; font-size: 20px;">Recuperação de Senha</h2>
              <p style="color: #52525b; line-height: 1.6; margin: 0 0 24px;">
                Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${recoveryLink}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="17%" strokecolor="#7c3aed" fillcolor="#7c3aed">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">Redefinir Senha</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${recoveryLink}" target="_blank" style="display: inline-block; background-color: #7c3aed; background-image: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: #ffffff !important; text-decoration: underline; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; mso-hide: all;">
                  Redefinir Senha
                </a>
                <!--<![endif]-->
              </div>
              <p style="color: #52525b; font-size: 13px; line-height: 1.6; margin: 24px 0 0; word-break: break-all;">
                Caso o botão não funcione, copie e cole este link no navegador:<br>
                <a href="${recoveryLink}" target="_blank" style="color: #7c3aed; text-decoration: underline;">${recoveryLink}</a>
              </p>
              <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
                Se você não solicitou esta recuperação de senha, pode ignorar este email com segurança.
              </p>
              <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 16px 0 0;">
                Este link expira em 24 horas.
              </p>
            </div>
            <div style="background-color: #f4f4f5; padding: 24px; text-align: center;">
              <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Igreja Apostólica dos Cinco Ministérios. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (emailError) {
      console.error('Error sending email via Resend:', emailError)
      return new Response(
        JSON.stringify({ error: 'Erro ao enviar email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Recovery email sent successfully to ${email}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Email de recuperação enviado com sucesso' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in send-recovery-email function:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
