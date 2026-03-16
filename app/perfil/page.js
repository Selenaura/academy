'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { getLevel } from '@/lib/constants';
import { Card, Spinner, BackIcon, ArrowIcon } from '@/components/ui';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ coursesActive: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth?mode=login'); return; }
      setUser(user);

      const [profileRes, enrollmentsRes, certsRes] = await Promise.all([
        supabase.from('profiles').select('name, birth_date, sun_sign, moon_sign, rising_sign, xp, streak_days').eq('id', user.id).single(),
        supabase.from('enrollments').select('id').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('certificates').select('id').eq('user_id', user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      setStats({
        coursesActive: enrollmentsRes.data?.length || 0,
        certificates: certsRes.data?.length || 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Spinner text="Cargando tu perfil..." />;

  const meta = user?.user_metadata || {};
  const name = profile?.name || meta.name || user?.email?.split('@')[0] || 'Exploradora';
  const xp = profile?.xp || 0;
  const streak = profile?.streak_days || 0;
  const sunSign = profile?.sun_sign || '—';
  const moonSign = profile?.moon_sign || '—';
  const risingSign = profile?.rising_sign || '—';
  const level = getLevel(xp);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-selene-bg">
      <nav className="px-6 py-3.5 flex items-center gap-3 border-b border-selene-border">
        <button onClick={() => router.push('/dashboard')} className="text-selene-white-dim hover:text-selene-white">
          <BackIcon />
        </button>
        <span className="text-sm font-medium text-selene-white">Mi perfil</span>
      </nav>

      <div className="max-w-[600px] mx-auto px-5 py-8">
        {/* Avatar & Info */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-selene-gold/15 to-selene-purple/15 flex items-center justify-center border-2 border-selene-gold/25">
            <span className="text-[32px]">🌙</span>
          </div>
          <h2 className="font-display text-2xl font-normal mb-1">{name}</h2>
          <p className="text-[13px] text-selene-gold">{level.name}</p>
          {sunSign !== '—' && (
            <p className="text-xs text-selene-white-dim mt-1">
              ☉ {sunSign} · ☽ {moonSign} · ASC {risingSign}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'XP Total', value: xp, icon: '⚡' },
            { label: 'Racha', value: streak > 0 ? `${streak} días` : '0 días', icon: '🔥' },
            { label: 'Cursos activos', value: stats.coursesActive, icon: '📚' },
            { label: 'Certificados', value: stats.certificates, icon: '🎓' },
          ].map((s, i) => (
            <Card key={i} className="p-4 text-center">
              <div className="text-xl mb-1.5">{s.icon}</div>
              <div className="text-lg font-semibold text-selene-white font-display">{s.value}</div>
              <div className="text-[11px] text-selene-white-dim">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Natal Chart Summary */}
        <Card className="p-5 mb-6 border-selene-gold/20">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="text-selene-gold">✦</span>
            <span className="text-sm font-semibold text-selene-white">Tu carta natal</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Sol', value: sunSign, symbol: '☉' },
              { label: 'Luna', value: moonSign, symbol: '☽' },
              { label: 'Ascendente', value: risingSign, symbol: 'ASC' },
            ].map((p, i) => (
              <div key={i} className="text-center">
                <div className="text-lg text-selene-gold mb-1">{p.symbol}</div>
                <div className="text-[13px] font-semibold text-selene-white">{p.value}</div>
                <div className="text-[11px] text-selene-white-dim">{p.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Settings */}
        <Card className="overflow-hidden">
          {[
            { label: 'Editar perfil', icon: '✏️' },
            { label: 'Notificaciones', icon: '🔔' },
            { label: 'Método de pago', icon: '💳' },
            { label: 'Cerrar sesión', icon: '🚪', action: handleLogout, danger: true },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action || undefined}
              className={`flex items-center gap-3 px-5 py-3.5 w-full text-left hover:bg-selene-elevated/50 transition ${i > 0 ? 'border-t border-selene-border' : ''}`}
            >
              <span className="text-base">{item.icon}</span>
              <span className={`text-sm flex-1 ${item.danger ? 'text-selene-rose' : 'text-selene-white'}`}>{item.label}</span>
              <ArrowIcon size={12} className="text-selene-white-dim" />
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}
