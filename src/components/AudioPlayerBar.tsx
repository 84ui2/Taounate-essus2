import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Download, AlertCircle, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { VOICE_OPTIONS } from '../data/articleData';
import { ttsService } from '../services/ttsService';

interface AudioPlayerBarProps {
  currentText: string;
  currentTitle: string;
  onAudioEnded?: () => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentText,
  currentTitle,
  onAudioEnded,
  selectedVoice,
  onVoiceChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = ttsService.getAudioElement();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onAudioEnded) onAudioEnded();
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setErrorMessage('تعذر تشغيل الملف الصوتي');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onAudioEnded]);

  const handlePlayPause = async () => {
    if (!currentText.trim()) return;

    const audio = audioRef.current || ttsService.getAudioElement();
    setErrorMessage(null);

    // If already playing, pause it
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // If audio is paused and source is already loaded, resume
    if (audio.src && audio.currentTime > 0 && !audio.ended && currentAudioUrl === audio.src) {
      try {
        await audio.play();
        setIsPlaying(true);
        return;
      } catch {
        // Fall through to re-generate if playback was aborted
      }
    }

    // Otherwise generate TTS using gemini-3.1-flash-tts-preview
    try {
      setIsLoading(true);
      const audioDataUrl = await ttsService.requestTTS(
        currentText,
        selectedVoice,
        'اقرأ بصوت إخباري استقصائي مؤثر ووقور باللغة العربية'
      );
      setCurrentAudioUrl(audioDataUrl);
      audio.src = audioDataUrl;
      audio.playbackRate = playbackRate;
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error('TTS error:', err);
      setIsLoading(false);
      setIsPlaying(false);
      setErrorMessage(err.message || 'فشل توليد الصوت عبر Gemini TTS');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = speed;
    }
  };

  const handleReset = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentVoiceObj = VOICE_OPTIONS.find(v => v.id === selectedVoice) || VOICE_OPTIONS[0];

  return (
    <div className="sticky bottom-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-amber-900/40 text-stone-100 px-4 py-3 shadow-2xl transition-all">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Track info & Voice selector */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </div>
            <div className="truncate max-w-[200px] sm:max-w-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini TTS
                </span>
                <span className="text-[11px] text-stone-400">نموذج 3.1-flash</span>
              </div>
              <p className="text-sm font-medium text-stone-100 truncate mt-0.5" title={currentTitle}>
                {currentTitle || 'تحقيق تاونات: الطريق والماء'}
              </p>
            </div>
          </div>

          {/* Voice picker toggle on mobile */}
          <div className="relative">
            <button
              id="voice-picker-btn"
              onClick={() => setIsVoiceMenuOpen(!isVoiceMenuOpen)}
              className="text-xs flex items-center gap-1 bg-stone-800 hover:bg-stone-700 border border-stone-700 px-2.5 py-1.5 rounded-lg text-stone-200 transition"
              title="اختر صوت القارئ"
            >
              <span>{currentVoiceObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isVoiceMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 md:right-0 md:left-auto bg-stone-800 border border-stone-700 rounded-xl p-2 w-64 shadow-xl z-50">
                <p className="text-[11px] text-stone-400 font-medium px-2 py-1 border-b border-stone-700/60 mb-1">
                  أصوات Gemini المتاحة:
                </p>
                {VOICE_OPTIONS.map(voice => (
                  <button
                    key={voice.id}
                    onClick={() => {
                      onVoiceChange(voice.id);
                      setIsVoiceMenuOpen(false);
                    }}
                    className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs flex flex-col gap-0.5 transition ${
                      selectedVoice === voice.id
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'hover:bg-stone-700/60 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{voice.name}</span>
                      <span className="text-[10px] text-stone-400">{voice.gender === 'female' ? 'نسائي' : 'رجالي'}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-normal leading-tight">
                      {voice.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Player controls & Progress bar */}
        <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              disabled={isLoading || currentTime === 0}
              className="text-stone-400 hover:text-stone-200 disabled:opacity-30 transition p-1"
              title="إعادة من البداية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="main-play-pause-btn"
              onClick={handlePlayPause}
              disabled={isLoading || !currentText.trim()}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 transition transform active:scale-95"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل القراءة الصوتية'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
              )}
            </button>

            {/* Speed presets */}
            <div className="flex items-center gap-1 bg-stone-800/80 rounded-lg p-0.5 border border-stone-700/60">
              {[0.8, 1, 1.25].map(rate => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`text-[11px] px-2 py-0.5 rounded transition ${
                    playbackRate === rate
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Download Audio (if ready) */}
            {currentAudioUrl && (
              <a
                href={currentAudioUrl}
                download={`taounate_voice_${selectedVoice}.wav`}
                className="text-stone-400 hover:text-amber-300 transition p-1 text-xs flex items-center gap-1"
                title="تحميل الملف الصوتي"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Scrubber slider */}
          <div className="w-full flex items-center gap-2 text-xs text-stone-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              disabled={isLoading || duration === 0}
              className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1 text-[11px] text-rose-400 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
