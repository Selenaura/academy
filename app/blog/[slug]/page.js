import { Navbar, Footer, GoldDivider } from '@/components/ui';
import SchemaMarkup from '@/components/SchemaMarkup';
import { getBlogPost, getAllSlugs } from '@/lib/blog-posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Selene Academia'],
    },
  };
}

export default function BlogPost({ params }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Selene Academia',
      url: 'https://academy.selenaura.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Selene Academia',
      url: 'https://academy.selenaura.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://academy.selenaura.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <SchemaMarkup data={articleSchema} />

      <Navbar />

      <main className="min-h-screen bg-selene-bg">
        {/* Header */}
        <section className="px-6 pt-16 pb-8 max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="text-sm text-selene-white-dim hover:text-selene-gold transition-colors no-underline inline-flex items-center gap-1 mb-8"
          >
            ← Volver al blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wide bg-selene-gold/10 text-selene-gold">
              {post.category}
            </span>
            <span className="text-[11px] text-selene-white-dim">{post.readTime}</span>
            <time className="text-[11px] text-selene-white-dim" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-semibold text-selene-white mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-selene-white-dim">
            {post.description}
          </p>

          <GoldDivider className="mt-8" />
        </section>

        {/* Article Content */}
        <article className="px-6 pb-12 max-w-3xl mx-auto">
          {post.content.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="font-display text-xl md:text-2xl font-medium text-selene-white mb-4">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, j) => (
                <p key={j} className="text-selene-white-dim leading-relaxed mb-4 font-body">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>

        {/* CTA */}
        <section className="px-6 pb-20 max-w-3xl mx-auto text-center">
          <GoldDivider className="mb-8" />
          <h3 className="font-display text-xl text-selene-white mb-3">
            Empieza tu camino en Selene Academia
          </h3>
          <p className="text-selene-white-dim mb-6 max-w-md mx-auto">
            Cursos de autoconocimiento con base cientifica. Astrologia, tarot, meditacion y mas.
            Tu primer paso es gratis.
          </p>
          <Link
            href="/auth?mode=register"
            className="inline-block font-semibold bg-selene-gold text-selene-bg px-8 py-3 rounded-lg hover:brightness-110 transition-all no-underline"
          >
            Registrate gratis
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
