export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-selene-bg">
      <div className="h-16 bg-selene-bg border-b border-white/5" />
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
