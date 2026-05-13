import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPostBySlug, readingTime, type SubstackPost } from '../utils/rss'
import Nav from '../components/Nav'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()

  const [post, setPost] = useState<SubstackPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetchPostBySlug(slug)
      .then(data => { setPost(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [slug])

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--gd)', color: 'var(--c)' }}>
      <Nav />
      <div className="max-w-[800px] mx-auto px-7 pt-24">

        {/* loading posts */}
        {loading && (
          <p className="py-10 text-[0.62rem]" style={{ color: 'var(--cd)', fontFamily: 'DM Mono, monospace' }}>
            fetching post...
          </p>
        )}

        {/* error */}
        {error && (
          <p className="py-10 text-[0.62rem]" style={{ color: 'var(--cd)', fontFamily: 'DM Mono, monospace' }}>
            could not load this post, please try again later
          </p>
        )}

        {/* not found */}
        {!loading && !error && !post && (
          <p className="py-10 text-[0.62rem]" style={{ color: 'var(--cd)', fontFamily: 'DM Mono, monospace' }}>
            post not found, please try again later
          </p>
        )}

        {/* post from substack */}
        {post && (
          <div>
            <div className="py-8 border-b border-[rgba(224,217,188,0.1)]">

              {/* date · reading time */}
              <div className="flex items-center gap-2 mb-4">
                <p
                  className="text-[0.55rem] uppercase tracking-widest"
                  style={{ color: 'rgba(224,217,188,0.3)', fontFamily: 'DM Mono, monospace' }}
                >
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <span style={{ color: 'rgba(224,217,188,0.2)', fontFamily: 'DM Mono, monospace', fontSize: '0.55rem' }}>·</span>
                <p
                  className="text-[0.55rem] uppercase tracking-widest"
                  style={{ color: 'rgba(224,217,188,0.3)', fontFamily: 'DM Mono, monospace' }}
                >
                  {readingTime(post.content)}
                </p>
              </div>

              {/* title */}
              <h1
                className="leading-tight mb-6"
                style={{ fontFamily: 'Times New Roman, serif', color: 'var(--c)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                {post.title}
              </h1>

              {/* link to Substack */}
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="text-[0.6rem] uppercase tracking-widest transition-colors duration-150"
                style={{ color: 'var(--cd)', fontFamily: 'DM Mono, monospace' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--c)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--cd)')}
              >
                read on substack ↗
              </a>
            </div>

            {/* post body */}
            <div
              className="py-8 prose"
              style={{ color: 'var(--c)', fontFamily: 'DM Mono, monospace' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}

      </div>
    </div>
  )
}