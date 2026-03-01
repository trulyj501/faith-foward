import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import { getContentBySlug, ContentItem } from '../lib/content';

const ContentDetail = ({ lang }: { lang: 'ko' | 'en' }) => {
    const { slug } = useParams();

    if (!slug) return <Navigate to="/projects" />;

    const post: ContentItem | undefined = getContentBySlug(slug);

    if (!post) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-black/50 mb-8">{lang === 'ko' ? '콘텐츠를 찾을 수 없습니다.' : 'Content not found.'}</p>
                <Link to="/projects" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
                    <ArrowLeft size={16} />
                    {lang === 'ko' ? '돌아가기' : 'Go back'}
                </Link>
            </div>
        );
    }

    // Handle SEO
    const title = `${post.title} | Faith Forward`;
    const description = post.excerpt;

    useEffect(() => {
        document.title = title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }
    }, [title, description]);

    return (
        <article className="min-h-screen pt-32 pb-24 px-6 bg-[#FAFAFA]">
            <div className="max-w-3xl mx-auto">
                <Link to={`/${post.category}`} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black/40 hover:text-black transition-colors mb-12">
                    <ArrowLeft size={16} />
                    {lang === 'ko' ? '목록으로' : 'Back to list'}
                </Link>
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-sm font-bold uppercase tracking-widest text-[#1D1D1F] bg-black/5 px-3 py-1.5 rounded-full">
                            {post.category}
                        </span>
                        {post.publishedDate && (
                            <time className="text-sm font-medium text-black/40">
                                {new Date(post.publishedDate).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-sans font-bold leading-tight tracking-tight text-[#1D1D1F] mb-6">
                        {post.title}
                    </h1>

                    {post.subtitle && (
                        <p className="text-xl md:text-2xl font-medium text-black/40 leading-relaxed">
                            {post.subtitle}
                        </p>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8">
                            {post.tags.map(t => (
                                <span key={t} className="text-xs font-semibold px-2 py-1 bg-black/5 text-black/60 rounded">#{t}</span>
                            ))}
                        </div>
                    )}
                </header>

                <div className="prose prose-lg prose-emerald max-w-none markdown-body">
                    <Markdown>{post.content}</Markdown>
                </div>
            </div>
        </article>
    );
};

export default ContentDetail;
