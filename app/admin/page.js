'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoonIcon } from '@/components/ui';
import { COURSES } from '@/lib/constants';

const courseNames = {};
COURSES.forEach(c => { courseNames[c.id] = c.title; });

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/users');
      if (res.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (!res.ok) {
        setError('Error al cargar usuarios');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setLoading(false);
    }
    load();
  }, [router]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.sun_sign?.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
        <p className="font-display text-lg text-selene-gold mt-6">Cargando panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <p className="text-selene-rose">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-selene-bg">
      {/* Header */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-selene-bg/90 backdrop-blur-xl border-b border-selene-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
          <MoonIcon size={24} />
          <span className="font-display text-[22px] font-semibold text-selene-gold tracking-wider">SELENE</span>
          <span className="text-[11px] text-selene-rose bg-selene-rose/10 px-2 py-0.5 rounded ml-1 font-semibold">ADMIN</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-selene-white-dim hover:text-selene-white no-underline">
          Volver al dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total usuarios" value={total} />
          <StatCard label="Onboarding completo" value={users.filter(u => u.onboarding_complete).length} />
          <StatCard label="Con cursos" value={users.filter(u => u.enrollments.length > 0).length} />
          <StatCard label="Registros hoy" value={users.filter(u => isToday(u.created_at)).length} />
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, email o signo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition placeholder:text-selene-white-dim/50"
          />
        </div>

        {/* User table */}
        <div className="bg-selene-card rounded-2xl border border-selene-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-selene-border text-selene-white-dim text-left">
                  <th className="px-5 py-3.5 font-medium">Usuario</th>
                  <th className="px-5 py-3.5 font-medium">Email</th>
                  <th className="px-5 py-3.5 font-medium hidden sm:table-cell">Signo</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">Nivel</th>
                  <th className="px-5 py-3.5 font-medium hidden md:table-cell">XP</th>
                  <th className="px-5 py-3.5 font-medium">Cursos</th>
                  <th className="px-5 py-3.5 font-medium hidden lg:table-cell">Registro</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-selene-border/50 hover:bg-selene-elevated/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-selene-elevated flex items-center justify-center text-selene-gold font-display text-sm">
                          {(u.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-selene-white font-medium">{u.name || 'Sin nombre'}</p>
                          {!u.onboarding_complete && (
                            <span className="text-[10px] text-selene-rose">Sin onboarding</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-selene-white-dim">{u.email}</td>
                    <td className="px-5 py-3.5 text-selene-white-dim hidden sm:table-cell">{u.sun_sign || '—'}</td>
                    <td className="px-5 py-3.5 text-selene-white-dim hidden md:table-cell capitalize">{u.experience_level || '—'}</td>
                    <td className="px-5 py-3.5 text-selene-gold hidden md:table-cell">{u.xp}</td>
                    <td className="px-5 py-3.5">
                      {u.enrollments.length === 0 ? (
                        <span className="text-selene-white-dim">—</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {u.enrollments.map(e => (
                            <span key={e.course_id} className="text-[11px] bg-selene-elevated px-2 py-0.5 rounded text-selene-white-dim">
                              {courseNames[e.course_id] || e.course_id}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-selene-white-dim text-xs hidden lg:table-cell">
                      {formatDate(u.created_at)}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-selene-white-dim">
                      {search ? 'Sin resultados para esa búsqueda' : 'No hay usuarios registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-selene-white-dim mt-4">
          Mostrando {filtered.length} de {total} usuarios
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-selene-card rounded-xl border border-selene-border p-4">
      <p className="text-2xl font-display text-selene-gold">{value}</p>
      <p className="text-[11px] text-selene-white-dim mt-1">{label}</p>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isToday(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}
