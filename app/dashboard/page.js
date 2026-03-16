'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { COURSES, getLevel } from '@/lib/constants';
import { Navbar, Card, ProgressBar, SectionTitle, BookIcon, CertIcon, StarIcon, ArrowIcon } from '@/components/ui';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock enrollment data (will come from Supabase in production)
  const [enrollments] = useState({
    'brujula-interior': { enrolled: true, progress: 0.35 },
    'magnetismo-consciente': { enrolled: true, progress: 0.12 },
  });

  const userProfile = {
    name: user?.user_metadata?.name || 'Exploradora',
    xp: 1240,
    xpNext: 2000,
    certificates: 0,
    streak: 7,
  };

  const level = getLevel(userProfile.xp);
  const enrolled = COURSES.filter(c => enrollments[c.id]?.enrolled);
  const explore = COURSES.filter(c => !enrollments[c.id]?.enrolled);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth?mode=login');
        return;
      }
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-selene-bg flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-selene-border border-t-selene-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-selene-bg">
      <Navbar showAuth={false} showDashboardNav />

      <div className="max-w-[800px] mx-auto px-5 py-6">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-[26px] font-normal mb-1.5">
            Hola, {userProfile.name} <span className="text-xl">✦</span>
          </h1>
          <p className="text-[13px] text-selene-white-dim">
            Racha de {userProfile.streak} días · {level.name}
          </p>
        </div>

        {/* XP Bar */}
        <Card className="p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-selene-white-dim">{level.name}</span>
            <span className="text-xs text-selene-gold">{userProfile.xp} / {userProfile.xpNext} XP</span>
          </div>
          <ProgressBar value={userProfile.xp / userProfile.xpNext} height={6} />
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <BookIcon size={18} />, label: 'Cursos activos', value: enrolled.length },
            { icon: <CertIcon size={18} />, label: 'Certificados', value: userProfile.certificates },
            { icon: <StarIcon size={18} />, label: 'Racha', value: `${userProfile.streak}d` },
          ].map((s, i) => (
            <Card key={i} className="p-4 text-center">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="text-xl font-semibold text-selene-white font-display">{s.value}</div>
              <div className="text-[11px] text-selene-white-dim mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Continue Learning */}
        {enrolled.length > 0 && (
          <div className="mb-8">
            <SectionTitle>Continúa aprendiendo</SectionTitle>
            {enrolled.map(course => {
              const enrollment = enrollments[course.id];
              const nextLesson = course.lessons.find(l => l.type === 'video') || course.lessons[0];
              return (
                <Link key={course.id} href={`/curso/${course.id}`} className="no-underline block mb-3">
                  <Card hover className="p-5">
                    <div className="flex gap-4 items-start">
                      <div
                        className="w-[52px] h-[52px] rounded-[14px] shrink-0 flex items-center justify-center text-2xl border"
                        style={{ background: `${course.color}18`, borderColor: `${course.color}30` }}
                      >
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[15px] font-semibold text-selene-white mb-0.5">{course.title}</div>
                            <div className="text-xs text-selene-white-dim">{course.subtitle}</div>
                          </div>
                          <span className="text-[13px] text-selene-gold font-semibold shrink-0 ml-3">
                            {Math.round(enrollment.progress * 100)}%
                          </span>
                        </div>
                        <ProgressBar value={enrollment.progress} color={course.color} className="mt-3" />
                        {nextLesson && (
                          <div className="text-[11px] text-selene-white-dim mt-2">
                            Siguiente: {nextLesson.title}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Explore Courses */}
        <div>
          <SectionTitle subtitle="Descubre tu siguiente paso">Explora cursos</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {explore.map(course => (
              <Link key={course.id} href={`/curso/${course.id}`} className="no-underline">
                <Card hover className="p-[18px]">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[28px]">{course.icon}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wide"
                      style={{ color: '#0A0A0F', background: course.color }}
                    >
                      {course.tag}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-selene-white mb-1 leading-tight">{course.title}</div>
                  <div className="text-[11px] text-selene-white-dim mb-2.5">{course.level} · {course.hours}</div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-bold ${course.price === 0 ? 'text-selene-success' : 'text-selene-gold'}`}>
                      {course.price_label}
                    </span>
                    <ArrowIcon size={14} className="text-selene-white-dim" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
