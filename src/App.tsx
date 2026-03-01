import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, BookOpen, Sun, Zap, Play } from 'lucide-react';
import { Link, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { cn } from './lib/utils';
import ContentList from './pages/ContentList';
import ContentDetail from './pages/ContentDetail';
import { getContentByCategory } from './lib/content';

// --- Constants & Data ---

const PROJECTS_DATA = (lang: Language) => [
  {
    id: 'qotd',
    title: lang === 'ko' ? 'QOTD 앱' : 'QOTD App',
    subtitle: lang === 'ko' ? '오늘의 말씀' : 'Quote of the Day',
    description: lang === 'ko'
      ? '의도적인 아침을 시작하기 위해 엄선된 영성 문구를 제공하는 일일 묵상 도구입니다.'
      : 'A daily reflection tool providing curated spiritual quotes to start your morning with intention.',
    icon: (
      <div className="relative inline-flex mb-2">
        <BookOpen className="text-slate-600 w-6 h-6" strokeWidth={1.5} />
        <Sun className="text-amber-400 w-3.5 h-3.5 absolute -top-1 -right-1" strokeWidth={2.5} />
      </div>
    ),
    color: 'bg-rose-50',
    image: 'https://cdn.jsdelivr.net/gh/trulyj501/faith-foward@main/public/images/qotd_morning_bible.webp',
    url: 'https://qotd.faithfwd.cc',
  },
  {
    id: 'ragecheck',
    title: lang === 'ko' ? '레이지체크' : 'Ragecheck',
    subtitle: lang === 'ko' ? '감정 관리' : 'Emotion Management',
    description: lang === 'ko'
      ? '마음 챙김 성찰과 기록을 통해 감정을 확인하고 관리하는 도구입니다.'
      : 'A tool for checking and managing emotions through mindful reflection and tracking.',
    icon: <Zap className="text-amber-500" />,
    color: 'bg-amber-50',
    image: 'https://cdn.jsdelivr.net/gh/trulyj501/faith-foward@main/public/images/ragecheck_bg.jpg',
    url: 'https://ragecheck.faithfwd.cc',
  },
  {
    id: 'beat-meditation',
    title: lang === 'ko' ? '비트 위의 묵상' : 'Beat Meditation',
    subtitle: lang === 'ko' ? 'AI 명상' : 'AI Meditation',
    description: lang === 'ko'
      ? '예술, 음악, 기술이 어우러진 AI 생성 기독교 명상 콘텐츠입니다.'
      : 'AI-generated Christian meditation content blending art, music, and technology.',
    icon: <Play className="text-indigo-500" />,
    color: 'bg-indigo-50',
    image: 'https://cdn.jsdelivr.net/gh/trulyj501/faith-foward@main/public/images/meditation_bg.jpg',
    url: 'https://meditation.faithfwd.cc',
  }
];



// --- Components ---

type Language = 'ko' | 'en';



const Navbar = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: lang === 'ko' ? '비전' : 'Vision', to: '/vision' },
    { name: lang === 'ko' ? '프로젝트' : 'Projects', to: '/projects' },
    { name: lang === 'ko' ? '인사이트' : 'Insights', to: '/insights' },
    { name: lang === 'ko' ? '문의' : 'Contact', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
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
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg]">
            <div className="w-3.5 h-3.5 bg-white rotate-45" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-[#1D1D1F]">Faith Forward</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.to ? (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === link.to ? "text-emerald-600 font-bold" : "text-black/60 hover:text-black"
                )}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-black/60 hover:text-black transition-colors"
              >
                {link.name}
              </a>
            )
          ))}

          <div className="flex items-center bg-black/5 rounded-full p-1">
            <button
              onClick={() => setLang('ko')}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all",
                lang === 'ko' ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black/60"
              )}
            >
              KO
            </button>
            <button
              onClick={() => setLang('en')}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all",
                lang === 'en' ? "bg-white text-black shadow-sm" : "text-black/40 hover:text-black/60"
              )}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="text-xs font-bold bg-black/5 px-3 py-1 rounded-full"
          >
            {lang === 'ko' ? 'EN' : 'KO'}
          </button>
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}

      {isMobileMenuOpen && (
        <div
          className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-black/[0.05] p-8 md:hidden shadow-2xl"
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              link.to ? (
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
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-2xl font-bold tracking-tight"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>
        </div>
      )}

    </nav>
  );
};

const ProjectsPage = ({ lang }: { lang: Language }) => {
  const projects = PROJECTS_DATA(lang);

  return (
    <div
      className="pt-40 pb-32 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50/40 blur-[120px] rounded-full hidden md:block" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/40 blur-[100px] rounded-full hidden md:block" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-sans font-bold mb-6 tracking-tight text-[#1D1D1F]">
            {lang === 'ko' ? '프로젝트' : 'Projects'}
          </h1>
          <p className="text-xl text-black/40 max-w-2xl font-medium">
            {lang === 'ko'
              ? '신앙과 기술의 경계에서 탄생한 Faith Forward의 혁신적인 도구들을 소개합니다.'
              : 'Introducing Faith Forward\'s innovative tools born at the intersection of faith and technology.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="apple-card group flex flex-col sm:grid sm:grid-rows-2 aspect-auto sm:aspect-[4/5] overflow-hidden !bg-white !bg-none !rounded-[1.25rem] shadow-[0px_4px_16px_rgba(17,17,26,0.05),_0px_8px_32px_rgba(17,17,26,0.05)] border border-slate-100/50 transition-transform active:scale-[0.98] transform-gpu"
            >
              <div className="w-full aspect-[3/2] sm:aspect-auto h-auto sm:h-full overflow-hidden bg-[#e5eee3] shrink-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full h-auto sm:h-full p-5 lg:p-6 flex flex-col text-left justify-between">
                <h3 className="text-[20px] lg:text-[24px] font-bold text-[#1f2937] mb-2 tracking-tight">{project.title}</h3>
                <p className="text-slate-600 text-[14px] lg:text-[15px] leading-[1.6] line-clamp-1 md:line-clamp-2 flex-grow tracking-[-0.01em]">
                  {project.description}
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-emerald-600 text-[14px] lg:text-[16px] font-medium mt-3 lg:mt-auto hover:text-emerald-700 transition-colors tracking-tight group/link"
                >
                  <span>{lang === 'ko' ? '상세 보기' : 'View Detail'}</span>
                  <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VisionPage = ({ lang }: { lang: Language }) => {
  return (
    <div
      className="pt-40 pb-32 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-50/40 blur-[120px] rounded-full hidden md:block" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/40 blur-[100px] rounded-full hidden md:block" />
      </div>

      <div className="max-w-7xl mx-auto mb-16">
        <div
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-sans font-bold mb-6 tracking-tight text-[#1D1D1F]">
                {lang === 'ko' ? '비전' : 'Vision'}
              </h1>
              <p className="text-xl text-black/40 font-medium">
                {lang === 'ko' ? '우리의 방향성' : 'Our Direction'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div
        >
          <div className="glass-panel p-10 mb-16 border-emerald-100/30">
            <blockquote className="text-2xl md:text-3xl font-sans font-medium text-emerald-800 leading-tight italic">
              "신앙과 기술, 그리고 예술을 연결하여 더 밝은 미래로 나아갑니다."
            </blockquote>
            <cite className="block mt-4 text-emerald-600/60 not-italic font-medium">
              Guiding faith and tech toward a brighter future.
            </cite>
          </div>

          <div className="space-y-12 text-lg md:text-xl text-black/70 leading-relaxed font-medium">
            <p>
              안녕하세요. 소셜 협동조합 Faith Forward의 대표 리나(Lina)입니다.
            </p>

            <p>
              우리가 살아가는 일상은 기술의 발전으로 유례없이 빠르고 편리해졌습니다. 하지만 그 압도적인 속도감 속에서, 정작 우리의 내면을 돌보고 진정한 가치를 고민하는 시간은 점차 줄어들고 있지 않나요?
            </p>

            <p>
              Faith Forward는 바로 이 질문에서 출발했습니다. 우리는 차갑고 건조하게 느껴질 수 있는 기술(Tech)에 따뜻한 신앙(Faith)과 예술(Art)의 숨결을 불어넣어, 사람들의 일상에 실질적인 위로와 성장을 돕는 도구를 만듭니다.
            </p>

            <div className="pt-8">
              <h3 className="text-3xl font-bold text-[#1D1D1F] mb-8">{lang === 'ko' ? '우리가 집중하는 세 가지 가치' : 'Three Values We Focus On'}</h3>

              <div className="space-y-10">
                <div className="border-l-4 border-emerald-500 pl-8 py-2">
                  <h4 className="text-xl font-bold text-[#1D1D1F] mb-2">1. 일상에 스며드는 신앙 (Faith in Daily Life)</h4>
                  <p className="text-black/50 text-base">
                    바쁜 하루 중에도 자연스럽게 말씀을 묵상하고 내면을 단단하게 세울 수 있는 디지털 환경을 만듭니다. 가장 아름답고 직관적인 UX를 통해 영적인 습관을 돕습니다. (프로젝트: QOTD)
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-8 py-2">
                  <h4 className="text-xl font-bold text-[#1D1D1F] mb-2">2. 나를 마주하는 건강한 기술 (Tech for Inner Peace)</h4>
                  <p className="text-black/50 text-base">
                    무조건적인 긍정이나 외면이 아닌, 내 안의 솔직한 감정들을 안전하게 점검하고 다스릴 수 있도록 돕는 도구를 기획합니다. (프로젝트: Ragecheck)
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-8 py-2">
                  <h4 className="text-xl font-bold text-[#1D1D1F] mb-2">3. 영감을 주는 새로운 표현 (Artistic Inspiration)</h4>
                  <p className="text-black/50 text-base">
                    틀에 박힌 방식을 벗어나 AI 기술과 시각적 아름다움, 그리고 음악적인 리듬이 어우러진 새로운 형태의 콘텐츠로 메시지를 전합니다. (프로젝트: 비트 위의 묵상)
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-3xl font-bold text-[#1D1D1F] mb-6">{lang === 'ko' ? '함께 나아가는 발걸음' : 'Steps Taken Together'}</h3>
              <p>
                소셜 협동조합으로서 우리가 지향하는 바는 명확합니다. 뛰어난 서비스를 만드는 것을 넘어, 같은 비전을 품은 사람들과 연대하고 우리가 만든 도구들이 사회적으로 선한 영향력을 흘려보내는 통로가 되는 것입니다.
              </p>
              <p className="mt-6">
                멈춰 있지 않고 끊임없이 앞으로(Forward) 향하는 우리의 발걸음이, 여러분의 일상에 작은 기쁨과 빛이 되기를 소망합니다.
              </p>
            </div>

            <div className="pt-16 border-t border-black/5">
              <p className="font-bold text-[#1D1D1F]">Lina Jeong</p>
              <p className="text-sm text-black/40">Founder & Director, Faith Forward</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightsPage = ({ lang }: { lang: Language }) => {
  const posts = getContentByCategory('insights');
  const navigate = useNavigate();

  return (
    <div
      className="pt-40 pb-32 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-50/40 blur-[120px] rounded-full hidden md:block" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/40 blur-[100px] rounded-full hidden md:block" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-sans font-bold mb-6 tracking-tight text-[#1D1D1F]">
                {lang === 'ko' ? '인사이트' : 'Insights'}
              </h1>
              <p className="text-xl text-black/40 font-medium">
                {lang === 'ko' ? '리더십, 기술, 그리고 신앙에 관한 생각들.' : 'Thoughts on leadership, technology, and faith.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.slug}
              onClick={() => {
                navigate(`/insights/${post.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="apple-card p-8 group cursor-pointer flex flex-col h-full !bg-white !rounded-[1.25rem] shadow-[0px_4px_16px_rgba(17,17,26,0.05),_0px_8px_32px_rgba(17,17,26,0.05)] border border-slate-100/50 transition-transform active:scale-[0.98] transform-gpu"
            >
              <div className="mb-6">
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", (post as any).color || 'bg-black/5 text-black/60')}>
                  {(post as any).label || post.category}
                </span>
              </div>
              <h3 className="text-xl font-sans font-bold mb-4 group-hover:text-emerald-600 transition-colors leading-tight tracking-tight text-[#1D1D1F]">
                {post.title}
              </h3>
              <p className="text-black/50 text-sm mb-8 leading-relaxed line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
              <div className="pt-6 border-t border-black/[0.05] flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">
                  {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </span>
                <ArrowRight size={18} className="text-black/20 group-hover:text-black transition-all group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Hero = ({ lang }: { lang: Language }) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] flex items-center pt-40 pb-20 overflow-hidden px-6">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/40 blur-[120px] rounded-full hidden md:block"
        />
        <div
          className="hidden"
        />
        <div
          className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-200/20 blur-[140px] rounded-full hidden md:block"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold leading-[1.1] mb-8 tracking-[-0.04em] text-[#1D1D1F]">
            {lang === 'ko' ? (
              <>매일의 소음 속에서<br className="hidden md:block" /> <span className="text-emerald-600">지혜와 믿음을 지켜냅니다</span>.</>
            ) : (
              <>Protecting wisdom and <br className="hidden md:block" /> <span className="text-emerald-600">faith</span> in the daily noise.</>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-black/50 mb-12 max-w-2xl leading-relaxed font-medium">
            {lang === 'ko'
              ? '나, 이웃, 하나님을 향한 믿음의 경험을 혁신하는 서비스를 만듭니다.'
              : 'Creating services that innovate the experience of faith towards ourselves, our neighbors, and God.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                navigate('/projects');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#1D1D1F] text-white px-10 py-4 rounded-2xl font-semibold hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center"
            >
              {lang === 'ko' ? '프로젝트 탐색' : 'Explore Projects'}
            </button>
            <button
              onClick={() => {
                navigate('/vision');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white text-black border border-black/10 px-10 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all active:scale-95"
            >
              {lang === 'ko' ? '우리의 비전' : 'Our Vision'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = ({ lang }: { lang: Language }) => {
  const projects = PROJECTS_DATA(lang);
  const navigate = useNavigate();

  return (
    <section id="projects" className="section-padding bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-50/60 blur-[140px] rounded-full hidden md:block"
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-50/60 blur-[120px] rounded-full hidden md:block"
        />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 tracking-tight text-[#1D1D1F]">
              {lang === 'ko' ? '주요 프로젝트' : 'Key Projects'}
            </h2>
            <p className="text-lg md:text-xl text-black/40 font-medium">
              {lang === 'ko' ? '디지털 세상에서 신앙을 경험하는 방식을 혁신합니다.' : 'Transforming how we experience faith in a digital world.'}
            </p>
          </div>
          <button
            onClick={() => {
              navigate('/projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {lang === 'ko' ? '전체 보기' : 'View All'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                navigate(`/projects`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="apple-card group cursor-pointer flex flex-col sm:grid sm:grid-rows-2 aspect-auto sm:aspect-[4/5] overflow-hidden !bg-white !bg-none !rounded-[1.25rem] shadow-[0px_4px_16px_rgba(17,17,26,0.05),_0px_8px_32px_rgba(17,17,26,0.05)] border border-slate-100/50 transition-transform active:scale-[0.98] transform-gpu"
            >
              <div className="w-full aspect-[3/2] sm:aspect-auto h-auto sm:h-full overflow-hidden bg-[#e5eee3] shrink-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full h-auto sm:h-full p-5 lg:p-6 flex flex-col text-left justify-between">
                <h3 className="text-[20px] lg:text-[24px] font-bold text-[#1f2937] mb-2 tracking-tight">{project.title}</h3>
                <p className="text-slate-600 text-[14px] lg:text-[15px] leading-[1.6] line-clamp-1 md:line-clamp-2 flex-grow tracking-[-0.01em]">
                  {project.description}
                </p>
                <div className="flex items-center text-emerald-600 text-[14px] lg:text-[16px] font-medium mt-3 lg:mt-auto hover:text-emerald-700 transition-colors tracking-tight group/link">
                  <span>{lang === 'ko' ? '상세 보기' : 'View Detail'}</span>
                  <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LatestInsights = ({ lang }: { lang: Language }) => {
  const posts = getContentByCategory('insights').slice(0, 3);
  const navigate = useNavigate();

  return (
    <section id="insights" className="section-padding relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-purple-100/30 blur-[130px] rounded-full hidden md:block"
        />
        <div
          className="absolute bottom-[10%] left-[5%] w-[50%] h-[50%] bg-emerald-100/30 blur-[130px] rounded-full hidden md:block"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 tracking-tight text-[#1D1D1F]">
              {lang === 'ko' ? '최신 인사이트' : 'Latest Insights'}
            </h2>
            <p className="text-lg md:text-xl text-black/40 font-medium">
              {lang === 'ko' ? '리더십, 기술, 그리고 신앙에 관한 생각들.' : 'Thoughts on leadership, technology, and faith.'}
            </p>
          </div>
          <button
            onClick={() => {
              navigate('/insights');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {lang === 'ko' ? '모든 글 보기' : 'View All Posts'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.slug}
              onClick={() => {
                navigate(`/insights/${post.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="apple-card p-8 group cursor-pointer flex flex-col transition-transform active:scale-[0.98] transform-gpu border border-black/[0.05] hover:border-black/10 hover:shadow-xl hover:shadow-black/5 rounded-3xl"
            >
              <div className="mb-6">
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", (post as any).color || 'bg-black/5 text-black/60')}>
                  {(post as any).label || post.category}
                </span>
              </div>
              <h3 className="text-xl font-sans font-bold mb-4 group-hover:text-emerald-600 transition-colors leading-tight tracking-tight text-[#1D1D1F]">
                {post.title}
              </h3>
              <p className="text-black/50 text-sm mb-8 leading-relaxed line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
              <div className="pt-6 border-t border-black/[0.05] flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">
                  {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </span>
                <ArrowRight size={18} className="text-black/20 group-hover:text-black transition-all group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const Footer = ({ lang }: { lang: Language }) => {
  return (
    <footer id="contact" className="bg-[#1D1D1F] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-black rotate-45" />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight">Faith Forward</span>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed text-base font-medium">
              {lang === 'ko'
                ? '신앙과 기술을 더 밝고 인간적인 미래로 안내하는 데 전념하는 사회적 협동조합입니다.'
                : 'A social cooperative dedicated to guiding faith and technology toward a brighter, more human future.'}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-white/30">{lang === 'ko' ? '연결' : 'Connect'}</h4>
            <ul className="space-y-4 text-white/50 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-white/30">{lang === 'ko' ? '법적 고지' : 'Legal'}</h4>
            <ul className="space-y-4 text-white/50 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">{lang === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{lang === 'ko' ? '이용 약관' : 'Terms of Service'}</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-xs font-medium">
          <p>© 2026 Faith Forward Social Cooperative. {lang === 'ko' ? '모든 권리 보유.' : 'All rights reserved.'}</p>
          <p>{lang === 'ko' ? '리나에 의해 설립됨' : 'Founded by Lina'}</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('ko');

  // Helper component to scroll to top automatically on route change
  const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      // Don't scroll to top if a hash is present (like #contact) or window is undefined (SSR)
      if (typeof window !== 'undefined' && !window.location.hash) {
        window.scrollTo(0, 0);
      }
    }, [pathname]);
    return null;
  };

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar lang={lang} setLang={setLang} />
      <main>
        <Routes>
          <Route path="/" element={
            <div
              key="home"
            >
              <Hero lang={lang} />
              <Projects lang={lang} />
              <LatestInsights lang={lang} />
            </div>
          } />
          <Route path="/vision" element={<VisionPage lang={lang} />} />
          <Route path="/projects" element={<ProjectsPage lang={lang} />} />
          <Route path="/insights" element={<InsightsPage lang={lang} />} />
          {/* Dynamic SSG Content Routes */}
          <Route path="/:category" element={<ContentList lang={lang} />} />
          <Route path="/:category/:slug" element={<ContentDetail lang={lang} />} />
        </Routes>

      </main>
      <Footer lang={lang} />
    </div>
  );
}
