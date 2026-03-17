'use client';

export default function AdminError({ error, reset }) {
  return (
    <div className="min-h-screen bg-selene-bg flex flex-col items-center justify-center px-6">
      <div className="w-14 h-14 rounded-full bg-selene-rose/10 flex items-center justify-center mb-4">
        <span className="text-selene-rose text-2xl">!</span>
      </div>
      <h2 className="font-display text-xl text-selene-white mb-2">Error en el panel de administración</h2>
      <p className="text-sm text-selene-white-dim mb-6 text-center max-w-md">
        {error?.message || 'Ha ocurrido un error inesperado. Intenta recargar la página.'}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-selene-gold text-selene-bg font-semibold rounded-lg hover:brightness-110 transition text-sm"
      >
        Reintentar
      </button>
    </div>
  );
}
