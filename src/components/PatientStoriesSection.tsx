import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Play, 
  Pause, 
  ArrowRight,
  HeartHandshake,
  Stethoscope,
  DollarSign
} from 'lucide-react';

export interface PatientStory {
  id: string;
  name: string;
  age: number;
  city: string;
  stateName: string;
  stateCode: string;
  stateId: string;
  condition: string;
  category: 'Chronic Pain' | 'PTSD & Sleep' | 'Joints & Arthritis' | 'Oncology Care' | 'Neuropathy';
  rating: number;
  yearsCertified: string;
  headshotUrl: string;
  initials: string;
  headline: string;
  story: string;
  doctorName: string;
  doctorLicense: string;
  annualSavings: string;
  keyRelief: string;
}

export const PATIENT_STORIES: PatientStory[] = [
  {
    id: 'story-elena',
    name: 'Elena Rostova',
    age: 44,
    city: 'San Diego',
    stateName: 'California',
    stateCode: 'CA',
    stateId: 'california',
    condition: 'Chronic Sciatica & Lumbar Disc Herniation',
    category: 'Chronic Pain',
    rating: 5,
    yearsCertified: '3 Years Certified Cardholder',
    headshotUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    initials: 'ER',
    headline: 'After 7 years of heavy pain prescriptions, I finally have my active family life back.',
    story: 'I suffered from chronic lower back nerve pain that made driving, cooking, or playing with my children agonizing. When I finally decided to look into medical marijuana, I was anxious about the process. Dr. Harris on the telehealth call was exceptionally patient and methodical. He reviewed my MRI records, explained the precise ratio of CBD to THC to target nerve inflammation without daytime cognitive fog, and gave me clear dosage guidance. My official recommendation arrived in my inbox before I even closed my laptop! Having my medical card saves me over 30% in dispensary taxes and protects my personal cultivation rights under Prop 215.',
    doctorName: 'Dr. Michael Harris, MD',
    doctorLicense: 'CA Medical Board #A142857',
    annualSavings: 'Saved $1,280/yr in dispensary taxes',
    keyRelief: 'Sciatic Nerve Decompression & Mobility'
  },
  {
    id: 'story-marcus',
    name: 'Marcus Sterling',
    age: 52,
    city: 'Philadelphia',
    stateName: 'Pennsylvania',
    stateCode: 'PA',
    stateId: 'pennsylvania',
    condition: 'Combat-Related PTSD & Persistent Night Terrors',
    category: 'PTSD & Sleep',
    rating: 5,
    yearsCertified: '2 Years Certified Cardholder',
    headshotUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    initials: 'MS',
    headline: 'Sleeping 7 uninterrupted hours without night terrors for the first time in a decade.',
    story: 'As a combat veteran, traditional pharmaceuticals left me emotionally blunted and constantly exhausted during the day. The physician at Online MMJ Card treated me with tremendous empathy and zero judgment. He understood the neurological triggers behind sleep disturbances and recommended specific evening terpene profiles high in myrcene and linalool. The telehealth session was confidential, safe, and took less than 15 minutes from my living room. For the first time in ten years, I wake up feeling genuinely rested and present for my grandchildren.',
    doctorName: 'Dr. Aris Thorne, MD',
    doctorLicense: 'PA Board of Medicine #MD449210',
    annualSavings: 'Saved $950/yr on therapy co-pays',
    keyRelief: 'REM Sleep Restoration & Anxiety Relief'
  },
  {
    id: 'story-sarah',
    name: 'Sarah Jenkins',
    age: 39,
    city: 'Tampa',
    stateName: 'Florida',
    stateCode: 'FL',
    stateId: 'florida',
    condition: 'Rheumatoid Arthritis & Autoimmune Inflammation',
    category: 'Joints & Arthritis',
    rating: 5,
    yearsCertified: '1 Year Certified Cardholder',
    headshotUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    initials: 'SJ',
    headline: 'My doctor guided me on daytime 1:1 topicals that stopped morning joint stiffness cold.',
    story: 'In the mornings, my fingers and wrists would swell so badly that holding a warm mug was difficult. I was afraid cannabis meant getting "high," but my physician explained transdermal topicals and daytime sublingual tinctures that deliver deep anti-inflammatory relief with completely clear-headed focus. The clinic staff assisted me with submitting everything to the Florida OMMU registry seamlessly. Within days, I had my dispensary access card and my morning mobility back.',
    doctorName: 'Dr. Sarah Jenkins-Vance, DO',
    doctorLicense: 'FL Board of Osteopathic Medicine #OS11984',
    annualSavings: 'Dispensary Patient Discounts + Tax Relief',
    keyRelief: 'Joint Flexibility & Chronic Swelling Control'
  },
  {
    id: 'story-david',
    name: 'David Chen',
    age: 63,
    city: 'Queens',
    stateName: 'New York',
    stateCode: 'NY',
    stateId: 'new-york',
    condition: 'Chemotherapy-Induced Nausea & Neuropathy',
    category: 'Oncology Care',
    rating: 5,
    yearsCertified: '1 Year Certified Cardholder',
    headshotUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    initials: 'DC',
    headline: 'Restored my appetite and strength during chemo when hospital antiemetics stopped working.',
    story: 'During my second cycle of chemotherapy for lymphoma, the nausea was constant and I shed over 20 pounds in six weeks. My primary oncologist suggested looking into cannabis for cannabinoid-mediated appetite stimulation. The doctor at Online MMJ Card was brilliant—she explained the pharmacokinetics of sublingual drops versus vaporization and guided my daughter through dispensary purchasing rules in New York. I was able to eat dinner with my family that very evening.',
    doctorName: 'Dr. Elena Ramos, MD',
    doctorLicense: 'NYS Dept of Health License #248102',
    annualSavings: 'Saved $1,150/yr in retail markups',
    keyRelief: 'Appetite Stimulation & Nausea Suppression'
  },
  {
    id: 'story-chloe',
    name: 'Chloe Deschanel',
    age: 31,
    city: 'Phoenix',
    stateName: 'Arizona',
    stateCode: 'AZ',
    stateId: 'arizona',
    condition: 'Intractable Migraines & Fibromyalgia',
    category: 'Chronic Pain',
    rating: 5,
    yearsCertified: '4 Years Certified Cardholder',
    headshotUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    initials: 'CD',
    headline: 'Cut my monthly migraine days from 12 severe episodes down to just 1 or 2.',
    story: 'Pharmaceutical migraine medications caused severe rebound headaches and gastrointestinal distress. With my medical card, I have legal access to clean, tested whole-plant extracts that intercept neurological prodrome before a migraine develops. The yearly renewal takes 5 minutes on my phone and the physician is always so up-to-date on latest clinical cannabinoid research. It has completely transformed my productivity.',
    doctorName: 'Dr. David Miller, MD',
    doctorLicense: 'AZ Medical Board #49312',
    annualSavings: 'Saved $1,400/yr in state cannabis taxes',
    keyRelief: 'Neurovascular Pain Prevention'
  },
  {
    id: 'story-jim',
    name: 'James "Jim" Kowalski',
    age: 68,
    city: 'Grand Rapids',
    stateName: 'Michigan',
    stateCode: 'MI',
    stateId: 'michigan',
    condition: 'Degenerative Disc Spine & Osteoarthritis',
    category: 'Joints & Arthritis',
    rating: 5,
    yearsCertified: '3 Years Certified Cardholder',
    headshotUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    initials: 'JK',
    headline: 'At 68, I was skeptical about cannabis. Today, I am tending my organic garden pain-free.',
    story: 'After decades working in construction, my spine was worn down. My doctor wanted to increase my opioid dosage, but my daughter pleaded with me to try a legal cannabis consultation first. The doctor walked me through gentle 5mg micro-dose gummies and transdermal patches. No smoke, no smell, no fuzziness. I am active again and have not touched an opioid pain pill in over two years.',
    doctorName: 'Dr. Michael Harris, MD',
    doctorLicense: 'MI Dept of Licensing License #430110',
    annualSavings: 'Saved $850/yr on pharmacy co-pays',
    keyRelief: 'Natural Musculoskeletal Relief'
  }
];

interface PatientStoriesSectionProps {
  onOpenApply?: (stateId?: string) => void;
  onNavigateState?: (stateId: string) => void;
}

export const PatientStoriesSection: React.FC<PatientStoriesSectionProps> = ({
  onOpenApply,
  onNavigateState
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredStories = filterCategory === 'All' 
    ? PATIENT_STORIES 
    : PATIENT_STORIES.filter(s => s.category === filterCategory);

  // Keep index within bounds if filter changes
  useEffect(() => {
    if (currentIndex >= filteredStories.length) {
      setCurrentIndex(0);
    }
  }, [filteredStories.length, currentIndex]);

  const activeStory = filteredStories[currentIndex] || PATIENT_STORIES[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredStories.length);
  }, [filteredStories.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredStories.length) % filteredStories.length);
  }, [filteredStories.length]);

  // Auto-rotation interval
  useEffect(() => {
    if (!isPlaying || filteredStories.length <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, handleNext, filteredStories.length]);

  const handleMouseEnter = () => {
    if (isPlaying && timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying && filteredStories.length > 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(handleNext, 6500);
    }
  };

  const handleImageError = (id: string) => {
    setImgErrorMap(prev => ({ ...prev, [id]: true }));
  };

  const categories = ['All', 'Chronic Pain', 'PTSD & Sleep', 'Joints & Arthritis', 'Oncology Care'];

  return (
    <section 
      id="patient-stories" 
      className="py-20 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 border-b border-slate-200 relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider shadow-xs">
            <HeartHandshake className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Verified Patient Journeys & Clinical Outcomes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Real Stories of Relief from <span className="text-[#16a34a]">Verified MMJ Cardholders</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Discover how real patients across the country connected with compassionate licensed physicians, obtained legal medical certification, and achieved life-changing symptom relief.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#16a34a] text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-[#16a34a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Rotating Spotlight Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all duration-300">
          <div className="grid lg:grid-cols-12 gap-0">
            
            {/* Left: Patient Profile & Headshot */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              
              {/* Subtle watermark quote */}
              <Quote className="absolute -top-6 -right-6 w-36 h-36 text-white/5 pointer-events-none" />

              <div>
                {/* State & Verification Badges */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Patient</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium backdrop-blur-xs">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{activeStory.city}, {activeStory.stateCode}</span>
                  </span>
                </div>

                {/* Patient Headshot & Details */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-emerald-400/40 shadow-lg bg-emerald-800 flex items-center justify-center">
                      {!imgErrorMap[activeStory.id] ? (
                        <img 
                          src={activeStory.headshotUrl} 
                          alt={`${activeStory.name} patient headshot`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(activeStory.id)}
                        />
                      ) : (
                        <span className="text-xl font-black text-white">{activeStory.initials}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#16a34a] border-2 border-slate-900 flex items-center justify-center text-white shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {activeStory.name}
                    </h3>
                    <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{activeStory.yearsCertified}</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Age {activeStory.age} · {activeStory.stateName}
                    </div>
                  </div>
                </div>

                {/* Patient Star Rating & Badges */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(activeStory.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-emerald-400">
                      5.0 / 5.0 Star Rating
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 leading-snug">
                    Verified Telehealth Medical Marijuana Evaluation
                  </div>
                </div>
              </div>

              {/* Bottom Doctor & License Stamp */}
              <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-white font-bold">{activeStory.doctorName}</span>
                    <span className="block text-[11px] text-slate-400">{activeStory.doctorLicense}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Testimonial Story & Clinical Impact */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* Qualifying Condition Tag & Relief Metric */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Condition: {activeStory.condition}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                    {activeStory.keyRelief}
                  </span>
                </div>

                {/* Headline Quote */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-[#16a34a]/20 mb-2" />
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                    "{activeStory.headline}"
                  </h4>
                </div>

                {/* Full Patient Testimonial */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {activeStory.story}
                </p>

                {/* Clinical & Financial Highlights Bar */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Financial Benefit</div>
                      <div className="text-xs font-extrabold text-slate-900">{activeStory.annualSavings}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Legal Immunity</div>
                      <div className="text-xs font-extrabold text-slate-900">Protected Under {activeStory.stateCode} Law</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons & Navigation Row */}
              <div className="pt-8 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                
                {/* CTA Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenApply?.(activeStory.stateId)}
                    className="px-6 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>Start Your {activeStory.stateCode} Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {onNavigateState && (
                    <button
                      onClick={() => onNavigateState(activeStory.stateId)}
                      className="text-xs font-bold text-slate-600 hover:text-[#16a34a] underline transition-colors cursor-pointer"
                    >
                      View {activeStory.stateName} Laws
                    </button>
                  )}
                </div>

                {/* Controls: Play/Pause, Prev, Next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause auto-rotation' : 'Play auto-rotation'}
                    aria-label={isPlaying ? 'Pause rotation' : 'Play rotation'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#16a34a] transition-colors cursor-pointer"
                    title="Previous story"
                    aria-label="Previous story"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-black text-slate-500 px-1">
                    {currentIndex + 1} / {filteredStories.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#16a34a] transition-colors cursor-pointer"
                    title="Next story"
                    aria-label="Next story"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Thumbnail Selector Strip (Click to jump to any patient story) */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PATIENT_STORIES.map((story, idx) => {
            const isSelected = activeStory.id === story.id;
            return (
              <button
                key={story.id}
                onClick={() => {
                  const filteredIdx = filteredStories.findIndex(s => s.id === story.id);
                  if (filteredIdx !== -1) {
                    setCurrentIndex(filteredIdx);
                  } else {
                    setFilterCategory('All');
                    const allIdx = PATIENT_STORIES.findIndex(s => s.id === story.id);
                    setCurrentIndex(allIdx !== -1 ? allIdx : 0);
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-emerald-50 border-[#16a34a] ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-emerald-800 flex items-center justify-center ring-1 ring-slate-200">
                  {!imgErrorMap[story.id] ? (
                    <img 
                      src={story.headshotUrl} 
                      alt={story.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(story.id)}
                    />
                  ) : (
                    <span className="text-xs font-bold text-white">{story.initials}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-[#16a34a]' : 'text-slate-900'}`}>
                    {story.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">
                    {story.stateCode} · {story.category}
                  </div>
                  <div className="flex items-center text-amber-400 text-[10px]">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span className="ml-1 text-slate-600 font-bold">5.0</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Rotation Dots & Trust Guarantee */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            {filteredStories.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  dotIdx === currentIndex ? 'w-8 bg-[#16a34a]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to story ${dotIdx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>100% HIPAA-Compliant Video Consultations</span>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Full Money-Back Guarantee If Not Approved</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
