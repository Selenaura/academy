import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    const [certsRes, profilesRes, authRes] = await Promise.all([
      admin.from('certificates').select('*').order('issued_at', { ascending: false }),
      admin.from('profiles').select('id, name'),
      admin.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    if (certsRes.error) {
      return NextResponse.json({ error: certsRes.error.message }, { status: 500 });
    }

    const certificates = certsRes.data || [];
    const profiles = profilesRes.data || [];
    const authUsers = authRes.data?.users || [];

    if (profilesRes.error) {
      console.error('[Admin Certs] Error fetching profiles:', profilesRes.error.message);
    }
    if (authRes.error) {
      console.error('[Admin Certs] Error fetching auth users:', authRes.error.message);
    }

    const nameMap = {};
    const emailMap = {};
    profiles.forEach(p => { nameMap[p.id] = p.name; });
    authUsers.forEach(u => { emailMap[u.id] = u.email; });

    const enriched = certificates.map(c => ({
      ...c,
      user_name: nameMap[c.user_id] || '',
      user_email: emailMap[c.user_id] || '',
    }));

    return NextResponse.json({ certificates: enriched });
  });
}
