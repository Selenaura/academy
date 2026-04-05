export default function CatalogoLoading() {
  return (
    <div className="min-h-screen bg-selene-bg">
      <div className="h-16 bg-selene-bg border-b border-white/5" />
      <section className="px-6 pt-20 pb-8 text-center">
        <div className="h-10 w-64 mx-auto bg-white/5 rounded-lg animate-pulse mb-3" />
        <div className="h-5 w-96 mx-auto bg-white/5 rounded animate-pulse" />
      </section>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl h-64 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
