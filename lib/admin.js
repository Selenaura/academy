import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function getAdminEmails() {
  const envEmails = process.env.ADMIN_EMAILS;
  if (envEmails) return envEmails.split(',').map(e => e.trim().toLowerCase());
  return ['irenellorettrillo@gmail.com'];
}

export async function withAdmin(handler) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnon) {
      return NextResponse.json({ error: 'Configuración de Supabase incompleta' }, { status: 500 });
    }
    if (!serviceRole) {
      return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY no configurada' }, { status: 500 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnon, {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
        set() {},
        remove() {},
      },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !getAdminEmails().includes(user.email?.toLowerCase())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const admin = createClient(supabaseUrl, serviceRole);
    return await handler(admin, user);
  } catch (err) {
    console.error('[Admin API Error]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
