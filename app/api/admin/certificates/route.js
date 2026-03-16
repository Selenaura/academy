import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    const [
      { data: certificates, error: certsErr },
      { data: profiles },
      { data: { users: authUsers } },
    ] = await Promise.all([
      admin.from('certificates')
        .select('*')
        .order('issued_at', { ascending: false }),
      admin.from('profiles').select('id, name'),
      admin.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    if (certsErr) {
      return NextResponse.json({ error: certsErr.message }, { status: 500 });
    }

    const nameMap = {};
    const emailMap = {};
    if (profiles) profiles.forEach(p => { nameMap[p.id] = p.name; });
    if (authUsers) authUsers.forEach(u => { emailMap[u.id] = u.email; });

    const enriched = (certificates || []).map(c => ({
      ...c,
      user_name: nameMap[c.user_id] || '',
      user_email: emailMap[c.user_id] || '',
    }));

    return NextResponse.json({ certificates: enriched });
  });
}
