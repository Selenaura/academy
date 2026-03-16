import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    const [paymentsRes, authRes] = await Promise.all([
      admin.from('payments').select('*').order('created_at', { ascending: false }),
      admin.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    if (paymentsRes.error) {
      return NextResponse.json({ error: paymentsRes.error.message }, { status: 500 });
    }

    const payments = paymentsRes.data || [];
    const authUsers = authRes.data?.users || [];

    if (authRes.error) {
      console.error('[Admin Payments] Error fetching auth users:', authRes.error.message);
    }

    const emailMap = {};
    authUsers.forEach(u => { emailMap[u.id] = u.email; });

    const enriched = payments.map(p => ({
      ...p,
      email: emailMap[p.user_id] || '',
    }));

    return NextResponse.json({ payments: enriched });
  });
}
