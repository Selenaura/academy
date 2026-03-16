import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin';

export async function GET() {
  return withAdmin(async (admin) => {
    const [
      { data: payments, error: paymentsErr },
      { data: { users: authUsers } },
    ] = await Promise.all([
      admin.from('payments')
        .select('*')
        .order('created_at', { ascending: false }),
      admin.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    if (paymentsErr) {
      return NextResponse.json({ error: paymentsErr.message }, { status: 500 });
    }

    const emailMap = {};
    if (authUsers) {
      authUsers.forEach(u => { emailMap[u.id] = u.email; });
    }

    const enriched = (payments || []).map(p => ({
      ...p,
      email: emailMap[p.user_id] || '',
    }));

    return NextResponse.json({ payments: enriched });
  });
}
