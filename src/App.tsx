import React, { useState, useEffect, useId } from 'react';
import { Menu, X, ArrowRight, BookOpen, Sun, Zap, Play, ExternalLink, ArrowUpRight, Globe, MessageSquare, Compass, Shield, Heart, Sparkles, PenTool, ScrollText, Image as ImageIcon, Calendar, Music, Brush, AlertTriangle, Lightbulb, MessageSquareWarning, TrendingUp } from 'lucide-react';

import { Link, useLocation, useNavigate, Routes, Route, useParams, Navigate, useNavigationType } from 'react-router-dom';
import { cn } from './lib/utils';
import ContentList from './pages/ContentList';
import ContentDetail from './pages/ContentDetail';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { getContentByCategory, getContentBySlug } from './lib/content';

// --- Constants & Data ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwXA4yUrNJ3QqCdz5sxRuCuLaUaZqafWnb-jllRSBx6kPnjH4jDyv_cdywu3IZZphmJ/exec";

// ── Recommendation Badge Component ──
const RecommendationBadge = ({ rating, size = 'sm' }: { rating: number | string; size?: 'sm' | 'md' }) => {
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  if (isNaN(numericRating) || numericRating < 4.5) return null;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/50 text-[#059669] shadow-sm animate-in fade-in zoom-in duration-500",
      size === 'md' ? "px-4 py-1.5" : "px-3 py-1"
    )}>
      <Sparkles size={size === 'md' ? 14 : 12} className="fill-emerald-600/10" />
      <span className={cn(
        "font-bold tracking-tight",
        size === 'md' ? "text-[12px]" : "text-[10px]"
      )}>추천</span>
    </div>
  );
};




// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '비전', to: '/vision' },
    { name: '서비스', to: '/services' },
    { name: '프롬프트', to: '/prompts' },
    { name: '인사이트', to: '/insights' },
    { name: '문의', to: '/contact' },
  ];



  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 sm:px-10 md:px-16 lg:px-24 py-4",
      isScrolled ? "bg-white/40 backdrop-blur-2xl border-b border-white/20 py-3 shadow-lg shadow-black/5" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg]">
            <div className="w-3.5 h-3.5 bg-white rotate-45" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-emerald-600">Faith Forward</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "text-[15px] md:text-base font-medium transition-colors",
                location.pathname === link.to ? "text-emerald-600 font-bold" : "text-black/60 hover:text-black"
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                {link.name}
                {link.name === '프롬프트' && (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold leading-none tracking-wide">무료</span>
                )}
              </span>
            </Link>
          ))}
        </div>


        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}

      {
        isMobileMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-black/[0.05] p-8 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={cn(
                    "text-2xl font-bold tracking-tight text-left",
                    location.pathname === link.to ? "text-emerald-600" : "text-[#1D1D1F]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {link.name}
                    {link.name === '프롬프트' && (
                      <span className="px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-700 text-sm font-bold leading-none tracking-wide">무료</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      }

    </nav >
  );
};

const ServicesPage = () => {
  const allServices = getContentByCategory('services');
  const navigate = useNavigate();

  // Create a mapping of slug to its global index (descending)
  const servicesWithGlobalIndex = allServices.map((service, index) => ({
    ...service,
    globalID: String(allServices.length - index).padStart(3, '0')
  }));

  return (
    <div className="pt-40 pb-32 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="border-b border-black/10 pb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-[#1A1A1A]">
            프로덕트
          </h1>
          <p className="text-gray-500">
            신앙과 기술의 경계에서 탄생한 Faith Forward의 혁신적인 도구들입니다.
          </p>

        </div>

        <div className="space-y-16">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A]">
                {'모든 프로덕트'}
              </h2>

              <div className="flex-grow h-px bg-black/5"></div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest font-mono">
                {allServices.length} {allServices.length === 1 ? 'Service' : 'Services'}
              </span>
            </div>

            <ul className="space-y-3">
              {servicesWithGlobalIndex.map((service) => (
                <li
                  key={service.slug}
                  onClick={() => {
                    navigate(`/services/${service.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group flex items-center gap-4 cursor-pointer py-1"
                >
                  <span className="text-xs font-mono text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0 w-8">
                    {(service as any).globalID}
                  </span>
                  <div className="flex flex-col flex-grow">
                    {(service as any).image && (
                      <div className="mb-3 w-28 h-16 overflow-hidden rounded-lg border border-black/[0.03] shadow-sm bg-gray-50 shrink-0">
                        <img
                          src={(service as any).image}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <span className="text-lg md:text-xl font-medium text-gray-700 group-hover:text-black group-hover:underline underline-offset-4 decoration-emerald-400/60 decoration-2 transition-all">
                      {service.title}
                    </span>
                    <span className="text-[14px] md:text-[15px] text-gray-400 mt-2 leading-relaxed max-w-2xl">
                      {service.excerpt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {(service as any).url && (
                      <a
                        href={(service as any).url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-1.5 rounded-lg bg-transparent text-emerald-600 text-[13px] font-bold tracking-tight hover:bg-emerald-600 hover:text-white transition-all duration-300 hidden sm:flex items-center gap-1.5 border border-emerald-500/30 hover:border-emerald-600"
                      >
                        <span>사이트 가기</span>
                        <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

const VisionPage = () => {

  const navigate = useNavigate();
  return (
    <div
      className="pt-40 pb-32 px-6 sm:px-10 md:px-16 lg:px-24 relative overflow-hidden"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-50/40 blur-[120px] rounded-full hidden md:block" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/40 blur-[100px] rounded-full hidden md:block" />
      </div>

      {/* Header section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="border-b border-black/10 pb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-[#1A1A1A]">
            우리의 방향성
          </h1>
          <p className="text-gray-500">
            Faith Forward가 추구하는 가치와 나아가는 길
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Quote panel */}
        <div className="glass-panel p-10 mb-16 border-emerald-100/30">
          <blockquote className="text-xl md:text-2xl font-sans font-medium text-emerald-800 leading-tight italic">
            "AI 기술, 경쟁이 아닌 선함을 위해 쓰일 수는 없을까요?"
          </blockquote>
        </div>

        {/* Content body */}
        <div className="space-y-12 text-base md:text-lg text-black/70 leading-relaxed font-medium">
          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-[#1D1D1F] font-bold">
              Faith Forward는 기술의 속도보다 방향에 집중합니다.
            </p>

            <p>
              시장에는 이미 수많은 서비스가 존재하지만, 정작 소외된 곳이나 일상의 작은 불편을 세밀하게 돌보는 도구는 여전히 부족합니다. 압도적인 속도감과 생산성이라는 이름의 강요 속에서, 내면을 돌보고 진정한 가치를 고민하는 평안의 시간은 점차 사라지고 있습니다.
            </p>

            <p>
              우리는 기술을 통해 더 빨리 해내는 법을 부추기거나 경쟁하는 대신, 서로를 돕고 마음의 평안을 돌보는 선한 가치를 구현하고자 합니다. 무의미한 생산성을 거부하고, 정직과 신뢰를 바탕으로 지혜로운 분별력을 돕는 것. 그것이 우리가 기술을 대하는 방식입니다.
            </p>
          </div>

          <div className="pt-8">
            <h3 className="text-2xl font-bold text-[#1D1D1F] mb-8">
              우리가 지키고자 하는 세 가지 기준
            </h3>

            <div className="space-y-10">
              <div className="border-l-4 border-emerald-500 pl-8 py-2">
                <h4 className="text-lg font-bold text-[#1D1D1F] mb-3">
                  Focus: 작지만 확실하게 삶의 결핍을 채우는 요긴한 서비스
                </h4>
                <p className="text-black/50 text-base font-medium">
                  거창한 플랫폼보다는, 정말 필요한 곳에 쓰이며 일상의 평화를 회복시키는 도구를 만듭니다.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-8 py-2">
                <h4 className="text-lg font-bold text-[#1D1D1F] mb-3">
                  Vision: 기술이 선한 영향력을 흘려보내는 정직한 통로
                </h4>
                <p className="text-black/50 text-base font-medium">
                  가짜와 선동이 넘치는 세상 속에서, 다음 세대가 정직함을 잃지 않고 본질을 꿰뚫는 분별력을 갖추도록 돕습니다.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-8 py-2">
                <h4 className="text-lg font-bold text-[#1D1D1F] mb-3">
                  Action: 끊임없이 본질을 고민하며 앞으로(Forward) 나아가는 발걸음
                </h4>
                <p className="text-black/50 text-base font-medium">
                  단순히 뛰어난 서비스를 만드는 것을 넘어, 같은 비전을 품은 이들과 마음을 모아 사회적 선의를 흘려보내겠습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-black/5">
            <div className="bg-black/5 rounded-3xl p-10">
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-4">
                Connect with us
              </h3>
              <p className="mb-8">
                Faith Forward의 여정에 마음이 닿아 함께하고 싶거나, 기술을 통해 선한 가치를 나누고 싶은 분들은 언제든 환영합니다. 협업 제안이나 나누고 싶은 고민이 있다면 언제든 편하게 문의해 주세요.
              </p>
              <button
                onClick={() => { navigate('/contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1D1D1F] text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-[0.98]"
              >
                문의하기
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="pt-12">
            <p className="text-base text-black/40">Faith Forward</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightsPage = () => {
  const allPosts = getContentByCategory('insights');
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState('전체');

  // Create a mapping of slug to its global index (descending)
  const postsWithGlobalIndex = allPosts.map((post, index) => ({
    ...post,
    globalID: String(allPosts.length - index).padStart(3, '0')
  }));

  const tags = ['전체', ...Array.from(new Set(allPosts.map((post: any) => post.label || 'Others')))];

  const groupedPosts = postsWithGlobalIndex.reduce((acc, post) => {
    const label = (post as any).label || 'Others';
    if (activeTag === '전체' || label === activeTag) {
      if (!acc[label]) acc[label] = [];
      acc[label].push(post);
    }
    return acc;
  }, {} as Record<string, typeof postsWithGlobalIndex>);

  return (
    <div className="pt-40 pb-32 px-6 sm:px-10 md:px-16 lg:px-24 min-h-[80vh]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-black/10 pb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-[#1A1A1A]">
            인사이트
          </h1>
          <p className="text-gray-500">주제별로 정리된 아카이브입니다.</p>
        </div>

        {/* Categories / Tags Filtering */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-8">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform active:scale-95",
                activeTag === tag
                  ? "bg-[#1D1D1F] text-white shadow-md"
                  : "bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-black hover:shadow-sm"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {Object.entries(groupedPosts).map(([category, posts]) => (
            <section key={category} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A]">{category}</h2>
                <div className="flex-grow h-px bg-black/5"></div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest font-mono">
                  {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                </span>
              </div>

              <ul className="space-y-3">
                {(activeTag === '전체' ? posts.slice(0, 5) : posts).map((post) => (
                  <li
                    key={post.slug}
                    onClick={() => {
                      navigate(`/insights/${post.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group flex items-center gap-4 cursor-pointer py-1"
                  >
                    <span className="text-xs md:text-sm font-mono text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0 w-8">
                      {(post as any).globalID}
                    </span>
                    <span className="text-base md:text-lg font-medium text-gray-700 group-hover:text-black group-hover:underline underline-offset-4 decoration-emerald-400/60 decoration-2 transition-all flex-grow">
                      {post.title}
                    </span>
                    {(post as any).rating != null && (post as any).rating >= 4.5 && (
                      <span className="shrink-0">
                        <RecommendationBadge rating={(post as any).rating} size="sm" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {activeTag === '전체' && posts.length > 5 && (
                <div className="pt-2 flex items-center gap-4">
                  <div className="shrink-0 w-8"></div>
                  <button
                    onClick={() => setActiveTag(category)}
                    className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    모든 {category} 글 보기 <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </section>
          ))}
        </div>

        {Object.keys(groupedPosts).length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400">해당 카테고리에 등록된 인사이트가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PromptsPage = () => {
  const allPosts = getContentByCategory('prompts');
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState('전체');

  const tags = ['전체', '영성/묵상', '콘텐츠제작', '기획/분석', 'IT/기술'];

  const filteredPosts = activeTag === '전체'
    ? allPosts
    : allPosts.filter(post => post.tags && post.tags.includes(activeTag));

  const renderIcon = (iconName: string, className?: string) => {
    switch (iconName) {
      case 'PenTool': return <PenTool className={className} />;
      case 'ScrollText': return <ScrollText className={className} />;
      case 'ImageIcon': return <ImageIcon className={className} />;
      case 'Image': return <ImageIcon className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Brush': return <Brush className={className} />;
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'Lightbulb': return <Lightbulb className={className} />;
      case 'MessageSquareWarning': return <MessageSquareWarning className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className="pt-40 pb-32 px-6 sm:px-10 md:px-16 lg:px-24 min-h-[80vh]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="border-b border-black/10 pb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-[#1A1A1A]">
            프롬프트
          </h1>
          <p className="text-gray-500">신앙생활과 사역을 돕는 효과적인 질문들입니다.</p>
        </div>

        {/* Categories / Tags Filtering */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-8">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform active:scale-95",
                activeTag === tag
                  ? "bg-[#1D1D1F] text-white shadow-md"
                  : "bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-black hover:shadow-sm"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Card Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              onClick={() => {
                navigate(`/prompts/${post.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "group relative bg-white border border-black/5 rounded-[1.75rem] p-7 cursor-pointer transform-gpu transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
                (post as any).rating != null && (post as any).rating >= 4.5 && "ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
              )}
            >
              {(post as any).rating != null && (post as any).rating >= 4.5 && (
                <div className="absolute top-5 right-5 z-10">
                  <RecommendationBadge rating={(post as any).rating} />
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", (post as any).color || "bg-gray-100 text-gray-500")}>
                  {renderIcon((post as any).icon || 'Sparkles', "w-6 h-6")}
                </div>

                <div className="flex-grow">
                  <h3 className="text-[1.15rem] font-bold text-[#1D1D1F] mb-3 leading-tight group-hover:text-emerald-600 transition-colors" style={{ letterSpacing: '-0.02em' }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-5 border-t border-black/[0.04] flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-gray-400">
                    {post.tags && post.tags.length > 0 ? `#${post.tags[0]}` : '#프롬프트'}
                  </span>

                  <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 group-hover:gap-2 transition-all duration-300">
                    <span>학습하기</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400">해당 카테고리에 등록된 프롬프트가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};


const ContactPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultMessage = searchParams.get('message') || '';

  const [formData, setFormData] = useState({ name: "", email: "", message: defaultMessage });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('type', 'inquiry');
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('message', formData.message);

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Submission Error:", error);
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-32 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-black/10 pb-8 mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-[#1A1A1A]">
            문의하기
          </h1>
          <p className="text-gray-500">
            Faith Forward와 함께하고 싶으신가요? 마음을 들려주세요.
          </p>
        </div>

        <div className="max-w-2xl">
          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-100 p-10 rounded-3xl text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="fill-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">
                메시지가 전송되었습니다!
              </h2>
              <p className="text-black/50 mb-8 leading-relaxed">
                보내주신 소중한 메시지를 확인하고 빠른 시일 내에 답변해 드리겠습니다.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-emerald-600 font-bold hover:underline underline-offset-4"
              >
                새 메시지 보내기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-bold uppercase tracking-widest text-black/40 ml-1">
                    이름
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="홍길동"
                    className="w-full bg-black/5 border border-transparent focus:border-emerald-500/30 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all duration-300 placeholder:text-black/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-bold uppercase tracking-widest text-black/40 ml-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@mail.com"
                    className="w-full bg-black/5 border border-transparent focus:border-emerald-500/30 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all duration-300 placeholder:text-black/20"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold uppercase tracking-widest text-black/40 ml-1">
                  문의 내용
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="함께 나누고 싶은 생각을 자유롭게 적어주세요."
                  className="w-full bg-black/5 border border-transparent focus:border-emerald-500/30 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all duration-300 placeholder:text-black/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-12 py-5 bg-[#1D1D1F] text-white font-bold rounded-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>메시지 전송하기</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
const Hero = () => {

  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] flex items-center pt-40 pb-24 overflow-hidden px-6 sm:px-10 md:px-16 lg:px-24">
      {/* Gradient background orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/40 blur-[120px] rounded-full hidden md:block" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-200/20 blur-[140px] rounded-full hidden md:block" />
        <div className="absolute top-[-5%] right-[5%] w-[30%] h-[30%] bg-emerald-100/30 blur-[100px] rounded-full hidden md:block" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="max-w-4xl">
          <h1
            className="font-sans font-bold text-[#1D1D1F] mb-8"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', letterSpacing: '-0.05em', lineHeight: 1.15 }}
          >
            <>AI 기술이 세상을 위한<br /> <span className="text-emerald-600">선한 도구가 되도록.</span></>
          </h1>


          <p className="text-xl md:text-2xl text-black/50 mb-14 max-w-2xl leading-[1.6] font-medium" style={{ letterSpacing: '-0.01em' }}>
            <>
              무의미한 경쟁을 멈추고, 우리 삶에 정말 필요한<br />
              평화와 회복을 돕는 작지만 깊이 있는 도구를 만듭니다.
            </>
          </p>


          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { navigate('/services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="btn-primary"
            >
              서비스 탐색
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>


            <button
              onClick={() => { navigate('/vision'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="btn-secondary"
            >
              우리의 비전
            </button>

          </div>
        </div>
      </div>

    </section>
  );
};

const Services = () => {


  const services = getContentByCategory('services');
  const navigate = useNavigate();

  return (
    <section id="services" className="section-padding bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            {/* Label removed */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-[#1D1D1F] leading-[1.1]">
              주요 서비스
            </h2>

          </div>
          <button
            onClick={() => { navigate('/services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group relative inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase shrink-0"
            style={{ letterSpacing: '0.1em' }}
          >
            전체 보기
            <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-150 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.slug}
              onClick={() => { navigate(`/services/${service.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group relative bg-white border border-black/5 rounded-[1.75rem] overflow-hidden cursor-pointer transform-gpu transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] flex flex-col active:scale-[0.98]"
            >
              <div className="w-full aspect-[16/9] overflow-hidden bg-[#F5F5F7]">
                <img
                  src={(service as any).image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-7 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-3" style={{ letterSpacing: '-0.03em' }}>{service.title}</h3>
                <p className="text-[#636366] text-base leading-[1.6] line-clamp-2 flex-grow mb-6" style={{ letterSpacing: '-0.01em' }}>
                  {service.excerpt}
                </p>
                <div className="pt-5 border-t border-black/[0.04] flex items-center gap-6 font-sans">
                  {(service as any).url && (
                    <a
                      href={(service as any).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="group/url inline-flex items-center gap-1 text-[#059669] text-[0.93rem] font-bold relative w-fit hover:text-emerald-700 transition-colors"
                    >
                      <span>사이트 가기</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/url:-translate-y-0.5 group-hover/url:translate-x-0.5" strokeWidth={2.5} />
                    </a>
                  )}

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/services/${service.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group/link inline-flex items-center gap-1 text-black/40 text-[0.93rem] font-bold relative w-fit cursor-pointer hover:text-black transition-colors"
                  >
                    <span>스토리 보기</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedPrompts = () => {
  const allPrompts = getContentByCategory('prompts');
  const navigate = useNavigate();

  // Show max 3 prompts
  const featuredPrompts = allPrompts.slice(0, 3);

  const renderIcon = (iconName: string, className?: string) => {
    switch (iconName) {
      case 'PenTool': return <PenTool className={className} />;
      case 'ScrollText': return <ScrollText className={className} />;
      case 'ImageIcon': return <ImageIcon className={className} />;
      case 'Image': return <ImageIcon className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Brush': return <Brush className={className} />;
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'Lightbulb': return <Lightbulb className={className} />;
      case 'MessageSquareWarning': return <MessageSquareWarning className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <section id="prompts" className="section-padding bg-[#F5F5F7]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-[#1D1D1F] leading-[1.1]">
              대표 프롬프트
            </h2>
          </div>
          <button
            onClick={() => { navigate('/prompts'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group relative inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase shrink-0"
            style={{ letterSpacing: '0.1em' }}
          >
            전체 보기
            <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-150 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredPrompts.map((post) => (
            <div
              key={post.slug}
              onClick={() => { navigate(`/prompts/${post.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={cn(
                "group relative bg-white border border-black/5 rounded-[1.75rem] p-7 cursor-pointer transform-gpu transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)]",
                (post as any).rating != null && (post as any).rating >= 4.5 && "ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
              )}
            >
              {(post as any).rating != null && (post as any).rating >= 4.5 && (
                <div className="absolute top-5 right-5 z-10">
                  <RecommendationBadge rating={(post as any).rating} />
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", (post as any).color || "bg-gray-100 text-gray-500")}>
                  {renderIcon((post as any).icon || 'Sparkles', "w-6 h-6")}
                </div>

                <div className="flex-grow">
                  <h3 className="text-[1.1rem] font-bold text-[#1D1D1F] mb-2 leading-tight group-hover:text-emerald-600 transition-colors" style={{ letterSpacing: '-0.02em' }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-5 border-t border-black/[0.04] flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-gray-400">
                    {post.tags && post.tags.length > 0 ? `#${post.tags[0]}` : '#프롬프트'}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 group-hover:gap-2 transition-all duration-300">
                    <span>무료 학습하기</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LatestInsights = () => {

  const posts = getContentByCategory('insights').slice(0, 3);
  const navigate = useNavigate();

  return (
    <section id="insights" className="section-padding bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            {/* Label removed */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.04em] text-[#1D1D1F] leading-[1.1]">
              최신 인사이트
            </h2>

          </div>
          <button
            onClick={() => { navigate('/insights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group relative inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase shrink-0"
            style={{ letterSpacing: '0.1em' }}
          >
            {'전체 보기'}

            <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-150 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.slug}
              onClick={() => { navigate(`/insights/${post.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group relative bg-white border border-black/5 rounded-[1.75rem] p-7 cursor-pointer transform-gpu transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] flex flex-col active:scale-[0.98]"
            >
              <div className="mb-5">
                <span className={cn("px-3 py-1 text-[10px] font-bold uppercase", (post as any).color || 'bg-black/5 text-black/50')} style={{ letterSpacing: '0.12em' }}>
                  {(post as any).label || post.category}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-emerald-600 transition-colors text-[#1D1D1F]" style={{ letterSpacing: '-0.03em', lineHeight: 1.25 }}>
                {post.title}
              </h3>
              <p className="text-[#737373] text-sm mb-6 leading-[1.6] line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
              <div className="pt-5 border-t border-black/[0.04] flex items-center justify-between">
                <span className="text-sm font-medium text-black/40 font-sans" style={{ letterSpacing: '0' }}>
                  {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}

                </span>
                <div className="flex items-center gap-3">
                  {(post as any).rating != null && (
                    <RecommendationBadge rating={(post as any).rating} size="sm" />


                  )}
                  <ArrowRight size={16} strokeWidth={1.5} className="text-black/20 group-hover:text-emerald-600 transition-all duration-150 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const Footer = () => {

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('type', 'newsletter');
      params.append('email', email);

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Subscription Error:", error);
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer id="contact" className="bg-[#1D1D1F] text-white py-12 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section - Ultra-compact & Symmetrical */}
        <div className="mb-12 pb-12 border-b border-white/5 flex flex-col items-center text-center">
          <div className="max-w-xl mb-4">
            <h3 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight text-white">
              뉴스레터 구독하기
            </h3>
            <p className="text-[#86868B] text-lg font-medium">
              새로운 프로덕트와 인사이트 소식을 메일로 받아보세요.
            </p>

          </div>

          <div className="w-full max-w-md mt-6">
            {isSubscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center animate-in fade-in zoom-in duration-500">
                <span className="font-bold text-sm flex items-center justify-center gap-2">
                  <Zap size={16} className="fill-emerald-500" />
                  구독 완료!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative p-1.5 bg-white/5 border border-white/10 rounded-2xl flex items-center group focus-within:border-emerald-500/40 transition-all duration-300">
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-grow bg-transparent border-none px-6 py-3.5 outline-none text-white placeholder:text-white/20 text-base disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-[0.875rem] font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      구독
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6 font-sans">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-black rotate-45" />
              </div>
              <span className="font-bold text-xl tracking-tight">Faith Forward</span>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed text-base font-medium">
              오직 선을 행함과 서로 나누어 주기를 잊지 말라. 이같은 제사는 하나님이 기뻐하시느리라. (히브리서 13:16)
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-white/30">연결</h4>
            <ul className="space-y-4 text-white/50 text-base font-medium">
              <li><a href="https://www.linkedin.com/in/faith-foward-40a5ab3a2/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-[0.2em] text-white/30">법적 고지</h4>
            <ul className="space-y-4 text-white/50 text-base font-medium">
              <li><Link to="/privacy" onClick={() => window.scrollTo({ top: 0 })} className="hover:text-white transition-colors">개인정보 처리방침</Link></li>
              <li><Link to="/terms" onClick={() => window.scrollTo({ top: 0 })} className="hover:text-white transition-colors">이용 약관</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 text-white/20 text-xs font-medium">
          <p>© 2026 Faith Forward</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {

  // Helper component to scroll to top automatically on route change
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
      // Don't scroll to top if going back (POP) or if hash is present
      if (navType !== 'POP' && typeof window !== 'undefined' && !window.location.hash) {
        window.scrollTo(0, 0);
      }
    }, [pathname, navType]);
    return null;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1D1D1F] selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <FeaturedPrompts />
              <LatestInsights />
            </>
          } />
          <Route path="/services" element={<ServicesPage />} />

          <Route path="/services/:slug" element={<ContentDetail />} />
          <Route path="/prompts" element={<PromptsPage />} />
          <Route path="/prompts/:slug" element={<ContentDetail />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:slug" element={<ContentDetail />} />

          <Route path="/vision" element={<VisionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};
