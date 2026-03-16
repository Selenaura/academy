'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { getLevel } from '@/lib/constants';
import { Card, BackIcon, ArrowIcon } from '@/components/ui';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth?mode=login'); return; }
      setUser(user);
    }
    load();
  }, []);

  if (!user) return null;

  const meta = user.user_metadata || {};
  const profile = {
    name: meta.name || user.email?.split('@')[0] || 'Exploradora',
    sign: 'Escorpio', // Calculated from birth_date in production
    moon: 'Cáncer',
    rising: 'Leo',
    xp: 1240,
    streak: 7,
    certificates: 0,
    coursesActive: 2,
  };
  const level = getLevel(profile.xp);

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
          <h2 className="font-display text-2xl font-normal mb-1">{profile.name}</h2>
          <p className="text-[13px] text-selene-gold">{level.name}</p>
          <p className="text-xs text-selene-white-dim mt-1">
            ☉ {profile.sign} · ☽ {profile.moon} · ASC {profile.rising}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'XP Total', value: profile.xp, icon: '⚡' },
            { label: 'Racha', value: `${profile.streak} días`, icon: '🔥' },
            { label: 'Cursos activos', value: profile.coursesActive, icon: '📚' },
            { label: 'Certificados', value: profile.certificates, icon: '🎓' },
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
              { label: 'Sol', value: profile.sign, symbol: '☉' },
              { label: 'Luna', value: profile.moon, symbol: '☽' },
              { label: 'Ascendente', value: profile.rising, symbol: 'ASC' },
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
            { label: 'Editar perfil', icon: '✏️', href: '#' },
            { label: 'Notificaciones', icon: '🔔', href: '#' },
            { label: 'Método de pago', icon: '💳', href: '#' },
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
