import React, { useId } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';



import { ArrowLeft, ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';

import { getContentBySlug, ContentItem } from '../lib/content';





const ContentDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    if (!slug) return <Navigate to="/works" />;

    const post: ContentItem | undefined = getContentBySlug(slug);

    if (!post) {
        return (
            <div className="min-h-screen pt-40 pb-20 px-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">콘텐츠를 찾을 수 없습니다.</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    목록으로 이동
                </button>
            </div>
        );
    }

    const { category } = post;
    const isProject = category === 'works';
    const categoryLabel = {
        works: '작업실',
        insights: '인사이트',
        prompts: '프롬프트'
    }[category] || category;


    return (
        <article className="pt-32 pb-10 px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                {/* breadcrumb */}
                <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-xs md:text-sm font-bold tracking-widest text-black/40 hover:text-emerald-600 transition-colors flex items-center gap-2 group/back"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover/back:-translate-x-1" />
                        뒤로 가기
                    </button>

                    <div className="flex items-center gap-3">
                        <Link
                            to={`/${category}`}
                            className="text-xs md:text-sm font-bold tracking-widest text-black/40 hover:text-emerald-600 transition-colors uppercase"
                        >
                            {categoryLabel}
                        </Link>
                    </div>
                </div>

                <header className="mb-10">
                    <div className="mb-6 flex items-center gap-2">
                        {!isProject && post.tags && post.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/[0.03] text-black/40 uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] mb-3 leading-[1.1]">
                        {post.title}
                    </h1>


                </header>

                <div className="prose prose-lg prose-emerald max-w-none prose-headings:tracking-tight prose-headings:mt-12 prose-headings:mb-4 prose-headings:text-emerald-700 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mt-0 prose-p:mb-4 prose-li:my-0.5 prose-img:rounded-3xl prose-img:shadow-2xl prose-img:shadow-black/10">
                    <Markdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                            a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            ),
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            p: ({ node, children, ...props }: any) => {
                                const hasGallery = node?.children?.some(
                                    (child: any) => child.type === 'element' && child.tagName === 'img' && child.properties?.alt === 'gallery'
                                );
                                if (hasGallery) {
                                    const filteredChildren = React.Children.toArray(children).filter(
                                        (child: any) => child.type !== 'br' && (typeof child !== 'string' || child.trim() !== '')
                                    );
                                    return <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 not-prose items-start">{filteredChildren}</div>;
                                }
                                return <p {...props}>{children}</p>;
                            },
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            img: ({ src, alt, ...props }: any) => {
                                if (alt === 'preview') {
                                    return (
                                        <div className="flex justify-center md:justify-start mb-10 not-prose">
                                            <img src={src} alt={alt} className="w-48 md:w-64 h-auto rounded-[1.25rem] shadow-xl shadow-black/5 ring-1 ring-black/5" {...props} />
                                        </div>
                                    );
                                }
                                if (alt === 'youtube') {
                                    return (
                                        <div className="flex justify-center md:justify-start mb-10 not-prose w-full">
                                            <iframe 
                                                src={src} 
                                                title="YouTube video player" 
                                                frameBorder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                                allowFullScreen
                                                className="w-full max-w-[320px] aspect-[9/16] rounded-3xl shadow-xl ring-1 ring-black/5"
                                            ></iframe>
                                        </div>
                                    );
                                }
                                if (alt === 'gallery') {
                                    return <img src={src} alt={alt} className="w-full h-auto rounded-[1.25rem] object-cover" {...props} />;
                                }
                                return <img src={src} alt={alt} className="w-full h-auto rounded-3xl shadow-2xl shadow-black/10 my-10" {...props} />;
                            },
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            blockquote: ({ node, children }: any) => {
                                const calloutTypes: Record<string, { bg: string; border: string; icon: string; label: string }> = {
                                    'NOTE': { bg: 'bg-gray-50', border: 'border-gray-200', icon: '📘', label: 'NOTE' },
                                    'TIP': { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '💡', label: 'TIP' },
                                    'WARNING': { bg: 'bg-amber-50', border: 'border-amber-200', icon: '⚠️', label: 'WARNING' },
                                    'IMPORTANT': { bg: 'bg-purple-50', border: 'border-purple-200', icon: '🔔', label: 'IMPORTANT' },
                                    'INFO': { bg: 'bg-sky-50', border: 'border-sky-200', icon: 'ℹ️', label: 'INFO' },
                                };

                                // Extract raw text from the HAST node tree
                                const extractText = (n: any): string => {
                                    if (!n) return '';
                                    if (n.type === 'text') return n.value || '';
                                    if (Array.isArray(n.children)) return n.children.map(extractText).join('');
                                    return '';
                                };
                                const rawText = extractText(node).trim();
                                const match = rawText.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|INFO)\]\s?/);

                                if (match) {
                                    const type = calloutTypes[match[1]];
                                    
                                    const removeCalloutPrefix = (elements: any): any => {
                                        return React.Children.map(elements, (child) => {
                                            if (typeof child === 'string') {
                                                return child.replace(/^\[!(NOTE|TIP|WARNING|IMPORTANT|INFO)\]\s*/, '');
                                            }
                                            if (React.isValidElement(child)) {
                                                return React.cloneElement(child, {
                                                    ...(child.props as any),
                                                    children: removeCalloutPrefix((child.props as any).children)
                                                } as any);
                                            }
                                            return child;
                                        });
                                    };

                                    return (
                                        <div className={`not-prose my-6 rounded-2xl border ${type.border} ${type.bg} px-6 py-5`}>
                                            <div className="text-[0.97rem] text-gray-700 leading-relaxed m-0 [&>p]:m-0 [&_a]:text-emerald-600 [&_a]:underline [&_a:hover]:text-emerald-700">
                                                {removeCalloutPrefix(children)}
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <blockquote className="bg-emerald-50/60 rounded-2xl px-6 py-5 my-0 not-italic text-gray-700 [&>p]:my-0 [&>ul]:my-0 [&>ol]:my-0">
                                        {children}
                                    </blockquote>
                                );
                            },
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            pre: ({ children }: any) => <div className="not-prose">{children}</div>,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            code({ node, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                // Determine if it is a block code or inline code. 
                                // Block code usually has a new line at the end, and node contains position info
                                const content = String(children).replace(/\n$/, '');
                                const isBlock = match || String(children).includes('\n') || node?.position?.start?.line !== node?.position?.end?.line;

                                if (!isBlock) {
                                    return <code className="bg-gray-100 text-emerald-700 px-1.5 py-0.5 rounded text-[0.9em] font-mono" {...props}>{children}</code>;
                                }

                                return (
                                    <div className="relative rounded-2xl overflow-hidden border border-black/10 bg-white">
                                        <div className="flex items-center justify-between px-5 pt-4 pb-2 text-[12px] text-gray-500 font-sans border-b border-black/5">
                                            <span className="font-medium tracking-wide lowercase">{match ? match[1] : 'text'}</span>
                                            <button 
                                                onClick={(e) => {
                                                    navigator.clipboard.writeText(content);
                                                    const btn = e.currentTarget;
                                                    const originalHtml = btn.innerHTML;
                                                    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 복사 완료';
                                                    btn.classList.add('bg-emerald-600', 'text-white');
                                                    btn.classList.remove('bg-[#1D1D1F]', 'hover:bg-black');
                                                    setTimeout(() => {
                                                        btn.innerHTML = originalHtml;
                                                        btn.classList.remove('bg-emerald-600', 'text-white');
                                                        btn.classList.add('bg-[#1D1D1F]', 'hover:bg-black');
                                                    }, 2000);
                                                }}
                                                className="bg-[#1D1D1F] text-white hover:bg-black px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-bold"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                복사
                                            </button>
                                        </div>
                                        <div className="px-5 py-4 overflow-auto max-h-[400px] text-[14px] leading-[1.7] text-[#1F1F1F] font-mono whitespace-pre-wrap">
                                            {content}
                                        </div>
                                    </div>
                                );
                            },
                        }}
                    >{post.content}</Markdown>
                </div>


                {/* 작성일 - 하단 */}
                {post.publishedDate && (
                    <div className="mt-12 pt-6 pb-0 border-t border-black/5 flex items-center gap-6 text-black/40">
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em]">작성일</p>
                            <p className="font-mono text-sm font-medium">
                                {new Date(post.publishedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <span className="text-black/20">·</span>
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em]">작성자</p>
                            <p className="text-sm font-medium">Faith Forward</p>
                        </div>
                    </div>
                )}





                <footer className="mt-10 pt-8 border-t border-black/10">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(`/${category}`)}
                            className="btn-secondary"
                        >
                            목록으로
                        </button>
                        <button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
                        >
                            위로 가기
                        </button>
                    </div>
                </footer>
            </div>
        </article>
    );
};

export default ContentDetail;
