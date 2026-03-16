'use client';

import Link from 'next/link';
import { Card } from '@/components/ui';

export default function CourseError({ error, reset }) {
  return (
    <div className="min-h-screen bg-selene-bg flex items-center justify-center px-6">
      <Card className="p-8 max-w-md text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="font-display text-xl text-selene-gold mb-2">Algo salió mal</h2>
        <p className="text-sm text-selene-white-dim mb-6">
          No pudimos cargar el curso. Intenta de nuevo.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-selene-gold text-selene-bg font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition"
          >
            Reintentar
          </button>
          <Link
            href="/dashboard"
            className="border border-selene-border text-selene-white-dim font-semibold px-6 py-3 rounded-xl hover:border-selene-gold/30 transition no-underline"
          >
            Volver
          </Link>
        </div>
      </Card>
    </div>
  );
}
