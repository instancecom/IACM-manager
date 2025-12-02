import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting: 10 requests per minute per user
const rateLimiter = new Map<string, number[]>()

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar se o usuário atual é admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar se o usuário é admin
    const { data: isAdminData, error: adminError } = await supabaseAdmin
      .rpc('is_admin', { _user_id: user.id })

    if (adminError || !isAdminData) {
      console.log(`[SECURITY] Unauthorized access attempt to list-users-with-roles by user ${user.id}`)
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting check: 10 requests per minute per user
    const now = Date.now()
    const userRequests = rateLimiter.get(user.id) || []
    const recentRequests = userRequests.filter(timestamp => now - timestamp < 60000)
    
    if (recentRequests.length >= 10) {
      console.log(`[SECURITY] Rate limit exceeded for user ${user.id}`)
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Maximum 10 requests per minute.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Update rate limiter
    recentRequests.push(now)
    rateLimiter.set(user.id, recentRequests)
    
    // Cleanup old entries periodically
    if (rateLimiter.size > 1000) {
      for (const [userId, timestamps] of rateLimiter.entries()) {
        const validTimestamps = timestamps.filter(t => now - t < 60000)
        if (validTimestamps.length === 0) {
          rateLimiter.delete(userId)
        }
      }
    }

    console.log(`[SECURITY] Admin ${user.id} accessing list-users-with-roles`)

    // Buscar todos os usuários
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      throw usersError
    }

    // Buscar roles de todos os usuários
    const { data: rolesData, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role')

    if (rolesError) {
      throw rolesError
    }

    // Mapear roles por user_id
    const rolesMap = new Map<string, string[]>()
    rolesData?.forEach(r => {
      const existing = rolesMap.get(r.user_id) || []
      rolesMap.set(r.user_id, [...existing, r.role])
    })

    // Combinar usuários com seus roles
    const usersWithRoles = users.map(u => ({
      id: u.id,
      email: u.email || '',
      roles: rolesMap.get(u.id) || [],
      created_at: u.created_at
    }))

    return new Response(
      JSON.stringify({ users: usersWithRoles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
