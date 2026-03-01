import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

type Language = 'ko' | 'en';

export const ContentAssistant = ({ lang }: { lang: Language }) => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setResponse('');

        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
            const model = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: input,
                config: {
                    systemInstruction: `You are the official AI Content Director for 'Faith Forward'. Your tone is professional, bright, and insightful. Address the founder as 'Lina'. Do not use ** for emphasis in Korean text. Output in Markdown. Current language: ${lang === 'ko' ? 'Korean' : 'English'}. Respond in this language.`,
                }
            });

            setResponse(model.text || 'No response generated.');
        } catch (error) {
            console.error(error);
            setResponse(lang === 'ko' ? '콘텐츠 생성 중 오류가 발생했습니다.' : 'Error generating content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="assistant" className="section-padding bg-transparent relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] left-[-5%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-emerald-100/40 blur-[120px] rounded-full"
                />
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 tracking-tight text-[#1D1D1F]">
                            {lang === 'ko' ? 'AI 콘텐츠 디렉터' : 'AI Content Director'}
                        </h2>
                        <p className="text-lg md:text-xl text-black/40 mb-8 leading-relaxed font-medium">
                            {lang === 'ko'
                                ? '신앙과 기술에 대한 AI 기반 접근 방식을 경험해 보세요. 리더십, 개발 로그 또는 프로젝트 세부 사항에 대한 통찰력을 콘텐츠 디렉터에게 물어보세요.'
                                : 'Experience our AI-driven approach to faith and tech. Ask our Content Director for insights on leadership, dev logs, or project details.'}
                        </p>
                    </div>

                    <div className="glass-panel p-8">
                        <div className="mb-6">
                            <label className="block text-xs font-bold mb-3 uppercase tracking-[0.2em] text-black/30">{lang === 'ko' ? '요청 사항' : 'Your Request'}</label>
                            <div className="relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={lang === 'ko' ? "리나의 AI 어시스턴트에게 물어보세요..." : "Ask Lina's AI Assistant..."}
                                    className="w-full bg-white/60 backdrop-blur-sm rounded-2xl p-5 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none shadow-sm border border-white/40 font-medium text-sm"
                                />
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="absolute bottom-3 right-3 bg-[#1D1D1F] text-white p-3 rounded-xl hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-black/10"
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {response && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-sm max-h-[300px] overflow-y-auto markdown-body prose prose-sm prose-emerald"
                                >
                                    <Markdown>{response}</Markdown>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContentAssistant;
