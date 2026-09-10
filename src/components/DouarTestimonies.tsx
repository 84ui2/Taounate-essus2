import React, { useState } from 'react';
import { DOUAR_STORIES } from '../data/articleData';
import { DouarStory } from '../types';
import { Volume2, MapPin, Quote, Plus, AlertCircle, CheckCircle2, User, Navigation } from 'lucide-react';

interface DouarTestimoniesProps {
  onPlayStory: (story: DouarStory) => void;
  currentPlayingId: string | null;
}

export const DouarTestimonies: React.FC<DouarTestimoniesProps> = ({
  onPlayStory,
  currentPlayingId,
}) => {
  const [stories, setStories] = useState<DouarStory[]>(DOUAR_STORIES);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New testimony form state
  const [douarName, setDouarName] = useState('');
  const [commune, setCommune] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [role, setRole] = useState('مواطن من الساكنة');
  const [roadStatus, setRoadStatus] = useState('');
  const [waterStatus, setWaterStatus] = useState('');
  const [quote, setQuote] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!douarName.trim() || !quote.trim()) return;

    const newStory: DouarStory = {
      id: `custom-${Date.now()}`,
      douarName: douarName.trim(),
      commune: commune.trim() || 'إقليم تاونات',
      circle: 'دواوير تاونات',
      roadStatus: roadStatus.trim() || 'مسلك قروي وعر بحاجة لتعبيد',
      roadDifficulty: 'صعب',
      waterStatus: waterStatus.trim() || 'نقص في التزويد بالماء الصالح للشرب',
      waterDifficulty: 'جلب من عيون بعيدة',
      schoolDistanceKm: 4.5,
      waterDistanceKm: 2.0,
      quote: quote.trim(),
      citizenName: citizenName.trim() || 'فاعل محلي',
      role: role.trim(),
    };

    setStories([newStory, ...stories]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddModal(false);
      setDouarName('');
      setCommune('');
      setCitizenName('');
      setQuote('');
      setRoadStatus('');
      setWaterStatus('');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
            أصوات من عمق الإقليم
          </span>
          <h2 className="text-2xl font-bold text-stone-900 font-editorial mt-1">
            شهادات حية من دواوير تاونات
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            استمع مباشرة إلى أصوات ومعاناة ساكنة القرى وتجاربهم اليومية
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>أضف شهادة من دوارك</span>
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {stories.map((story) => {
          const isPlaying = currentPlayingId === story.id;

          return (
            <div
              key={story.id}
              className={`rounded-2xl p-6 border transition shadow-xs flex flex-col justify-between gap-4 ${
                isPlaying
                  ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/50'
                  : 'bg-white border-stone-200 hover:border-amber-200'
              }`}
            >
              <div className="space-y-3">
                {/* Douar header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{story.commune}</span>
                      <span>•</span>
                      <span>{story.circle}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 font-editorial mt-0.5">
                      {story.douarName}
                    </h3>
                  </div>

                  <button
                    onClick={() => onPlayStory(story)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isPlaying
                        ? 'bg-amber-500 text-stone-950 font-bold animate-pulse'
                        : 'bg-stone-100 hover:bg-amber-100 text-stone-700'
                    }`}
                    title="استمع للشهادة بصوت الذكاء الاصطناعي"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'يقرأ...' : 'استمع'}</span>
                  </button>
                </div>

                {/* Metrics badges */}
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 bg-amber-100/70 text-amber-900 rounded-md border border-amber-200">
                    الطريق: {story.roadDifficulty}
                  </span>
                  <span className="px-2 py-0.5 bg-sky-100/70 text-sky-900 rounded-md border border-sky-200">
                    الماء: {story.waterDifficulty}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-stone-700 text-sm italic bg-stone-50 p-3.5 rounded-xl border-r-2 border-amber-500 relative font-editorial leading-relaxed">
                  <Quote className="w-4 h-4 text-amber-400 absolute left-2 top-2 opacity-50" />
                  «{story.quote}»
                </blockquote>
              </div>

              {/* Author footer */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-semibold text-stone-700">{story.citizenName}</span>
                </div>
                <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                  {story.role}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Testimony Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-bold text-stone-900">
                أضف شهادتك لنقل صوت دوارك
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formSuccess ? (
              <div className="p-6 bg-emerald-50 text-emerald-900 rounded-xl text-center space-y-2 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold">تمت إضافة الشهادة بنجاح</h4>
                <p className="text-xs text-emerald-700">
                  تم إدراج صوت دوارك ويمكنك الآن الاستماع إليه بالذكاء الاصطناعي الصوتي
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">اسم الدوار *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: دوار بوعياش"
                      value={douarName}
                      onChange={(e) => setDouarName(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">الجماعة الترابية</label>
                    <input
                      type="text"
                      placeholder="مثال: جماعة تيسة"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">الاسم أو اللقب</label>
                    <input
                      type="text"
                      placeholder="مثال: ابن المنطقة"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">الصفة</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                    >
                      <option value="مواطن من الساكنة">مواطن من الساكنة</option>
                      <option value="فاعل جمعوي">فاعل جمعوي</option>
                      <option value="ولي أمر تلميذ">ولي أمر تلميذ</option>
                      <option value="معلم / موظف بالمنطقة">معلم / موظف بالمنطقة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">نص الشهادة والواقع اليومي *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="صف كيف يعيش الدوار مع مشكل الطريق ومعاناة جلب الماء الصالح للشرب..."
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs"
                  >
                    نشر وتفعيل القراءة الصوتية
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
