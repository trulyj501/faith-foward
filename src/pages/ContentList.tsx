import React, { useMemo, useId } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles, X } from 'lucide-react';

import { getContentByCategory } from '../lib/content';

// ── Recommendation Badge Component ──
const RecommendationBadge = ({ rating }: { rating: number | string }) => {
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (isNaN(numericRating) || numericRating < 4.5) return null;

    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100/50 text-[#059669] shadow-sm animate-in fade-in zoom-in duration-500">
            <Sparkles size={12} className="fill-emerald-600/10" />
            <span className="text-[10px] font-bold tracking-tight">추천</span>
        </div>
    );
};



const CATEGORY_LABELS: Record<string, { ko: string; sub_ko: string }> = {
    services: {
        ko: '서비스',
        sub_ko: '신앙과 기술의 경계에서 만들어가는 것들',
    },
    insights: {
        ko: '인사이트',
        sub_ko: '믿음과 디지털 문화에 관한 생각들',
    },
    prompts: {
        ko: '프롬프트',
        sub_ko: '신앙생활과 사역을 돕는 효과적인 질문들',
    },
};


const ContentList = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tagFilter = searchParams.get('tag');

    const currentCategory = category || 'services';
    const items = useMemo(() => getContentByCategory(currentCategory), [currentCategory]);
    const label = CATEGORY_LABELS[currentCategory]?.ko || currentCategory;
    const subLabel = CATEGORY_LABELS[currentCategory]?.sub_ko || '';

    const displayItems = useMemo(() => {
        if (!tagFilter) return items;
        return items.filter(item => (item as any).label === tagFilter);
    }, [items, tagFilter]);

    const groupedInsights = useMemo(() => {
        if (currentCategory !== 'insights' || tagFilter) return null;
        const groups: Record<string, typeof items> = {};
        items.forEach(item => {
            const tag = (item as any).label || '기타';
            if (!groups[tag]) groups[tag] = [];
            groups[tag].push(item);
        });
        return groups;
    }, [items, currentCategory, tagFilter]);

    return (
        <section className="pt-20 md:pt-40 pb-32 px-6 sm:px-10 md:px-16 lg:px-24 min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-[#E5E5E5] pb-8">
                    <div>
                        <p className="label-mono mb-3">전체 목록</p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] text-[#1D1D1F] leading-[1.1]">
                            {label}
                        </h1>
                        {subLabel && (
                            <p className="text-lg text-black/40 font-medium mt-3 max-w-xl">{subLabel}</p>
                        )}
                        {tagFilter && (
                            <div className="mt-6 flex items-center gap-3">
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100/50">
                                    <span className="opacity-60 text-xs">태그:</span>
                                    {tagFilter}
                                    <button onClick={() => setSearchParams({})} className="hover:bg-emerald-200/50 rounded-full p-0.5 ml-1 transition-colors">
                                        <X size={14} />
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cards */}
                {displayItems.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-black/40">게시글이 없습니다.</p>
                    </div>
                ) : groupedInsights ? (
                    <div className="space-y-20">
                        {Object.entries(groupedInsights).map(([tag, tagItems]) => (
                            <div key={tag}>
                                <div className="mb-2 pb-4 border-b-[1.5px] border-black/10">
                                    <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{tag}</h2>
                                </div>
                                <div className="flex flex-col">
                                    {tagItems.slice(0, 5).map(item => (
                                        <div
                                            key={item.slug}
                                            onClick={() => { navigate(`/insights/${item.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="group cursor-pointer py-5 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6"
                                        >
                                            <div className="flex items-center flex-grow">
                                                <h3 className="text-lg font-bold text-[#1D1D1F] group-hover:text-emerald-600 transition-colors" style={{ letterSpacing: '-0.02em', lineHeight: 1.4 }}>
                                                    {item.title}
                                                    {(item as any).rating != null && (item as any).rating >= 4.5 && (
                                                        <span className="inline-block ml-1.5 align-middle text-[1.125rem]" role="img" aria-label="추천">✨</span>
                                                    )}
                                                </h3>
                                            </div>
                                            <span className="text-sm font-medium text-black/40 font-mono shrink-0">
                                                {item.publishedDate ? new Date(item.publishedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '') : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {tagItems.length > 5 && (
                                    <div className="mt-6 flex">
                                        <button
                                            onClick={() => setSearchParams({ tag })}
                                            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                                        >
                                            모든 {tag} 글 보기 <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {displayItems.map((item) => {
                            if (currentCategory === 'services') {
                                return (
                                    <div
                                        key={item.slug}
                                        onClick={() => { navigate(`/services/${item.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="apple-card group cursor-pointer flex flex-col overflow-hidden active:scale-[0.98] transform-gpu bg-white shadow-xl shadow-black/[0.03]"
                                    >
                                        <div className="w-full aspect-[16/9] overflow-hidden bg-[#F5F5F7]">
                                            <img
                                                src={(item as any).image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        <div className="p-8 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-[#1D1D1F] mb-3" style={{ letterSpacing: '-0.03em' }}>{item.title}</h3>
                                            <p className="text-[#636366] text-base leading-[1.6] line-clamp-2 flex-grow mb-6" style={{ letterSpacing: '-0.01em' }}>
                                                {item.excerpt}
                                            </p>
                                            <div className="flex items-center gap-6 mt-4 font-sans">
                                                {(item as any).url && (
                                                    <a
                                                        href={(item as any).url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="group/url inline-flex items-center gap-1 text-[#059669] text-[0.93rem] font-bold relative w-fit hover:text-emerald-700 transition-colors"
                                                    >
                                                        <span>사이트 가기</span>
                                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/url:-translate-y-0.5 group-hover/url:translate-x-0.5" strokeWidth={2.5} />
                                                    </a>
                                                )}
                                                <div className="group/link inline-flex items-center gap-1 text-black/40 text-[0.93rem] font-bold relative w-fit cursor-pointer hover:text-black transition-colors">
                                                    <span>스토리 보기</span>
                                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" strokeWidth={2} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                const categorySlug = currentCategory === 'prompts' ? 'prompts' : 'insights';
                                const categoryLabel = currentCategory === 'prompts' ? '프롬프트' : '인사이트';

                                return (
                                    <div
                                        key={item.slug}
                                        onClick={() => { navigate(`/${categorySlug}/${item.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="apple-card p-7 group cursor-pointer flex flex-col active:scale-[0.98] transform-gpu bg-white"
                                    >
                                        <div className="mb-5 flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase text-black/40" style={{ letterSpacing: '0.12em' }}>{categoryLabel}</span>
                                            <span className="w-1 h-1 rounded-full bg-black/10" />
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-black/5 text-black/50 rounded-sm" style={{ letterSpacing: '0.08em' }}>
                                                {(item as any).label || (currentCategory === 'prompts' ? 'Prompt' : 'Insight')}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold mb-3 group-hover:text-emerald-600 transition-colors text-[#1D1D1F]" style={{ letterSpacing: '-0.03em', lineHeight: 1.25 }}>
                                            {item.title}
                                            {(item as any).rating != null && (item as any).rating >= 4.5 && (
                                                <span className="inline-block ml-1.5 align-middle text-[1.125rem]" role="img" aria-label="추천">✨</span>
                                            )}
                                        </h3>
                                        <p className="text-[#737373] text-sm mb-6 leading-[1.6] line-clamp-3 flex-grow">
                                            {item.excerpt}
                                        </p>
                                        <div className="pt-5 border-t border-[#E5E5E5] flex items-center justify-between">
                                            <span className="text-sm font-medium text-black/40 font-sans" style={{ letterSpacing: '0' }}>
                                                {item.publishedDate ? new Date(item.publishedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <ArrowRight size={16} strokeWidth={1.5} className="text-black/20 group-hover:text-emerald-600 transition-all duration-150 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ContentList;
