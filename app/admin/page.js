'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MoonIcon, Card, ProgressBar, Badge } from '@/components/ui';
import { COURSES, COLORS } from '@/lib/constants';

const courseMap = {};
COURSES.forEach(c => { courseMap[c.id] = c; });

const TABS = [
  { id: 'dashboard', label: 'Panel', icon: '◆' },
  { id: 'users', label: 'Usuarios', icon: '◇' },
  { id: 'courses', label: 'Cursos', icon: '◈' },
  { id: 'payments', label: 'Pagos', icon: '◉' },
  { id: 'certificates', label: 'Certificados', icon: '◎' },
  { id: 'progress', label: 'Progreso', icon: '○' },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Data stores
  const [dashboardData, setDashboardData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);
  const [certificatesData, setCertificatesData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [errors, setErrors] = useState({});
  const fetchedTabs = useRef(new Set());

  const fetchData = useCallback(async (key, endpoint, setter) => {
    if (fetchedTabs.current.has(key)) return;
    fetchedTabs.current.add(key);
    try {
      const res = await fetch(endpoint);
      if (res.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrors(prev => ({ ...prev, [key]: body.error || `Error ${res.status}` }));
        return;
      }
      setter(await res.json());
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: 'Error de conexión' }));
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    fetchData('dashboard', '/api/admin/dashboard', setDashboardData).then(() => setLoading(false));
  }, [fetchData]);

  // Lazy load tabs
  useEffect(() => {
    if (activeTab === 'users') fetchData('users', '/api/admin/users', setUsersData);
    if (activeTab === 'payments') fetchData('payments', '/api/admin/payments', setPaymentsData);
    if (activeTab === 'certificates') fetchData('certificates', '/api/admin/certificates', setCertificatesData);
    if (activeTab === 'progress' || activeTab === 'courses') fetchData('progress', '/api/admin/progress', setProgressData);
  }, [activeTab, fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
        <p className="font-display text-lg text-selene-gold mt-6">Cargando panel de administración...</p>
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
        <Link href="/dashboard" className="text-sm text-selene-white-dim hover:text-selene-white no-underline transition">
          Volver al dashboard
        </Link>
      </nav>

      {/* Tab Navigation */}
      <div className="border-b border-selene-border bg-selene-bg/50 backdrop-blur-sm sticky top-[65px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div role="tablist" aria-label="Secciones de administración" className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-body whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-selene-gold border-selene-gold'
                    : 'text-selene-white-dim border-transparent hover:text-selene-white hover:border-selene-border'
                }`}
              >
                <span className="mr-1.5" aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8" role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={activeTab}>
        {activeTab === 'dashboard' && <DashboardTab data={dashboardData} error={errors.dashboard} />}
        {activeTab === 'users' && <UsersTab data={usersData} error={errors.users} />}
        {activeTab === 'courses' && <CoursesTab dashboardData={dashboardData} progressData={progressData} error={errors.progress} />}
        {activeTab === 'payments' && <PaymentsTab data={paymentsData} error={errors.payments} />}
        {activeTab === 'certificates' && <CertificatesTab data={certificatesData} error={errors.certificates} />}
        {activeTab === 'progress' && <ProgressTab data={progressData} error={errors.progress} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════
function DashboardTab({ data, error }) {
  if (error) return <TabError message={error} />;
  if (!data) return <TabLoader />;

  const { users, revenue, enrollments, certificates, lessons, registrationTrend } = data;
  const maxTrend = Math.max(...(registrationTrend || []).map(d => d.count || 0), 1);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Ingresos totales" value={formatCents(revenue.total)} sub={`Este mes: ${formatCents(revenue.thisMonth)}`} color={COLORS.gold} />
        <KPICard label="Usuarios totales" value={users.total} sub={`Hoy: +${users.registeredToday} · Activos 7d: ${users.activeLastWeek}`} color={COLORS.teal} />
        <KPICard label="Inscripciones" value={enrollments.total} sub={`Activas: ${enrollments.active} · Completadas: ${enrollments.completed}`} color={COLORS.blue} />
        <KPICard label="Certificados" value={certificates.total} sub={`Lecciones completadas: ${lessons.completed}`} color={COLORS.purple} />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue comparison */}
        <Card className="p-6">
          <h3 className="font-display text-lg text-selene-white mb-4">Ingresos mensuales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-selene-elevated rounded-xl p-4">
              <p className="text-xs text-selene-white-dim mb-1">Este mes</p>
              <p className="text-2xl font-display text-selene-gold">{formatCents(revenue.thisMonth)}</p>
            </div>
            <div className="bg-selene-elevated rounded-xl p-4">
              <p className="text-xs text-selene-white-dim mb-1">Mes anterior</p>
              <p className="text-2xl font-display text-selene-white-dim">{formatCents(revenue.lastMonth)}</p>
            </div>
          </div>
          {revenue.lastMonth > 0 && (
            <p className="text-xs mt-3 text-selene-white-dim">
              {revenue.thisMonth >= revenue.lastMonth ? '▲' : '▼'}{' '}
              {Math.abs(Math.round(((revenue.thisMonth - revenue.lastMonth) / revenue.lastMonth) * 100))}% vs mes anterior
            </p>
          )}
        </Card>

        {/* User stats */}
        <Card className="p-6">
          <h3 className="font-display text-lg text-selene-white mb-4">Estado de usuarios</h3>
          <div className="space-y-3">
            <StatBar label="Onboarding completado" value={users.onboarded} total={users.total} color={COLORS.teal} />
            <StatBar label="Con cursos inscritos" value={users.withCourses || 0} total={users.total} color={COLORS.blue} />
            <StatBar label="Registros este mes" value={users.registeredThisMonth} total={users.total} color={COLORS.purple} />
          </div>
        </Card>
      </div>

      {/* Registration trend */}
      {registrationTrend && registrationTrend.length > 0 && (
        <Card className="p-6">
          <h3 className="font-display text-lg text-selene-white mb-4">Nuevos registros (últimos 30 días)</h3>
          <div className="flex items-end gap-[3px] h-24">
            {registrationTrend.map(d => (
              <div key={d.date} className="flex-1 flex flex-col items-center group relative">
                <div
                  className="w-full bg-selene-gold/70 rounded-t hover:bg-selene-gold transition-colors min-h-[2px]"
                  style={{ height: `${Math.max((d.count / maxTrend) * 100, 2)}%` }}
                />
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-selene-elevated border border-selene-border rounded px-2 py-1 text-[10px] text-selene-white whitespace-nowrap z-10">
                  {d.date}: {d.count} {d.count === 1 ? 'registro' : 'registros'}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-selene-white-dim mt-2">
            <span>{registrationTrend[0].date.slice(5)}</span>
            <span>{registrationTrend[registrationTrend.length - 1].date.slice(5)}</span>
          </div>
        </Card>
      )}

      {/* Revenue by course */}
      <Card className="p-6">
        <h3 className="font-display text-lg text-selene-white mb-4">Ingresos por curso</h3>
        <div className="space-y-3">
          {COURSES.filter(c => c.price > 0).map(course => {
            const rev = revenue.byCourse[course.id] || 0;
            const enr = enrollments.byCourse[course.id]?.total || 0;
            return (
              <div key={course.id} className="flex items-center gap-4">
                <span className="text-xl w-8" aria-hidden="true">{course.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm text-selene-white truncate">{course.title}</p>
                    <p className="text-sm font-display text-selene-gold ml-2 shrink-0">{formatCents(rev)}</p>
                  </div>
                  <p className="text-[11px] text-selene-white-dim">{enr} {enr === 1 ? 'inscripción' : 'inscripciones'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════
function UsersTab({ data, error }) {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  if (error) return <TabError message={error} />;
  if (!data) return <TabLoader />;

  const users = data.users || [];
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.sun_sign?.toLowerCase().includes(q);
  });

  if (selectedUser) {
    return <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total usuarios" value={data.total} />
        <StatCard label="Onboarding completo" value={users.filter(u => u.onboarding_complete).length} />
        <StatCard label="Con cursos" value={users.filter(u => u.enrollments.length > 0).length} />
        <StatCard label="Registros hoy" value={users.filter(u => isToday(u.created_at)).length} />
      </div>

      {/* Search */}
      <label className="block">
        <span className="sr-only">Buscar usuarios</span>
        <input
          type="search"
          placeholder="Buscar por nombre, email o signo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 bg-selene-elevated border border-selene-border rounded-xl text-selene-white font-body text-sm outline-none focus:border-selene-gold/40 transition placeholder:text-selene-white-dim/50"
        />
      </label>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Lista de usuarios">
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
                <tr
                  key={u.id}
                  className="border-b border-selene-border/50 hover:bg-selene-elevated/30 transition cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver detalle de ${u.name || u.email}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedUser(u); } }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-selene-elevated flex items-center justify-center text-selene-gold font-display text-sm">
                        {(u.name || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-selene-white font-medium">{u.name || 'Sin nombre'}</p>
                        {!u.onboarding_complete && <span className="text-[10px] text-selene-rose">Sin onboarding</span>}
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
                            {courseMap[e.course_id]?.title || e.course_id}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-selene-white-dim text-xs hidden lg:table-cell">{formatDate(u.created_at)}</td>
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
      </Card>
      <p className="text-xs text-selene-white-dim">Mostrando {filtered.length} de {data.total} usuarios</p>
    </div>
  );
}

function UserDetail({ user, onBack }) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-selene-white-dim hover:text-selene-white transition flex items-center gap-1">
        ← Volver a usuarios
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-selene-elevated flex items-center justify-center text-selene-gold font-display text-2xl mb-3">
              {(user.name || '?')[0].toUpperCase()}
            </div>
            <h2 className="font-display text-xl text-selene-white">{user.name || 'Sin nombre'}</h2>
            <p className="text-sm text-selene-white-dim mt-1">{user.email}</p>
            {!user.onboarding_complete && (
              <Badge color={COLORS.rose} className="mt-2">Sin onboarding</Badge>
            )}
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <DetailRow label="Signo solar" value={user.sun_sign} />
            <DetailRow label="Signo lunar" value={user.moon_sign} />
            <DetailRow label="Ascendente" value={user.rising_sign} />
            <DetailRow label="Nivel" value={user.experience_level} />
            <DetailRow label="XP" value={user.xp} highlight />
            <DetailRow label="Racha" value={`${user.streak_days || 0} días`} />
            <DetailRow label="Último acceso" value={user.last_active_at ? formatDate(user.last_active_at) : 'Nunca'} />
            <DetailRow label="Registro" value={formatDate(user.created_at)} />
          </div>
        </Card>

        {/* Enrollments */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-display text-lg text-selene-white mb-4">Inscripciones ({user.enrollments.length})</h3>
          {user.enrollments.length === 0 ? (
            <p className="text-selene-white-dim text-sm">Este usuario no tiene inscripciones.</p>
          ) : (
            <div className="space-y-3">
              {user.enrollments.map(e => {
                const course = courseMap[e.course_id];
                return (
                  <div key={e.course_id} className="bg-selene-elevated rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" aria-hidden="true">{course?.icon || '📚'}</span>
                        <p className="text-sm text-selene-white font-medium">{course?.title || e.course_id}</p>
                      </div>
                      <Badge color={e.status === 'completed' ? COLORS.success : e.status === 'active' ? COLORS.teal : COLORS.rose}>
                        {e.status === 'completed' ? 'Completado' : e.status === 'active' ? 'Activo' : e.status}
                      </Badge>
                    </div>
                    <ProgressBar value={e.progress || 0} color={course?.color || COLORS.gold} />
                    <div className="flex justify-between mt-2 text-[11px] text-selene-white-dim">
                      <span>Progreso: {Math.round((e.progress || 0) * 100)}%</span>
                      <span>Inscrito: {formatDate(e.enrolled_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// COURSES TAB
// ═══════════════════════════════════════
function CoursesTab({ dashboardData, progressData, error }) {
  if (error) return <TabError message={error} />;
  if (!dashboardData) return <TabLoader />;

  const { enrollments, revenue } = dashboardData;

  return (
    <div className="space-y-6">
      {COURSES.map(course => {
        const enr = enrollments.byCourse[course.id] || { total: 0, active: 0, completed: 0 };
        const rev = revenue.byCourse[course.id] || 0;
        const lessonStats = progressData?.lessons?.byCourse[course.id] || { completed: 0, inProgress: 0, totalTime: 0 };
        const quizStats = progressData?.quizzes?.byCourse[course.id] || { attempts: 0, passed: 0, avgScore: 0, passRate: 0 };
        const completionRate = enr.total > 0 ? enr.completed / enr.total : 0;

        return (
          <Card key={course.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">{course.icon}</span>
                <div>
                  <h3 className="font-display text-lg text-selene-white">{course.title}</h3>
                  <p className="text-xs text-selene-white-dim">{course.level} · {course.hours} · {course.lessons_count} lecciones</p>
                </div>
              </div>
              <Badge color={course.color}>{course.price === 0 ? 'GRATIS' : course.price_label}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <MiniStat label="Inscripciones" value={enr.total} />
              <MiniStat label="Activos" value={enr.active} />
              <MiniStat label="Completados" value={enr.completed} />
              <MiniStat label="Ingresos" value={formatCents(rev)} />
            </div>

            {progressData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <MiniStat label="Lecciones completadas" value={lessonStats.completed} />
                <MiniStat label="Lecciones en progreso" value={lessonStats.inProgress} />
                <MiniStat label="Intentos quiz" value={quizStats.attempts} />
                <MiniStat label="Tasa aprobación" value={`${Math.round(quizStats.passRate * 100)}%`} />
              </div>
            )}

            {/* Completion rate bar */}
            <div>
              <div className="flex justify-between text-xs text-selene-white-dim mb-1">
                <span>Tasa de completado</span>
                <span>{Math.round(completionRate * 100)}%</span>
              </div>
              <ProgressBar value={completionRate} color={course.color} height={6} />
            </div>

            {lessonStats.totalTime > 0 && (
              <p className="text-[11px] text-selene-white-dim mt-2">
                Tiempo total invertido: {formatTime(lessonStats.totalTime)}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// PAYMENTS TAB
// ═══════════════════════════════════════
function PaymentsTab({ data, error }) {
  const [filter, setFilter] = useState('all');

  if (error) return <TabError message={error} />;
  if (!data) return <TabLoader />;

  const payments = data.payments || [];
  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter || (filter === 'completed' && p.status === 'succeeded'));

  const completedPayments = payments.filter(p => p.status === 'completed' || p.status === 'succeeded');
  const totalRevenue = completedPayments.reduce((s, p) => s + (p.amount || 0), 0);
  const totalTransactions = completedPayments.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Ingresos totales" value={formatCents(totalRevenue)} />
        <StatCard label="Transacciones completadas" value={totalTransactions} />
        <StatCard label="Ticket medio" value={totalTransactions > 0 ? formatCents(Math.round(totalRevenue / totalTransactions)) : '—'} />
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar pagos por estado">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'completed', label: 'Completados' },
          { key: 'pending', label: 'Pendientes' },
          { key: 'failed', label: 'Fallidos' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`px-3 py-1.5 text-xs rounded-lg transition ${
              filter === f.key ? 'bg-selene-gold text-selene-bg' : 'bg-selene-elevated text-selene-white-dim hover:text-selene-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Historial de pagos">
            <thead>
              <tr className="border-b border-selene-border text-selene-white-dim text-left">
                <th className="px-5 py-3.5 font-medium">Fecha</th>
                <th className="px-5 py-3.5 font-medium">Usuario</th>
                <th className="px-5 py-3.5 font-medium hidden sm:table-cell">Curso</th>
                <th className="px-5 py-3.5 font-medium">Importe</th>
                <th className="px-5 py-3.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-selene-border/50 hover:bg-selene-elevated/30 transition">
                  <td className="px-5 py-3.5 text-selene-white-dim text-xs">{formatDate(p.created_at)}</td>
                  <td className="px-5 py-3.5 text-selene-white">{p.email || '—'}</td>
                  <td className="px-5 py-3.5 text-selene-white-dim text-xs hidden sm:table-cell">
                    {courseMap[p.course_id]?.title || p.course_id || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-selene-gold font-display">{formatCents(p.amount)}</td>
                  <td className="px-5 py-3.5">
                    <PaymentStatus status={p.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-selene-white-dim">
                    {filter === 'all' ? 'No hay pagos registrados' : 'No hay pagos con este estado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-xs text-selene-white-dim">Mostrando {filtered.length} de {payments.length} pagos</p>
    </div>
  );
}

// ═══════════════════════════════════════
// CERTIFICATES TAB
// ═══════════════════════════════════════
function CertificatesTab({ data, error }) {
  if (error) return <TabError message={error} />;
  if (!data) return <TabLoader />;

  const certs = data.certificates || [];

  // Group by course
  const byCourse = {};
  certs.forEach(c => {
    if (!byCourse[c.course_id]) byCourse[c.course_id] = [];
    byCourse[c.course_id].push(c);
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total certificados" value={certs.length} />
        <StatCard label="Cursos con certificados" value={Object.keys(byCourse).length} />
        <StatCard label="Último emitido" value={certs.length > 0 ? formatDate(certs[0].issued_at) : '—'} />
      </div>

      {/* Certificates by course */}
      {Object.entries(byCourse).map(([courseId, courseCerts]) => {
        const course = courseMap[courseId];
        return (
          <Card key={courseId} className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg" aria-hidden="true">{course?.icon || '📚'}</span>
              <h3 className="font-display text-base text-selene-white">{course?.title || courseId}</h3>
              <span className="text-xs text-selene-white-dim ml-auto">{courseCerts.length} {courseCerts.length === 1 ? 'certificado' : 'certificados'}</span>
            </div>
            <div className="space-y-2">
              {courseCerts.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-selene-elevated rounded-lg px-4 py-2.5 text-sm">
                  <div>
                    <p className="text-selene-white">{c.user_name || 'Sin nombre'}</p>
                    <p className="text-[11px] text-selene-white-dim">{c.user_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-selene-gold font-mono">{c.certificate_code}</p>
                    <p className="text-[10px] text-selene-white-dim">{formatDate(c.issued_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {certs.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-selene-white-dim">Aún no se han emitido certificados.</p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// PROGRESS TAB
// ═══════════════════════════════════════
function ProgressTab({ data, error }) {
  if (error) return <TabError message={error} />;
  if (!data) return <TabLoader />;

  const { lessons, quizzes } = data;
  const totalPassed = Object.values(quizzes.byCourse).reduce((s, q) => s + q.passed, 0);
  const totalScore = Object.values(quizzes.byCourse).reduce((s, q) => s + q.totalScore, 0);
  const globalAvg = quizzes.totalAttempts > 0 ? Math.round((totalScore / quizzes.totalAttempts) * 100) : 0;

  const coursesWithData = COURSES.filter(c => lessons.byCourse[c.id] || quizzes.byCourse[c.id]);

  return (
    <div className="space-y-8">
      {/* Global stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Progreso registrado" value={lessons.total} />
        <StatCard label="Intentos de quiz" value={quizzes.totalAttempts} />
        <StatCard label="Quizzes aprobados" value={totalPassed} />
        <StatCard label="Nota media global" value={quizzes.totalAttempts > 0 ? `${globalAvg}%` : '—'} />
      </div>

      {/* Per course breakdown */}
      {coursesWithData.map(course => {
        const ls = lessons.byCourse[course.id] || { completed: 0, inProgress: 0, totalTime: 0 };
        const qs = quizzes.byCourse[course.id];

        return (
          <Card key={course.id} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl" aria-hidden="true">{course.icon}</span>
              <h3 className="font-display text-base text-selene-white">{course.title}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <MiniStat label="Lecciones completadas" value={ls.completed} />
              <MiniStat label="En progreso" value={ls.inProgress} />
              <MiniStat label="Tiempo total" value={formatTime(ls.totalTime)} />
              <MiniStat label="Tiempo medio/lección" value={ls.completed > 0 ? formatTime(Math.round(ls.totalTime / ls.completed)) : '—'} />
            </div>

            {qs && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MiniStat label="Intentos quiz" value={qs.attempts} />
                <MiniStat label="Aprobados" value={qs.passed} />
                <MiniStat label="Tasa aprobación" value={`${Math.round(qs.passRate * 100)}%`} />
                <MiniStat label="Nota media" value={`${Math.round(qs.avgScore * 100)}%`} />
              </div>
            )}

            {/* Per-quiz breakdown */}
            {(course.lessons || []).filter(l => l.type === 'quiz' || l.type === 'exam').map(lesson => {
              const lq = quizzes.byLesson[lesson.id];
              if (!lq) return null;
              return (
                <div key={lesson.id} className="mt-3 bg-selene-elevated rounded-lg px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                  <div>
                    <p className="text-selene-white">{lesson.title}</p>
                    <p className="text-[10px] text-selene-white-dim">{lesson.type === 'exam' ? 'Examen final' : 'Quiz'}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-selene-white-dim">
                    <span>{lq.attempts} {lq.attempts === 1 ? 'intento' : 'intentos'}</span>
                    <span>{Math.round(lq.passRate * 100)}% aprobados</span>
                    <span className="text-selene-gold">{Math.round(lq.avgScore * 100)}% nota media</span>
                  </div>
                </div>
              );
            })}
          </Card>
        );
      })}

      {coursesWithData.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-selene-white-dim">Aún no hay datos de progreso registrados.</p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════
function KPICard({ label, value, sub, color }) {
  return (
    <Card className="p-5">
      <p className="text-3xl font-display" style={{ color }}>{value}</p>
      <p className="text-xs text-selene-white-dim mt-1">{label}</p>
      {sub && <p className="text-[10px] text-selene-white-dim/70 mt-1">{sub}</p>}
    </Card>
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

function MiniStat({ label, value }) {
  return (
    <div className="bg-selene-elevated rounded-lg p-3">
      <p className="text-lg font-display text-selene-white">{value}</p>
      <p className="text-[10px] text-selene-white-dim">{label}</p>
    </div>
  );
}

function StatBar({ label, value, total, color }) {
  const pct = total > 0 ? value / total : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-selene-white-dim">{label}</span>
        <span className="text-selene-white">{value} <span className="text-selene-white-dim">/ {total}</span></span>
      </div>
      <ProgressBar value={pct} color={color} height={5} />
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-selene-border/30">
      <span className="text-selene-white-dim">{label}</span>
      <span className={highlight ? 'text-selene-gold font-display' : 'text-selene-white capitalize'}>{value || '—'}</span>
    </div>
  );
}

function PaymentStatus({ status }) {
  const config = {
    completed: { cls: 'bg-selene-success/10 text-selene-success', label: 'Completado' },
    succeeded: { cls: 'bg-selene-success/10 text-selene-success', label: 'Completado' },
    pending: { cls: 'bg-selene-gold/10 text-selene-gold', label: 'Pendiente' },
    failed: { cls: 'bg-selene-rose/10 text-selene-rose', label: 'Fallido' },
  };
  const c = config[status] || { cls: 'bg-selene-elevated text-selene-white-dim', label: status || 'Desconocido' };
  return <span className={`text-[11px] px-2 py-0.5 rounded ${c.cls}`}>{c.label}</span>;
}

function TabLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20" role="status" aria-label="Cargando">
      <div className="w-10 h-10 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
      <p className="text-sm text-selene-white-dim mt-4">Cargando datos...</p>
    </div>
  );
}

function TabError({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20" role="alert">
      <div className="w-12 h-12 rounded-full bg-selene-rose/10 flex items-center justify-center mb-4">
        <span className="text-selene-rose text-xl">!</span>
      </div>
      <p className="text-selene-rose font-medium mb-1">Error al cargar datos</p>
      <p className="text-sm text-selene-white-dim">{message}</p>
    </div>
  );
}

// ═══════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCents(cents) {
  if (typeof cents !== 'number' || isNaN(cents)) return '—';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

function formatTime(seconds) {
  if (!seconds || seconds <= 0) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function isToday(iso) {
  if (!iso) return false;
  return iso.slice(0, 10) === new Date().toISOString().slice(0, 10);
}
