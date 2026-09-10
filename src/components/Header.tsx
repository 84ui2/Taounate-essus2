import React from 'react';
import { Volume2, Sparkles, MapPin, Share2, Bookmark, Check, Compass, Map } from 'lucide-react';

interface HeaderProps {
  onPlayFullArticle: () => void;
  isPlaying: boolean;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  activeTab: 'article' | 'map' | 'infographic' | 'testimonies' | 'advocacy';
  setActiveTab: (tab: 'article' | 'map' | 'infographic' | 'testimonies' | 'advocacy') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onPlayFullArticle,
  isPlaying,
  fontSize,
  setFontSize,
  activeTab,
  setActiveTab,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      {/* Top micro bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 border-b border-stone-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-stone-200">ملف استقصائي وترافعي خاص</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-400 hidden sm:inline">جهة فاس-مكناس | إقليم تاونات</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-amber-400">
              <Sparkles className="w-3 h-3" />
              <span>مدعوم بالذكاء الاصطناعي الصوتي Gemini TTS</span>
            </div>
            <button
              onClick={handleShare}
              className="text-stone-400 hover:text-stone-200 flex items-center gap-1 transition text-[11px] border border-stone-700 px-2 py-0.5 rounded"
              title="مشاركة الرابط"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              <span>{copied ? 'تم النسخ' : 'مشاركة'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main title & masthead */}
      <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                دواوير تاونات في قلب الحدث
              </span>
              <span className="text-xs text-stone-500">صوت الحقوق الأساسية والتنمية</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight font-editorial leading-snug">
              تاونات... حين يصبح الطريق والماء حلمًا بسيطًا
            </h1>
            
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-3xl">
              تحقيق استقصائي يرصد معاناة الدواوير مع العزلة وندرة الماء الصالح للشرب، ويضع أسئلة الكرامة والميدان في صلب النقاش التنموي.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="listen-hero-button"
              onClick={onPlayFullArticle}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition transform active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400 shadow-amber-500/20'
                  : 'bg-stone-900 hover:bg-stone-800 text-amber-300 shadow-stone-900/20'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isPlaying ? 'جاري الاستماع للتحقيق...' : 'استمع للتحقيق كاملاً'}</span>
            </button>

            {/* Font size adjustments */}
            <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-1 text-xs font-bold text-stone-700">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded-lg transition ${fontSize === 'sm' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                title="خط أصغر"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded-lg transition ${fontSize === 'base' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                title="خط افتراضي"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded-lg transition ${fontSize === 'lg' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                title="خط أكبر"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-5 border-t border-stone-100 pt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('article')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'article'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>نص التحقيق والصوت</span>
          </button>

          <button
            id="tab-map-button"
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>خريطة الدواوير التفاعلية</span>
          </button>

          <button
            onClick={() => setActiveTab('infographic')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'infographic'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>أرقام الأزمة والتشخيص الميداني</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonies')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'testimonies'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>شهادات حية من الدواوير</span>
          </button>

          <button
            onClick={() => setActiveTab('advocacy')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'advocacy'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>مكتب الترافع وصياغة الملتمسات</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
