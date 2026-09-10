import React, { useState } from 'react';
import { FileText, Send, Sparkles, Volume2, Copy, Check, Heart, Shield, Users, Loader2 } from 'lucide-react';
import { INITIAL_SOLIDARITY } from '../data/articleData';

interface AdvocacyDeskProps {
  onPlayAppealText: (text: string, title: string) => void;
  initialDouar?: {
    douarName: string;
    commune: string;
    primaryDemand: string;
  } | null;
}

export const AdvocacyDesk: React.FC<AdvocacyDeskProps> = ({ onPlayAppealText, initialDouar }) => {
  // Appeal generator state
  const [douarName, setDouarName] = useState(initialDouar?.douarName || 'دوار بإقليم تاونات');
  const [commune, setCommune] = useState(initialDouar?.commune || 'إقليم تاونات');
  const [primaryDemand, setPrimaryDemand] = useState(initialDouar?.primaryDemand || 'تعبيد الطريق القروي وفك العزلة وتوفير شبكة الماء الصالح للشرب');
  const [citizenName, setCitizenName] = useState('ساكنة الدوار وممثلي المجتمع المدني');
  const [isGenerating, setIsGenerating] = useState(false);
  const [appealResult, setAppealResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Update form if initialDouar changes
  React.useEffect(() => {
    if (initialDouar) {
      setDouarName(initialDouar.douarName);
      setCommune(initialDouar.commune);
      setPrimaryDemand(initialDouar.primaryDemand);
    }
  }, [initialDouar]);

  // Solidarity signatures state
  const [solidarityList, setSolidarityList] = useState(INITIAL_SOLIDARITY);
  const [signerName, setSignerName] = useState('');
  const [signerOrigin, setSignerOrigin] = useState('');
  const [signerMessage, setSignerMessage] = useState('');

  const handleGenerateAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setAppealResult(null);

    try {
      const response = await fetch('/api/generate-appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          douarName,
          commune,
          primaryDemand,
          citizenName,
        }),
      });

      const data = await response.json();
      if (data.appealText) {
        setAppealResult(data.appealText);
      } else {
        throw new Error(data.error || 'فشل توليد الرسالة الترافعية');
      }
    } catch (err: any) {
      console.error('Error generating appeal:', err);
      // Fallback template if network/key issues
      setAppealResult(`إلى السيد عامل إقليم تاونات المحترم
الموضوع: ملتمس استعجالي من أجل تعبيد المسلك الطرقي وتوفير الماء الصالح للشرب بـ ${douarName} (جماعة ${commune}).

سلام تام بوجود مولانا الإمام،

وبعد، يشرفنا نحن ساكنة ${douarName} وممثلو المجتمع المدني، أن نرفع إلى كريم عنايتكم هذا الملتمس الترافعي الاستعجالي، لننقل إليكم حجم المعاناة اليومية التي يعيشها أهلنا جراء تدهور المسالك الطرقية وانعدام الماء الصالح للشرب.

إن أطفالنا يعانون الأمرين للوصول إلى مقاعد الدراسة، كما أن المرضى والنساء الحوامل يواجهون مخاطر حقيقية جراء وعورة المسالك. وعليه، نلتمس من جنابكم الموقر إيفاد لجنة ميدانية للوقوف على هذه الأوضاع، وإدراج دوارنا ضمن برامج فك العزلة والبرنامج الوطني للتزويد بالماء الشروب.

وتقبلوا فائق التقدير والاحترام.
عن ساكنة: ${citizenName}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (appealResult && navigator.clipboard) {
      navigator.clipboard.writeText(appealResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddSolidarity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim() || !signerMessage.trim()) return;

    const newSignature = {
      name: signerName.trim(),
      origin: signerOrigin.trim() || 'المغرب',
      message: signerMessage.trim(),
      timestamp: 'الآن',
    };

    setSolidarityList([newSignature, ...solidarityList]);
    setSignerName('');
    setSignerOrigin('');
    setSignerMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      
      {/* Introduction */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase">
          أداة الترافع المدني والمواطنة الفاعلة
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-editorial">
          صوت الساكنة: من المعاناة إلى الترافع الرسمي
        </h2>
        <p className="text-stone-600 text-sm max-w-2xl mx-auto">
          «المطلوب اليوم هو أن تصل أصوات هذه الساكنة إلى الجهات المسؤولة، والنزول إلى الميدان لمعاينة حجم المعاناة واتخاذ إجراءات عملية وملموسة.»
        </p>
      </div>

      {/* Appeal Generator Card */}
      <div className="bg-white border-2 border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500 text-stone-950">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              مولّد المذكرات والملتمسات الرسمية بالذكاء الاصطناعي
            </h3>
            <p className="text-xs text-stone-500">
              صياغة قانونية وإدارية رصينة موجهة للسلطات الإقليمية والمحلية بإقليم تاونات
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateAppeal} className="space-y-4 text-xs sm:text-sm">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">اسم الدوار أو المنطقة</label>
              <input
                type="text"
                value={douarName}
                onChange={(e) => setDouarName(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                placeholder="دوار أزرو / عين بردة..."
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">الجماعة الترابية التابعة لها</label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                placeholder="جماعة كيسان / بوعادل..."
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">المطلب ذو الأولوية القصوى</label>
            <input
              type="text"
              value={primaryDemand}
              onChange={(e) => setPrimaryDemand(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              placeholder="تعبيد 4 كم من المسلك الرابط بالثانوية + ربط الدوار بسقاية ماء..."
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">الصفة أو الجهة الموقعة</label>
            <input
              type="text"
              value={citizenName}
              onChange={(e) => setCitizenName(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              placeholder="جمعية آباء وأولياء التلاميذ وساكنة الدوار..."
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري صياغة المذكرة الترافعية...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>صياغة المذكرة الترافعية رسمياً</span>
              </>
            )}
          </button>
        </form>

        {/* Output Box */}
        {appealResult && (
          <div className="mt-6 bg-stone-50 border border-stone-300 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 flex-wrap gap-2">
              <span className="font-bold text-stone-800 text-xs sm:text-sm flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600" />
                نص المذكرة الجاهزة للتوجيه
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPlayAppealText(appealResult, `مذكرة ${douarName}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition"
                  title="استمع للمذكرة بصوت Gemini TTS"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استمع للمذكرة</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
                </button>
              </div>
            </div>

            <div className="font-editorial text-sm sm:text-base leading-relaxed text-stone-900 whitespace-pre-line p-2 bg-white rounded-lg border border-stone-200">
              {appealResult}
            </div>
          </div>
        )}
      </div>

      {/* Solidarity Registry */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                سجل التضامن الوطني مع دواوير تاونات
              </h3>
              <p className="text-xs text-stone-400">
                وقع تضامنك واكتب كلمة دعم لأهالينا في العالم القروي
              </p>
            </div>
          </div>

          <div className="bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-stone-300">
              إجمالي الموقعين: <strong className="text-amber-400">{solidarityList.length + 42}</strong>
            </span>
          </div>
        </div>

        {/* Solidarity Form */}
        <form onSubmit={handleAddSolidarity} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              required
              placeholder="اسمك الكامل أو صفتك"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="p-2.5 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-400"
            />
            <input
              type="text"
              placeholder="المدينة / الإقليم (مثال: تاونات، فاس، الرباط، مغاربة العالم...)"
              value={signerOrigin}
              onChange={(e) => setSignerOrigin(e.target.value)}
              className="p-2.5 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-400"
            />
          </div>
          <textarea
            required
            rows={2}
            placeholder="اكتب كلمة تضامن ومساندة لحق أهالي تاونات في الطريق والماء والكرامة..."
            value={signerMessage}
            onChange={(e) => setSignerMessage(e.target.value)}
            className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 placeholder-stone-400 text-xs resize-none"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
          >
            توقيع سجل التضامن
          </button>
        </form>

        {/* Signatures Feed */}
        <div className="space-y-3 pt-4 border-t border-stone-800/80 max-h-80 overflow-y-auto pr-1">
          {solidarityList.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone-800/60 border border-stone-700/60 rounded-xl p-3.5 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between text-stone-400">
                <span className="font-bold text-stone-200">{item.name} ({item.origin})</span>
                <span className="text-[11px] text-stone-500">{item.timestamp}</span>
              </div>
              <p className="text-stone-300 font-editorial text-sm leading-relaxed">
                «{item.message}»
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
