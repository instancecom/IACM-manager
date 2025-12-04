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
      from: 'Igreja Apostólica dos Cinco Ministérios <onboarding@resend.dev>',
      to: [email],
      subject: 'Recuperação de Senha - Igreja Apostólica',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Recuperação de Senha</title>
          <!--[if mso]>
          <style type="text/css">
            body, table, td {font-family: Arial, sans-serif !important;}
          </style>
          <![endif]-->
        </head>
        <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f0f0f; margin: 0; padding: 32px 16px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
          <div style="max-width: 560px; margin: 0 auto;">
            <!-- Card Container -->
            <div style="background-color: #141414; border-radius: 12px; overflow: hidden; border: 1px solid #2e2e2e; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);">
              
              <!-- Header with Logo -->
              <div style="background: linear-gradient(135deg, #286BA0 0%, #1e5280 100%); padding: 32px 24px; text-align: center;">
                <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                  <img src="https://img.icons8.com/fluency/48/church.png" alt="Igreja" width="48" height="48" style="display: block;" />
                </div>
                <h1 style="color: #fafafa; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
                  Igreja Apostólica dos Cinco Ministérios
                </h1>
              </div>
              
              <!-- Main Content -->
              <div style="padding: 32px 24px;">
                <h2 style="color: #286BA0; margin: 0 0 8px; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">
                  Recuperação de Senha
                </h2>
                <div style="width: 48px; height: 3px; background: linear-gradient(90deg, #286BA0, transparent); border-radius: 2px; margin-bottom: 24px;"></div>
                
                <p style="color: #a6a6a6; line-height: 1.7; margin: 0 0 24px; font-size: 15px; font-weight: 400;">
                  Olá! Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha segura:
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 32px 0;">
                  <!--[if mso]>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${recoveryLink}" style="height:52px;v-text-anchor:middle;width:220px;" arcsize="15%" strokecolor="#286BA0" fillcolor="#286BA0">
                    <w:anchorlock/>
                    <center style="color:#fafafa;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Redefinir Senha</center>
                  </v:roundrect>
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <a href="${recoveryLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #286BA0 0%, #1e5280 100%); color: #fafafa !important; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: -0.01em; box-shadow: 0 4px 16px rgba(40, 107, 160, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3); transition: all 0.2s;">
                    Redefinir Senha
                  </a>
                  <!--<![endif]-->
                </div>
                
                <!-- Divider -->
                <div style="border-top: 1px solid #2e2e2e; margin: 28px 0;"></div>
                
                <!-- Alternative Link -->
                <p style="color: #6b6b6b; font-size: 13px; line-height: 1.6; margin: 0 0 12px;">
                  Caso o botão não funcione, copie e cole este link no navegador:
                </p>
                <p style="margin: 0; word-break: break-all;">
                  <a href="${recoveryLink}" target="_blank" style="color: #286BA0; text-decoration: underline; font-size: 13px; line-height: 1.6;">${recoveryLink}</a>
                </p>
                
                <!-- Security Notice -->
                <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; margin-top: 24px; border-left: 3px solid #286BA0;">
                  <p style="color: #949494; font-size: 13px; line-height: 1.6; margin: 0;">
                    <strong style="color: #a6a6a6;">🔒 Segurança:</strong> Se você não solicitou esta recuperação de senha, ignore este email. Sua conta permanece segura.
                  </p>
                </div>
                
                <!-- Expiration Notice -->
                <p style="color: #6b6b6b; font-size: 13px; line-height: 1.6; margin: 20px 0 0; text-align: center;">
                  ⏱️ Este link expira em <strong style="color: #949494;">24 horas</strong>
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #0f0f0f; padding: 24px; text-align: center; border-top: 1px solid #2e2e2e;">
                <p style="color: #6b6b6b; font-size: 12px; margin: 0 0 8px; font-weight: 500;">
                  Igreja Apostólica dos Cinco Ministérios
                </p>
                <p style="color: #4a4a4a; font-size: 11px; margin: 0;">
                  © ${new Date().getFullYear()} Todos os direitos reservados
                </p>
              </div>
            </div>
            
            <!-- Unsubscribe Footer -->
            <p style="color: #4a4a4a; font-size: 11px; text-align: center; margin: 24px 0 0; line-height: 1.6;">
              Este é um e-mail automático. Por favor, não responda diretamente.
            </p>
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
