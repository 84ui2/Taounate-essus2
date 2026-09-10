import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArticleReader } from './components/ArticleReader';
import { InteractiveDouarMap } from './components/InteractiveDouarMap';
import { CrisisInfographic } from './components/CrisisInfographic';
import { DouarTestimonies } from './components/DouarTestimonies';
import { AdvocacyDesk } from './components/AdvocacyDesk';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { FULL_ARTICLE_TEXT, ARTICLE_SECTIONS } from './data/articleData';
import { ArticleSection, DouarStory } from './types';
import { Heart, MapPin, Sparkles, Volume2, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'article' | 'map' | 'infographic' | 'testimonies' | 'advocacy'>('article');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  
  // Audio state
  const [currentText, setCurrentText] = useState(ARTICLE_SECTIONS[0].paragraphs.join('\n\n'));
  const [currentTitle, setCurrentTitle] = useState(ARTICLE_SECTIONS[0].title);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>('intro');
  const [currentPlayingStoryId, setCurrentPlayingStoryId] = useState<string | null>(null);
  const [isPlayingFullArticle, setIsPlayingFullArticle] = useState(false);

  // Advocacy form prefill from map
  const [advocacyPrefill, setAdvocacyPrefill] = useState<{
    douarName: string;
    commune: string;
    primaryDemand: string;
  } | null>(null);

  // Play entire article
  const handlePlayFullArticle = () => {
    setCurrentText(FULL_ARTICLE_TEXT);
    setCurrentTitle('تحقيق تاونات: الطريق والماء حلم بسيط (المقال كاملاً)');
    setCurrentSectionId(null);
    setCurrentPlayingStoryId(null);
    setIsPlayingFullArticle(true);

    const playBtn = document.getElementById('main-play-pause-btn');
    if (playBtn) {
      setTimeout(() => playBtn.click(), 100);
    }
  };

  // Play individual section
  const handlePlaySection = (section: ArticleSection) => {
    setCurrentText(section.paragraphs.join('\n\n'));
    setCurrentTitle(section.title);
    setCurrentSectionId(section.id);
    setCurrentPlayingStoryId(null);
    setIsPlayingFullArticle(false);

    const playBtn = document.getElementById('main-play-pause-btn');
    if (playBtn) {
      setTimeout(() => playBtn.click(), 100);
    }
  };

  // Play individual testimony
  const handlePlayStory = (story: DouarStory) => {
    const textToRead = `شهادة ${story.citizenName} من ${story.douarName} بجماعة ${story.commune}: ${story.quote}`;
    setCurrentText(textToRead);
    setCurrentTitle(`شهادة: ${story.douarName} (${story.citizenName})`);
    setCurrentSectionId(null);
    setCurrentPlayingStoryId(story.id);
    setIsPlayingFullArticle(false);

    const playBtn = document.getElementById('main-play-pause-btn');
    if (playBtn) {
      setTimeout(() => playBtn.click(), 100);
    }
  };

  // Play custom / appeal / douar map text
  const handlePlayCustomText = (text: string, title: string) => {
    setCurrentText(text);
    setCurrentTitle(title);
    setCurrentSectionId(null);
    setCurrentPlayingStoryId(null);
    setIsPlayingFullArticle(false);

    const playBtn = document.getElementById('main-play-pause-btn');
    if (playBtn) {
      setTimeout(() => playBtn.click(), 100);
    }
  };

  const handleNavigateToAdvocacy = (douarName: string, commune: string, need: string) => {
    setAdvocacyPrefill({
      douarName,
      commune,
      primaryDemand: need,
    });
    setActiveTab('advocacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-amber-950 font-cairo">
      
      {/* Masthead & Navigation */}
      <Header
        onPlayFullArticle={handlePlayFullArticle}
        isPlaying={isPlayingFullArticle}
        fontSize={fontSize}
        setFontSize={setFontSize}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {activeTab === 'article' && (
          <div className="space-y-6">
            {/* Quick banner linking to map */}
            <div className="max-w-4xl mx-auto px-4 pt-4">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500 text-stone-950">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-bold text-sm">
                      خريطة رصد الدواوير التفاعلية متوفرة الآن
                    </strong>
                    <span className="text-stone-600 text-[11px]">
                      استكشف التوزيع الجغرافي للدواوير المتضررة في غفساي وتاونات وتيسة وقرية با محمد.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('map');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-xl whitespace-nowrap transition shadow-xs"
                >
                  فتح الخريطة التفاعلية
                </button>
              </div>
            </div>

            <ArticleReader
              fontSize={fontSize}
              currentSectionId={currentSectionId}
              onPlaySection={handlePlaySection}
              onPlayCustomText={handlePlayCustomText}
              selectedVoice={selectedVoice}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <InteractiveDouarMap
            onPlayDouarTTS={handlePlayCustomText}
            onNavigateToAdvocacy={handleNavigateToAdvocacy}
          />
        )}

        {activeTab === 'infographic' && (
          <CrisisInfographic />
        )}

        {activeTab === 'testimonies' && (
          <DouarTestimonies
            onPlayStory={handlePlayStory}
            currentPlayingId={currentPlayingStoryId}
          />
        )}

        {activeTab === 'advocacy' && (
          <AdvocacyDesk
            onPlayAppealText={handlePlayCustomText}
            initialDouar={advocacyPrefill}
          />
        )}
      </main>

      {/* Persistent Bottom Audio Player Bar */}
      <AudioPlayerBar
        currentText={currentText}
        currentTitle={currentTitle}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
        onAudioEnded={() => {
          setCurrentSectionId(null);
          setCurrentPlayingStoryId(null);
          setIsPlayingFullArticle(false);
        }}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 px-4 border-t border-stone-800 text-xs mt-auto mb-16">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-stone-300 font-bold text-sm">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>تاونات: نداء الماء والطريق — من أجل عدالة مجالية وعيش كريم</span>
          </div>

          <p className="max-w-xl mx-auto text-stone-500 leading-relaxed text-[11px]">
            «تاونات ليست مجرد أرقام على الخريطة.. خلف كل مسلك متدهور هناك مواطن يتنقل يومياً، وخلف كل دوار ينقصه الماء هناك أسر تنتظر حلاً، وخلف كل تلميذ هناك مستقبل يستحق ظروفاً أفضل.»
          </p>

          <div className="flex items-center justify-center gap-4 text-stone-400 text-[11px] pt-2 border-t border-stone-800/80">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              قراءة صوتية ذكية مدعومة بنموذج gemini-3.1-flash-tts-preview
            </span>
            <span>•</span>
            <span>مبادرة إعلامية وترافعية مدنية مستقلة</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
