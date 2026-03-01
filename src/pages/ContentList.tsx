import React, { useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getContentByCategory } from '../lib/content';

const ContentList = ({ lang }: { lang: 'ko' | 'en' }) => {
    const { category } = useParams<{ category: string }>();

    const content = useMemo(() => {
        if (!category) return [];
        return getContentByCategory(category);
    }, [category]);

    const title = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : (lang === 'ko' ? '콘텐츠' : 'Content');

    return (
        <section className="section-padding min-h-screen pt-32 bg-[#FAFAFA]">


            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-[#1D1D1F] mb-6">
                        {title}
                    </h1>
                    <p className="text-xl text-black/40 font-medium max-w-2xl">
                        {lang === 'ko'
                            ? `${title}에 대한 모든 게시글을 확인해 보세요.`
                            : `Explore all posts in our ${title} collection.`}
                    </p>
                </div>

                {content.length === 0 ? (
                    <div className="py-12 border-t border-black/5">
                        <p className="text-black/40">{lang === 'ko' ? '게시글이 없습니다.' : 'No posts found in this category yet.'}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content.map((item) => (
                            <motion.div
                                key={item.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer bg-white border border-black/5 hover:border-black/10 rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 flex flex-col h-full"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest bg-black/5 text-black/60">
                                        {item.category}
                                    </span>
                                </div>

                                <h3 className="text-xl font-sans font-bold mb-4 group-hover:text-emerald-600 transition-colors leading-tight tracking-tight text-[#1D1D1F] line-clamp-2">
                                    <Link to={`/${item.category}/${item.slug}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">View Component</span>
                                    </Link>
                                    {item.title}
                                </h3>

                                <p className="text-black/50 text-sm mb-8 leading-relaxed line-clamp-3 flex-grow">
                                    {item.excerpt}
                                </p>

                                <div className="pt-6 border-t border-black/[0.05] flex items-center justify-between mt-auto">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">
                                        {item.publishedDate
                                            ? new Date(item.publishedDate).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                            : ''}
                                    </span>
                                    <ArrowRight size={18} className="text-black/20 group-hover:text-black transition-all group-hover:translate-x-1" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ContentList;
