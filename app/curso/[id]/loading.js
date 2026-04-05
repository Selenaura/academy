export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-selene-bg">
      <div className="h-16 bg-selene-bg border-b border-white/5" />
      <section className="px-6 pt-16 pb-8 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-4" />
        <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse mb-3" />
        <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  );
}
