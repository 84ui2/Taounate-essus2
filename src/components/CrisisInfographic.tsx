import React from 'react';
import { Route, Droplet, AlertTriangle, CheckCircle2, TrendingDown, Clock, ShieldAlert, HeartHandshake, Eye } from 'lucide-react';

export const CrisisInfographic: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase">
          تشخيص ميداني دقيق
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-editorial">
          أبعاد الأزمة بإقليم تاونات: أرقام، واقع، ومفارقات
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto">
          تسليط الضوء على المعطيات الهيكلية للمشكلتين التوأمتين: شريان الطريق المتردي ومصدر الماء الغائب.
        </p>
      </div>

      {/* The Two Pillars: Roads vs Water */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Roads Pillar */}
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-xs space-y-5 relative overflow-hidden">
          <div className="w-2 h-full bg-amber-600 absolute right-0 top-0"></div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Route className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">محور الطرق والمسالك</h3>
              <p className="text-xs text-stone-500">معاناة العزلة وصعوبة التنقل</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-stone-700">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">مسالك وعرة وغير معبدة:</strong>
                <p className="text-xs text-stone-600 mt-0.5">
                  تتميز تضاريس إقليم تاونات بطابع جبلي وعر، حيث تتحول المسالك الترابية في فصل الأمطار إلى برك طينية تعزل قرى بأكملها.
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">الهدر المدرسي وإرهاق التلاميذ:</strong>
                <p className="text-xs text-stone-600 mt-0.5">
                  يقطع مئات التلاميذ مسافات تتراوح بين 3 و 7 كيلومترات يومياً للوصول إلى المجموعات المدرسية والإعداديات، مما يرفع نسب الانقطاع الدراسي خصوصاً لدى الفتيات.
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">الحالات الصحية الطارئة:</strong>
                <p className="text-xs text-stone-600 mt-0.5">
                  صعوبة وصول سيارات الإسعاف أو سيارات النقل تضطر الأسر لحمل النساء الحوامل والمرضى في نعوش خشبية أو على الدواب للوصول للمراكز الصحية.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Water Pillar */}
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 shadow-xs space-y-5 relative overflow-hidden">
          <div className="w-2 h-full bg-sky-600 absolute right-0 top-0"></div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">محور الماء الصالح للشرب</h3>
              <p className="text-xs text-stone-500">رحلة البحث عن أبسط شروط الحياة</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-stone-700">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2.5">
              <TrendingDown className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">مفارقة إقليم السدود المائية:</strong>
                <p className="text-xs text-stone-600 mt-0.5">
                  يضم الإقليم بحيرات سدود كبرى كسد الوحدة وسد إدريس الأول وسد الساهلة، ومع ذلك تبيت دواوير عديدة محرومة من الربط بشبكات الماء الصالح للشرب.
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">معاناة النساء والأطفال اليومية:</strong>
                <p className="text-xs text-stone-600 mt-0.5">
                  تقضي النساء والأطفال ما بين ساعتين إلى أربع ساعات يومياً في نقل براميل المياه على ظهور الدواب أو العربات المجرورة تحت شمس الصيف وقرّ الشتاء.
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block text-xs">جفاف المنابع وشح الصهاريج:</strong>
                <p className="text-xs text-stone-600 mt-0.5">
                  توالي سنوات الجفاف تسبب في نضوب العيون والآبار التقليدية، وارتفاع كلفة شراء مياه الصهاريج التي تثقل كاهل الأسر الهشة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 4-Point Priority Demands Matrix */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              خارطة المطالب العملية والمستعجلة للساكنة
            </h3>
            <p className="text-xs text-stone-400">
              حلول واقعية وقابلة للتنفيذ لفك العزلة وضمان الكرامة
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-800/80 border border-stone-700/80 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>1. تعبيد المسالك الطرقية الحيوية</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed pr-6">
              إعطاء الأولوية للمحاور التي تربط الدواوير بالمدارس والمستوصفات والأسواق، وبناء المنشآت الفنية لحماية المسالك من السيول والانجراف.
            </p>
          </div>

          <div className="p-4 bg-stone-800/80 border border-stone-700/80 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>2. تسريع وتيرة تزويد الدواوير بالماء</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed pr-6">
              ربط القرى بشبكات السدود ومحطات المعالجة القريبة، وإنشاء نافورات وسقايات عمومية مراقبة، وتكثيف دعم صهاريج الماء في فترات الصيف.
            </p>
          </div>

          <div className="p-4 bg-stone-800/80 border border-stone-700/80 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>3. النزول الميداني للجان التتبع</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed pr-6">
              نزول مسؤولي القطاعات الحكومية والمجالس المنتخبة إلى الميدان للوقوف المباشر على واقع الدواوير ومعاينة المعاناة عن قرب بدل التقارير المكتبية.
            </p>
          </div>

          <div className="p-4 bg-stone-800/80 border border-stone-700/80 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>4. تعزيز أسطول النقل المدرسي والصحي</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed pr-6">
              توفير حافلات نقل مدرسي تلائم المسالك الوعرة وسيارات إسعاف مجهزة رباعية الدفع لتقليص الوفيات وإنقاذ الأمهات والأطفال.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
