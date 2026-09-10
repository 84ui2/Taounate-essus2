import React, { useState } from 'react';
import { Volume2, Play, CheckCircle2, Quote, Sparkles, MessageSquareQuote, Compass, Route, Droplet, HelpCircle, Megaphone, Users, Loader2 } from 'lucide-react';
import { ARTICLE_SECTIONS } from '../data/articleData';
import { ArticleSection } from '../types';

interface ArticleReaderProps {
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  currentSectionId: string | null;
  onPlaySection: (section: ArticleSection) => void;
  onPlayCustomText: (text: string, title: string) => void;
  selectedVoice: string;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  fontSize,
  currentSectionId,
  onPlaySection,
  onPlayCustomText,
  selectedVoice,
}) => {
  const [customInputText, setCustomInputText] = useState('');
  const [showCustomTTS, setShowCustomTTS] = useState(false);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-base leading-relaxed';
      case 'lg':
        return 'text-xl leading-loose';
      case 'xl':
        return 'text-2xl leading-loose';
      case 'base':
      default:
        return 'text-lg leading-relaxed';
    }
  };

  const getSectionIcon = (theme: ArticleSection['theme']) => {
    switch (theme) {
      case 'intro':
        return <Compass className="w-5 h-5 text-amber-600" />;
      case 'roads':
        return <Route className="w-5 h-5 text-amber-700" />;
      case 'water':
        return <Droplet className="w-5 h-5 text-sky-600" />;
      case 'questions':
        return <HelpCircle className="w-5 h-5 text-rose-600" />;
      case 'demands':
        return <Megaphone className="w-5 h-5 text-emerald-700" />;
      case 'human':
        return <Users className="w-5 h-5 text-indigo-700" />;
      default:
        return <Compass className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Editorial Lead Card */}
      <div className="bg-gradient-to-br from-amber-50 to-stone-100 border-2 border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-md">
              افتتاحية التحقيق
            </span>
            <span className="text-xs text-stone-500 font-mono">
              الصوت الذكي متاح لكل فقرة
            </span>
          </div>

          <blockquote className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial leading-snug border-r-4 border-amber-600 pr-4">
            «إن التنمية الحقيقية تبدأ من الإنسان، وتبدأ من توفير أبسط شروط الحياة الكريمة.. والساكنة اليوم لا تريد وعودًا فقط، بل تريد أن ترى حلولًا على أرض الواقع.»
          </blockquote>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            تقرير خاص يستعرض صرخات ساكنة دواوير إقليم تاونات، حيث أضحت الطريق السالكة والماء العذب حلماً يومياً يرهق كواهل الصغار والكبار، في انتظار آذان صاغية وإرادة تنموية منصفة.
          </p>
        </div>
      </div>

      {/* Structured Sections from the user's article text */}
      <div className="space-y-10">
        {ARTICLE_SECTIONS.map((section, index) => {
          const isActive = currentSectionId === section.id;
          const isQuestions = section.theme === 'questions';
          const isHuman = section.theme === 'human';

          return (
            <section
              key={section.id}
              id={`section-${section.id}`}
              className={`rounded-2xl p-6 sm:p-8 transition-all duration-300 border ${
                isActive
                  ? 'bg-amber-50/70 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                  : 'bg-white border-stone-200/80 hover:border-amber-200 shadow-xs'
              }`}
            >
              {/* Section Header with TTS trigger */}
              <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-stone-100 border border-stone-200/80">
                      {getSectionIcon(section.theme)}
                    </div>
                    <span className="text-xs font-bold text-stone-500">
                      المحور {index + 1} من {ARTICLE_SECTIONS.length}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-editorial">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="text-xs sm:text-sm text-stone-500 font-medium">
                      {section.subtitle}
                    </p>
                  )}
                </div>

                <button
                  id={`play-section-${section.id}`}
                  onClick={() => onPlaySection(section)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold animate-pulse'
                      : 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200'
                  }`}
                  title="استمع لهذا القسم بصوت الذكاء الاصطناعي"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isActive ? 'يقرأ الآن...' : 'استمع للقسم'}</span>
                </button>
              </div>

              {/* Special rendering for Questions section */}
              {isQuestions ? (
                <div className="space-y-4">
                  <p className="font-bold text-stone-800 text-lg">
                    {section.paragraphs[0]}
                  </p>
                  <div className="grid gap-3 pt-2">
                    {section.paragraphs.slice(1).map((question, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-rose-50/70 border-r-4 border-rose-500 rounded-xl p-4 sm:p-5 text-rose-950 font-medium text-base sm:text-lg flex items-start gap-3 shadow-xs"
                      >
                        <HelpCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-editorial">{question}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isHuman ? (
                /* Special rendering for Human dimension */
                <div className="space-y-4">
                  <div className="bg-gradient-to-l from-amber-50 to-stone-50 border border-amber-200 rounded-xl p-5 mb-4 space-y-2">
                    <p className="text-lg font-bold text-stone-950 font-editorial border-b border-amber-200/60 pb-2">
                      {section.paragraphs[0]}
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3 pt-2">
                      <div className="bg-white/80 p-3 rounded-lg border border-stone-200 text-center">
                        <span className="text-xs text-stone-500 block mb-1">خلف كل طريق متدهور:</span>
                        <span className="font-bold text-amber-900 text-sm">مواطن يتنقل يومياً</span>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg border border-stone-200 text-center">
                        <span className="text-xs text-stone-500 block mb-1">خلف كل دوار ينقصه الماء:</span>
                        <span className="font-bold text-sky-900 text-sm">أسر تنتظر حلاً</span>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg border border-stone-200 text-center">
                        <span className="text-xs text-stone-500 block mb-1">خلف كل تلميذ يسلك مسلكاً:</span>
                        <span className="font-bold text-emerald-900 text-sm">مستقبل يستحق الأفضل</span>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-4 text-stone-800 ${getFontSizeClass()}`}>
                    {section.paragraphs.slice(4).map((para, pIdx) => (
                      <p key={pIdx} className="font-editorial">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                /* Standard paragraphs */
                <div className={`space-y-4 text-stone-800 ${getFontSizeClass()}`}>
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="font-editorial text-justify">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Interactive Custom Text TTS Experimenter */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                جرّب قراءة أي فقرة أو شهادة مخصصة
              </h3>
              <p className="text-xs text-stone-400">
                باستخدام النموذج الصوتي الذكي gemini-3.1-flash-tts-preview
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCustomTTS(!showCustomTTS)}
            className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 transition"
          >
            {showCustomTTS ? 'إخفاء صندوق التجربة' : 'فتح صندوق التجربة'}
          </button>
        </div>

        {showCustomTTS && (
          <div className="space-y-3 pt-2">
            <textarea
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="اكتب أو الصق أي نص أو شهادة من دواوير تاونات لتستمع إليها مباشرة..."
              className="w-full h-24 p-3 bg-stone-800/90 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none font-sans"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">
                الصوت المعتمد حالياً: <strong className="text-stone-200">{selectedVoice}</strong>
              </span>
              <button
                onClick={() => {
                  if (customInputText.trim()) {
                    onPlayCustomText(customInputText, 'شهادة مخصصة');
                  }
                }}
                disabled={!customInputText.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md disabled:opacity-50 transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>تحويل النص إلى صوت</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
