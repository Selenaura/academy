import { Navbar, Footer, GoldDivider } from '@/components/ui';
import { BLOG_POSTS } from '@/lib/blog-posts';
import Link from 'next/link';

export const metadata = {
  title: 'Blog — Selene Academia',
  description: 'Articulos sobre astrologia, tarot, meditacion, numerologia y autoconocimiento con base cientifica. Aprende gratis con Selene Academia.',
  alternates: {
    canonical: 'https://selenaura.com/blog',
  },
  openGraph: {
    title: 'Blog — Selene Academia',
    description: 'Articulos sobre astrologia, tarot, meditacion y autoconocimiento con base cientifica.',
    type: 'website',
  },
};

export default function BlogIndex() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-selene-bg">
        {/* Hero */}
        <section className="px-6 pt-20 pb-12 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-selene-white mb-4">
            Blog
          </h1>
          <p className="text-selene-white-dim max-w-xl mx-auto">
            Articulos sobre astrologia, tarot, meditacion y autoconocimiento.
            Ciencia y consciencia de lo invisible.
          </p>
          <GoldDivider className="mt-8" />
        </section>

        {/* Posts Grid */}
        <section className="px-6 pb-20 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-selene-card border border-selene-border rounded-2xl p-6 hover:border-selene-gold/30 transition-colors no-underline block"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wide bg-selene-gold/10 text-selene-gold">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-selene-white-dim">
                    {post.readTime}
                  </span>
                </div>

                <h2 className="font-display text-lg font-medium text-selene-white group-hover:text-selene-gold transition-colors mb-2">
                  {post.title}
                </h2>

                <p className="text-sm text-selene-white-dim line-clamp-3 mb-4">
                  {post.description}
                </p>

                <div className="flex items-center justify-between">
                  <time className="text-[11px] text-selene-white-dim" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="text-xs text-selene-gold group-hover:translate-x-1 transition-transform inline-block">
                    Leer →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
