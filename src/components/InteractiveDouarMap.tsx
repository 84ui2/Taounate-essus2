import React, { useState, useMemo } from 'react';
import { TAOUNATE_DOUARS, MAJOR_DAMS } from '../data/mapData';
import { MapDouar } from '../types';
import {
  MapPin,
  Route,
  Droplet,
  AlertTriangle,
  Volume2,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Users,
  Compass,
  Sparkles,
  Info,
  Waves,
  Mountain,
  ChevronRight
} from 'lucide-react';

interface InteractiveDouarMapProps {
  onPlayDouarTTS: (text: string, title: string) => void;
  onNavigateToAdvocacy: (douarName: string, commune: string, need: string) => void;
}

export const InteractiveDouarMap: React.FC<InteractiveDouarMapProps> = ({
  onPlayDouarTTS,
  onNavigateToAdvocacy,
}) => {
  const [selectedDouarId, setSelectedDouarId] = useState<string>('gh-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCircle, setSelectedCircle] = useState<string>('all');
  const [selectedCrisisFilter, setSelectedCrisisFilter] = useState<'all' | 'both' | 'roads' | 'water'>('all');
  const [hoveredDouar, setHoveredDouar] = useState<MapDouar | null>(null);

  // Filtered douars
  const filteredDouars = useMemo(() => {
    return TAOUNATE_DOUARS.filter((d) => {
      const matchesSearch =
        d.name.includes(searchQuery.trim()) ||
        d.commune.includes(searchQuery.trim()) ||
        d.circle.includes(searchQuery.trim());
      
      const matchesCircle = selectedCircle === 'all' || d.circle === selectedCircle;
      const matchesCrisis = selectedCrisisFilter === 'all' || d.primaryCrisis === selectedCrisisFilter;

      return matchesSearch && matchesCircle && matchesCrisis;
    });
  }, [searchQuery, selectedCircle, selectedCrisisFilter]);

  const selectedDouar = useMemo(() => {
    return TAOUNATE_DOUARS.find((d) => d.id === selectedDouarId) || TAOUNATE_DOUARS[0];
  }, [selectedDouarId]);

  const handleDouarClick = (douar: MapDouar) => {
    setSelectedDouarId(douar.id);
  };

  const handleListenToDouar = () => {
    if (!selectedDouar) return;
    const text = `تقرير ميداني عن ${selectedDouar.name}، التابع لـ ${selectedDouar.commune} بـ ${selectedDouar.circle}. 
    الوضعية العامة: ${selectedDouar.summary}. 
    حالة الطريق: ${selectedDouar.roadStatus}، حيث يبلغ بُعد أقرب مدرسة ${selectedDouar.schoolDistanceKm} كيلومترات. 
    وضعية الماء الصالح للشرب: ${selectedDouar.waterStatus}، وتبعد نقطة جلب الماء مسافة ${selectedDouar.waterDistanceKm} كيلومترات. 
    أهم الاحتياجات الأساسية المستعجلة: ${selectedDouar.keyNeeds.join('، ومطلب ')}. 
    عدد الأسر المتضررة يناهز ${selectedDouar.familiesCount} أسرة تنتظر تدخلاً عملياً ينهي معاناتها.`;

    onPlayDouarTTS(text, `ملخص حالة: ${selectedDouar.name}`);
  };

  const getPinColor = (douar: MapDouar) => {
    if (douar.primaryCrisis === 'both' || douar.crisisLevel === 'critical') {
      return {
        bg: 'bg-rose-500',
        border: 'border-rose-300',
        ring: 'ring-rose-400',
        text: 'text-rose-500',
        label: 'حرج (طريق + ماء)'
      };
    }
    if (douar.primaryCrisis === 'roads') {
      return {
        bg: 'bg-amber-500',
        border: 'border-amber-300',
        ring: 'ring-amber-400',
        text: 'text-amber-600',
        label: 'أزمة مسالك'
      };
    }
    return {
      bg: 'bg-sky-500',
      border: 'border-sky-300',
      ring: 'ring-sky-400',
      text: 'text-sky-600',
      label: 'أزمة ماء'
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            الخريطة التفاعلية لإقليم تاونات
          </span>
          <span className="text-xs text-stone-500">رصد الدواوير المتضررة والاحتياجات الأساسية</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-editorial">
          خريطة رصد الدواوير: مسالك العزلة ومناطق العطش
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          انقر على أي دوار في الخريطة لمعاينة حالته الميدانية، والمسافات التي يقطعها التلاميذ والأسر، وملخص احتياجاته المستعجلة مع إمكانية الاستماع للتقرير الصوتي بالذكاء الاصطناعي.
        </p>
      </div>

      {/* Quick KPI stats banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] text-stone-500 block">الدواوير المرصودة</span>
          <div className="text-xl font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>{TAOUNATE_DOUARS.length} دواوير</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] text-stone-500 block">انقطاع المسالك شتاءً</span>
          <div className="text-xl font-bold text-rose-700 mt-0.5 flex items-center gap-1.5">
            <Route className="w-4 h-4 text-rose-600" />
            <span>
              {TAOUNATE_DOUARS.filter(d => d.roadDifficulty === 'شبه مقطوع شتاءً').length} بؤرة عزلة
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] text-stone-500 block">عطش ونقص حاد بالماء</span>
          <div className="text-xl font-bold text-sky-700 mt-0.5 flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-sky-600" />
            <span>
              {TAOUNATE_DOUARS.filter(d => d.waterDifficulty === 'نقص حاد وعطش').length} دواوير
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] text-stone-500 block">سدود كبرى محاذية</span>
          <div className="text-xl font-bold text-indigo-700 mt-0.5 flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-indigo-600" />
            <span>3 سدود استراتيجية</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث باسم الدوار أو الجماعة (مثال: أزرو، كيسان، تيسة، بوشابل)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Circle Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCircle}
              onChange={(e) => setSelectedCircle(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-700"
            >
              <option value="all">كل الدوائر الإدارية (4)</option>
              <option value="دائرة غفساي">دائرة غفساي (الشمال)</option>
              <option value="دائرة تاونات">دائرة تاونات (الوسط)</option>
              <option value="دائرة قرية با محمد">دائرة قرية با محمد (الجنوب الغربي)</option>
              <option value="دائرة تيسة">دائرة تيسة (الجنوب الشرقي)</option>
            </select>
          </div>
        </div>

        {/* Crisis Type Badges */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-500 font-bold ml-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            تصنيف المشكلة:
          </span>
          <button
            onClick={() => setSelectedCrisisFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              selectedCrisisFilter === 'all'
                ? 'bg-stone-900 text-stone-100'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            جميع الحالات ({TAOUNATE_DOUARS.length})
          </button>
          <button
            onClick={() => setSelectedCrisisFilter('both')}
            className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
              selectedCrisisFilter === 'both'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            حرج جداً: طريق + ماء ({TAOUNATE_DOUARS.filter(d => d.primaryCrisis === 'both').length})
          </button>
          <button
            onClick={() => setSelectedCrisisFilter('roads')}
            className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
              selectedCrisisFilter === 'roads'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            أزمة المسالك ({TAOUNATE_DOUARS.filter(d => d.primaryCrisis === 'roads').length})
          </button>
          <button
            onClick={() => setSelectedCrisisFilter('water')}
            className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
              selectedCrisisFilter === 'water'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            أزمة الماء ({TAOUNATE_DOUARS.filter(d => d.primaryCrisis === 'water').length})
          </button>
        </div>
      </div>

      {/* Main Grid: Map Graphic + Detail Inspector */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Map Visualization Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden text-stone-100">
          
          {/* Map Title & Compass */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-stone-200">
                خريطة التوزيع الجغرافي لدواوير إقليم تاونات
              </span>
            </div>
            
            {/* North Compass */}
            <div className="flex items-center gap-1 bg-stone-800/80 px-2 py-0.5 rounded border border-stone-700 text-[10px] text-stone-400 font-mono">
              <span className="text-amber-400 font-bold">N ↑</span>
              <span>الشمال (الريف)</span>
            </div>
          </div>

          {/* Regional zones labels */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-400 mb-2 px-1">
            <div className="text-right">
              <span className="text-amber-300/80 font-bold">الشمال الجبلي:</span> غفساي ومرنيسة وسد الوحدة
            </div>
            <div className="text-left">
              <span className="text-sky-300/80 font-bold">الشرق والجنوب:</span> تيسة وبوعادل وسد إدريس
            </div>
          </div>

          {/* The Interactive Map Stage */}
          <div className="relative w-full aspect-4/3 sm:aspect-16/11 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 rounded-2xl border border-stone-800/90 overflow-hidden select-none">
            
            {/* Background Topographic Grids & River Curves SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Oued Ouergha flow representation */}
              <path
                d="M 20 150 Q 80 180 150 200 T 300 220 T 450 280"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              <path
                d="M 120 40 Q 180 90 220 140 T 260 210"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                opacity="0.5"
              />
              {/* Mountain contour waves */}
              <circle cx="280" cy="120" r="80" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <circle cx="280" cy="120" r="140" fill="none" stroke="#d97706" strokeWidth="0.8" strokeDasharray="5 5" opacity="0.15" />
            </svg>

            {/* Visual Region Zones */}
            <div className="absolute top-2 right-3 text-[10px] text-stone-500 font-bold tracking-wider pointer-events-none">
              دائرة غفساي (مرتفعات ورغة)
            </div>
            <div className="absolute top-2 left-3 text-[10px] text-stone-500 font-bold tracking-wider pointer-events-none">
              جبال طهر السوق وودكة
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] text-stone-500 font-bold tracking-wider pointer-events-none">
              دائرة قرية با محمد (سهل سبو)
            </div>
            <div className="absolute bottom-2 left-3 text-[10px] text-stone-500 font-bold tracking-wider pointer-events-none">
              دائرة تيسة (حوض إيناون)
            </div>

            {/* Major Dams representations */}
            {MAJOR_DAMS.map((dam) => (
              <div
                key={dam.id}
                style={{
                  top: `${dam.coordinates.y}%`,
                  left: `${dam.coordinates.x}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
              >
                <div className="flex items-center gap-1 bg-sky-950/90 border border-sky-500/50 px-2 py-1 rounded-lg text-[10px] text-sky-300 shadow-md backdrop-blur-xs">
                  <Waves className="w-3 h-3 text-sky-400 animate-pulse" />
                  <span className="font-bold">{dam.name}</span>
                </div>
                {/* Dam tooltip */}
                <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-stone-900 border border-stone-700 text-stone-200 text-[10px] p-2 rounded-lg w-48 shadow-lg pointer-events-none z-30">
                  <span className="font-bold text-sky-400 block">{dam.name}</span>
                  <span>{dam.note}</span>
                </div>
              </div>
            ))}

            {/* Douar Pins */}
            {filteredDouars.map((douar) => {
              const isSelected = selectedDouarId === douar.id;
              const pinStyle = getPinColor(douar);

              return (
                <div
                  key={douar.id}
                  style={{
                    top: `${douar.coordinates.y}%`,
                    left: `${douar.coordinates.x}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  onClick={() => handleDouarClick(douar)}
                  onMouseEnter={() => setHoveredDouar(douar)}
                  onMouseLeave={() => setHoveredDouar(null)}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Pin button */}
                    <button
                      id={`pin-${douar.id}`}
                      className={`relative flex items-center justify-center transition-transform ${
                        isSelected
                          ? 'scale-125 z-30'
                          : 'hover:scale-115'
                      }`}
                      title={`${douar.name} (${douar.commune})`}
                    >
                      {/* Pulse effect if selected or critical */}
                      {(isSelected || douar.crisisLevel === 'critical') && (
                        <span
                          className={`absolute w-8 h-8 rounded-full ${pinStyle.bg} opacity-30 animate-ping`}
                        />
                      )}

                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[11px] shadow-lg border-2 text-white ${pinStyle.bg} ${
                          isSelected
                            ? 'ring-3 ring-amber-300 scale-110'
                            : pinStyle.border
                        }`}
                      >
                        {douar.primaryCrisis === 'roads' ? (
                          <Route className="w-3.5 h-3.5 text-white" />
                        ) : douar.primaryCrisis === 'water' ? (
                          <Droplet className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-white" />
                        )}
                      </span>
                    </button>

                    {/* Douar Name Tag */}
                    <span
                      className={`mt-1 text-[10px] px-1.5 py-0.5 rounded shadow-xs font-semibold whitespace-nowrap transition ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 font-bold scale-105'
                          : 'bg-stone-900/80 text-stone-300 border border-stone-700/80'
                      }`}
                    >
                      {douar.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Hover Tooltip if hovering over any pin */}
            {hoveredDouar && (
              <div
                style={{
                  top: `${Math.min(hoveredDouar.coordinates.y + 7, 75)}%`,
                  left: `${Math.min(Math.max(hoveredDouar.coordinates.x, 20), 80)}%`,
                }}
                className="absolute z-40 -translate-x-1/2 bg-stone-950/95 border border-amber-500/50 p-2.5 rounded-xl shadow-2xl text-xs w-52 pointer-events-none"
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-1 mb-1">
                  <span className="font-bold text-amber-300">{hoveredDouar.name}</span>
                  <span className="text-[10px] text-stone-400">{hoveredDouar.commune}</span>
                </div>
                <p className="text-[11px] text-stone-300 line-clamp-2 leading-tight">
                  {hoveredDouar.summary}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-stone-400 font-mono">
                  <span>المدرسة: {hoveredDouar.schoolDistanceKm} كم</span>
                  <span>•</span>
                  <span>الماء: {hoveredDouar.waterDistanceKm} كم</span>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between flex-wrap gap-2 text-[11px] text-stone-400">
            <div className="flex items-center gap-3">
              <span className="font-bold text-stone-300">دلالات الألوان:</span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>حرج (طريق + ماء)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>أزمة مسالك</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span>أزمة ماء</span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-stone-500">
              <Info className="w-3.5 h-3.5" />
              <span>انقر على أي نقطة لعرض الملف الكامل</span>
            </div>
          </div>
        </div>

        {/* Selected Douar Summary & Needs Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-stone-200 rounded-3xl p-6 shadow-md space-y-5">
          
          {/* Card Header */}
          <div className="border-b border-stone-100 pb-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {selectedDouar.circle} • {selectedDouar.commune}
              </span>

              {/* Crisis badge */}
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedDouar.primaryCrisis === 'both'
                    ? 'bg-rose-100 text-rose-900 border border-rose-200'
                    : selectedDouar.primaryCrisis === 'roads'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-sky-100 text-sky-900 border border-sky-200'
                }`}
              >
                {selectedDouar.primaryCrisis === 'both'
                  ? 'حرج جداً (طريق + ماء)'
                  : selectedDouar.primaryCrisis === 'roads'
                  ? 'أزمة مسالك وعزلة'
                  : 'أزمة ماء شرب'}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-stone-900 font-editorial">
              {selectedDouar.name}
            </h3>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {selectedDouar.summary}
            </p>
          </div>

          {/* Detailed Metric Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl space-y-1">
              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                <Route className="w-3.5 h-3.5 text-amber-600" />
                مسافة المدرسة اليومية:
              </span>
              <span className="text-base font-bold text-stone-900 block">
                {selectedDouar.schoolDistanceKm} كم مشياً
              </span>
              <span className="text-[10px] text-amber-800 font-medium block">
                حالة المسلك: {selectedDouar.roadDifficulty}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 p-3 rounded-xl space-y-1">
              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-sky-600" />
                مسافة جلب الماء:
              </span>
              <span className="text-base font-bold text-stone-900 block">
                {selectedDouar.waterDistanceKm} كم بالدواب
              </span>
              <span className="text-[10px] text-sky-800 font-medium block">
                {selectedDouar.waterDifficulty}
              </span>
            </div>
          </div>

          {/* Families Count */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl flex items-center justify-between text-xs text-amber-950">
            <span className="flex items-center gap-1.5 font-bold">
              <Users className="w-4 h-4 text-amber-700" />
              الساكنة المتضررة التقديرية:
            </span>
            <span className="font-bold text-sm bg-white px-2 py-0.5 rounded border border-amber-300">
              حوالي {selectedDouar.familiesCount} أسرة
            </span>
          </div>

          {/* Road status summary */}
          <div className="space-y-1.5 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100">
            <strong className="text-stone-900 block font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              تشخيص حالة الطريق والماء:
            </strong>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              • <strong>الطريق:</strong> {selectedDouar.roadStatus}
            </p>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              • <strong>الماء:</strong> {selectedDouar.waterStatus}
            </p>
          </div>

          {/* Essential Needs Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              الاحتياجات الأساسية والمطالب المستعجلة:
            </h4>
            <div className="space-y-1.5">
              {selectedDouar.keyNeeds.map((need, idx) => (
                <div
                  key={idx}
                  className="text-xs text-stone-800 bg-stone-100/70 p-2 rounded-lg flex items-start gap-2 border border-stone-200/60"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{need}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive CTAs: Audio report + Advocacy draft */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <button
              id="listen-douar-tts-btn"
              onClick={handleListenToDouar}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition transform active:scale-98"
            >
              <Volume2 className="w-4 h-4 text-stone-950" />
              <span>استمع لملخص هذا الدوار بصوت Gemini TTS</span>
            </button>

            <button
              onClick={() =>
                onNavigateToAdvocacy(
                  selectedDouar.name,
                  selectedDouar.commune,
                  selectedDouar.keyNeeds[0] || 'تعبيد الطريق وتوفير الماء'
                )
              }
              className="w-full py-2 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>صياغة مذكرة ترافعية خاصة بـ {selectedDouar.name}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
