import React, { useState, useEffect, useMemo } from 'react';
import { useThemeContent } from '../utils/themeContent';
import { 
  ChevronRight, 
  MapPin, 
  Scale, 
  HelpCircle, 
  ShieldCheck, 
  Search, 
  Sparkles,
  ArrowRight,
  Filter,
  Code2,
  Copy,
  Check,
  ExternalLink,
  X,
  FileJson
} from 'lucide-react';
import { STATES_DATA, StateInfo } from '../data/mmjData';
import { getStateById } from '../utils/routeContentStore';
import { getStateDossier } from '../data/stateDetailedContent';

interface FAQSectionProps {
  onOpenApply: (stateId?: string) => void;
  onOpenContact?: () => void;
  stateId?: string;
}

interface FAQItem {
  id: string;
  q: string;
  a: string;
  isStateSpecific?: boolean;
  stateCode?: string;
  category?: 'legal' | 'general' | 'process' | 'pricing';
}

export const FAQSection: React.FC<FAQSectionProps> = ({ 
  onOpenApply, 
  onOpenContact,
  stateId 
}) => {
  const themeContent = useThemeContent();
  const faqContent = themeContent.faq;

  // Active state: initialized from stateId prop, defaulting to california if omitted
  const [selectedStateId, setSelectedStateId] = useState<string>(stateId || 'california');
  const [activeTab, setActiveTab] = useState<'all' | 'state-legal' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default
  const [showSchemaModal, setShowSchemaModal] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  // Synchronize internal state when the stateId prop changes
  useEffect(() => {
    if (stateId) {
      setSelectedStateId(stateId);
    }
  }, [stateId]);

  // Lookup the active state
  const activeState: StateInfo = useMemo(() => {
    const found = getStateById(selectedStateId) || STATES_DATA.find(s => s.id === selectedStateId);
    return found || STATES_DATA[0];
  }, [selectedStateId]);

  // Retrieve state-specific dossier
  const stateDossier = useMemo(() => {
    return getStateDossier(activeState);
  }, [activeState]);

  // General baseline FAQs (12 standard questions)
  const generalQuestions: FAQItem[] = useMemo(() => [
    {
      id: 'gen-1',
      q: 'How do I get a medical marijuana card online?',
      a: 'To get a medical marijuana card online, complete a simple secure intake form and consult with a licensed physician via a video or phone appointment. Once approved, you will receive your official recommendation certificate via email, ready for use at state dispensaries.',
      isStateSpecific: false,
      category: 'general'
    },
    {
      id: 'gen-2',
      q: 'What conditions qualify for a medical marijuana card?',
      a: 'Common qualifying conditions include chronic pain, severe anxiety, PTSD, migraines, insomnia, cancer symptoms, arthritis, epilepsy, and multiple sclerosis. In discretionary states, doctors may evaluate any debilitating condition causing persistent pain or reducing quality of life.',
      isStateSpecific: false,
      category: 'general'
    },
    {
      id: 'gen-3',
      q: 'Can I get an MMJ card on the same day?',
      a: 'Yes! In many states such as California, New York, and Oklahoma, our physicians conduct same-day telehealth evaluations and issue your digital recommendation certificate immediately after your appointment concludes.',
      isStateSpecific: false,
      category: 'process'
    },
    {
      id: 'gen-4',
      q: 'Is it legal to get a medical marijuana card online?',
      a: 'Yes, 100% legal. State telehealth statutes explicitly authorize licensed physicians to evaluate patients and issue valid medical cannabis recommendations remotely using HIPAA-compliant video and audio technology.',
      isStateSpecific: false,
      category: 'legal'
    },
    {
      id: 'gen-5',
      q: 'How much does a medical marijuana card cost?',
      a: 'Our physician evaluation fees start at $39.99 depending on your state. There are never recurring subscription fees, and all consultations are protected by our 100% money-back guarantee if you are not approved.',
      isStateSpecific: false,
      category: 'pricing'
    },
    {
      id: 'gen-6',
      q: 'How long does it take to get a medical marijuana card?',
      a: 'The intake form takes about 3 to 5 minutes, and your consultation with the physician lasts approximately 10 to 15 minutes. Digital certificates are issued within 24 to 48 hours (often same day), and physical cards arrive via mail in 7 to 20 days.',
      isStateSpecific: false,
      category: 'process'
    },
    {
      id: 'gen-7',
      q: 'Do I need to see a doctor in person for an MMJ card?',
      a: 'No. In all states we serve, the entire consultation takes place 100% online through your smartphone, tablet, or laptop. No office visits or long waiting rooms are required.',
      isStateSpecific: false,
      category: 'general'
    },
    {
      id: 'gen-8',
      q: 'How long is a medical marijuana card valid?',
      a: 'Most state recommendations are valid for 1 full year. Some states (like Oklahoma and Missouri) offer 2-year or 3-year patient licenses, while Florida requires renewals every 210 days (7 months).',
      isStateSpecific: false,
      category: 'process'
    },
    {
      id: 'gen-9',
      q: 'Can I use my medical marijuana card in another state?',
      a: 'Yes, many states practice reciprocity! States like Nevada, Michigan, Oklahoma (visitor permit), Maine, Puerto Rico, and Washington D.C. honor out-of-state medical cards. Check our state reciprocity guide for exact travel guidelines.',
      isStateSpecific: false,
      category: 'legal'
    },
    {
      id: 'gen-10',
      q: 'Is my information secure and confidential?',
      a: 'Absolutely. Your medical data and evaluations are strictly protected under federal HIPAA privacy laws and 256-bit SSL encryption. We never share your records with employers, insurance companies, or law enforcement.',
      isStateSpecific: false,
      category: 'legal'
    },
    {
      id: 'gen-11',
      q: 'What are the benefits of having a medical marijuana card?',
      a: 'Medical cardholders save up to 35% in state and local sales taxes, enjoy higher possession and purchasing limits, gain access to higher-potency medicine, can legally cultivate more plants at home, and have lower minimum age limits (18+ vs 21+).',
      isStateSpecific: false,
      category: 'general'
    },
    {
      id: 'gen-12',
      q: 'What is the process to renew a medical marijuana card?',
      a: 'Renewing is quick and easy. Simply select "MMJ Card Renewal" on our site, complete a brief 5-minute telehealth check-in with our doctor, and receive your updated recommendation letter at discounted renewal rates.',
      isStateSpecific: false,
      category: 'process'
    },
  ], []);

  // Location-specific legal questions dynamically generated for activeState
  const stateLegalQuestions: FAQItem[] = useMemo(() => {
    const list: FAQItem[] = [];

    // 1. Governing Law & Immunity
    list.push({
      id: `state-law-${activeState.id}-1`,
      q: `What are the official medical marijuana laws and legal protections in ${activeState.name}?`,
      a: `In ${activeState.name}, medical cannabis is authorized under ${stateDossier.governingLaw}. Patients who hold a valid physician certification issued through our HIPAA-compliant telehealth clinic are legally protected from state arrest and prosecution for possessing and purchasing cannabis within statutory patient limits. Evaluations are conducted by board-certified physicians licensed with the state medical board.`,
      isStateSpecific: true,
      stateCode: activeState.code,
      category: 'legal'
    });

    // 2. Possession & Cultivation Limits
    list.push({
      id: `state-limits-${activeState.id}-2`,
      q: `What are the legal possession and cultivation limits under ${activeState.name} law?`,
      a: `Under current ${activeState.name} medical cannabis statutes: Certified patients may legally possess ${activeState.possessionLimit}. For home cultivation: ${activeState.homeCultivation}. Patients holding extended medical necessity recommendations (such as 99-plant recs in California) can legally cultivate larger quantities specifically tailored to their clinical therapeutic dosage.`,
      isStateSpecific: true,
      stateCode: activeState.code,
      category: 'legal'
    });

    // 3. State Fees & Money-Back Guarantee
    list.push({
      id: `state-pricing-${activeState.id}-3`,
      q: `How much does a ${activeState.name} medical marijuana card cost, and is there a state registry fee?`,
      a: `Our physician evaluation fee for ${activeState.name} is $${activeState.price.toFixed(2)} for new patients and $${activeState.renewalPrice.toFixed(2)} for renewals. State registry fee: ${activeState.stateRegistryFee}. Consultations are 100% risk-free: If our doctor determines you do not qualify under ${activeState.name} law, you receive an immediate, full 100% refund.`,
      isStateSpecific: true,
      stateCode: activeState.code,
      category: 'pricing'
    });

    // 4. Reciprocity
    list.push({
      id: `state-reciprocity-${activeState.id}-4`,
      q: `Can I use my ${activeState.name} medical marijuana card when traveling to other states?`,
      a: `${activeState.reciprocityNotes}. Multiple states including Nevada, Maine, Michigan, Washington D.C., and Puerto Rico accept out-of-state patient certifications. Always verify destination state possession regulations prior to traveling.`,
      isStateSpecific: true,
      stateCode: activeState.code,
      category: 'legal'
    });

    // 5. Employment & Housing Rights
    list.push({
      id: `state-employment-${activeState.id}-5`,
      q: `Are ${activeState.name} medical marijuana patients protected against workplace discrimination?`,
      a: `Patient protections vary by jurisdiction. In forward-thinking states like California (Assembly Bill 2188) and New York (Cannabis Law § 201-d), employers are prohibited from discriminating against employees for off-duty cannabis use or non-psychoactive cannabis metabolites. However, safety-sensitive roles, commercial DOT drivers, and federal contractors remain subject to federal guidelines.`,
      isStateSpecific: true,
      stateCode: activeState.code,
      category: 'legal'
    });

    // 6. Additional Dossier FAQs
    if (stateDossier.stateFaqs && stateDossier.stateFaqs.length > 0) {
      stateDossier.stateFaqs.slice(0, 3).forEach((sf, i) => {
        // Avoid duplicate questions
        if (!list.some(item => item.q.toLowerCase() === sf.question.toLowerCase())) {
          list.push({
            id: `state-dossier-${activeState.id}-${i}`,
            q: sf.question,
            a: sf.answer,
            isStateSpecific: true,
            stateCode: activeState.code,
            category: 'legal'
          });
        }
      });
    }

    return list;
  }, [activeState, stateDossier]);

  // Combined and filtered questions for UI display
  const displayedQuestions = useMemo(() => {
    let combined: FAQItem[] = [];

    if (activeTab === 'state-legal') {
      combined = stateLegalQuestions;
    } else if (activeTab === 'general') {
      combined = generalQuestions;
    } else {
      // 'all': Show state-specific legal questions first, followed by general FAQs
      combined = [...stateLegalQuestions, ...generalQuestions];
    }

    if (!searchQuery.trim()) {
      return combined;
    }

    const query = searchQuery.toLowerCase().trim();
    return combined.filter(
      item => item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
    );
  }, [activeTab, stateLegalQuestions, generalQuestions, searchQuery]);

  // Complete list of all questions and answers associated with this state context for JSON-LD schema
  const allQuestionsForSchema: FAQItem[] = useMemo(() => {
    return [...stateLegalQuestions, ...generalQuestions];
  }, [stateLegalQuestions, generalQuestions]);

  // Generate official Schema.org FAQPage JSON-LD schema object
  const faqSchema = useMemo(() => {
    const pageUrl = typeof window !== 'undefined' 
      ? window.location.origin + `/medical-marijuana-card-${activeState.id.toLowerCase()}/`
      : `https://onlinemmjcard.com/medical-marijuana-card-${activeState.id.toLowerCase()}/`;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      "name": `${activeState.name} Medical Marijuana Card & Telehealth Evaluation FAQs`,
      "description": `Frequently asked questions and legal answers for ${activeState.name} medical cannabis patients regarding telemedicine laws, statutory possession limits, qualifying conditions, and state certification procedures.`,
      "url": pageUrl,
      "inLanguage": "en-US",
      "mainEntity": allQuestionsForSchema.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    };
  }, [activeState, allQuestionsForSchema]);

  // Automatically inject and update JSON-LD FAQ schema into document.head
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const SCRIPT_ID = 'faq-section-jsonld-schema';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    // Safely serialize with escaped closing script tags
    const serialized = JSON.stringify(faqSchema, null, 2).replace(/<\/script>/gi, '<\\/script>');
    scriptTag.textContent = serialized;

    return () => {
      // Clean up dynamic schema element on unmount
      const el = document.getElementById(SCRIPT_ID);
      if (el) {
        el.remove();
      }
    };
  }, [faqSchema]);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleCopySchema = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(faqSchema, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2500);
    }
  };

  return (
    <section id="faqs" className="py-20 bg-slate-50/70 border-b border-slate-200 relative">
      {/* Inline Schema.org FAQPage Structured Data for Crawlers & Headless Renderers */}
      <script
        id={`faq-inline-schema-${activeState.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/<\/script>/gi, '<\\/script>')
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider shadow-xs">
            <Scale className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>State Laws & Patient Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-tight">
            {faqContent.heading}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {faqContent.subheading}
          </p>
        </div>

        {/* State Location Selector & Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Location selector dropdown */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16a34a] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <label htmlFor="faq-state-select" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Location for State Laws:
                </label>
                <select
                  id="faq-state-select"
                  value={activeState.id}
                  onChange={(e) => {
                    setSelectedStateId(e.target.value);
                    setOpenIndex(0);
                  }}
                  className="text-xs sm:text-sm font-extrabold text-slate-900 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer hover:text-[#16a34a] transition-colors"
                >
                  {STATES_DATA.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.code}) — MMJ Legal Guidelines
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search state laws, limits, fees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#16a34a] text-slate-900 placeholder-slate-400"
              />
            </div>

          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Questions ({stateLegalQuestions.length + generalQuestions.length})
            </button>

            <button
              onClick={() => setActiveTab('state-legal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'state-legal'
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{activeState.name} Legal Specifics ({stateLegalQuestions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              General Telehealth FAQs ({generalQuestions.length})
            </button>
          </div>

          {/* SEO Structured Data Schema Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
                <span>JSON-LD FAQ Schema Injected ({allQuestionsForSchema.length} Q&As)</span>
              </span>
              <span className="hidden sm:inline text-slate-500 text-[11px]">
                Targeted for <strong>{activeState.name}</strong> Google Rich Results & AI Overviews
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowSchemaModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
              title="Inspect dynamically injected Schema.org FAQPage structured data"
            >
              <Code2 className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Inspect Schema.org JSON-LD</span>
            </button>
          </div>

        </div>

        {/* Dynamic Location Law Highlight Banner */}
        {activeTab !== 'general' && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>
                Displaying <strong>{activeState.name} ({activeState.code})</strong> statutory possession limits, patient tax relief, and telemedicine regulations.
              </span>
            </div>
            <button
              onClick={() => onOpenApply(activeState.id)}
              className="px-3.5 py-1.5 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Get Certified in {activeState.code}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Accordion List */}
        <div className="space-y-3">
          {displayedQuestions.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              No matching questions found for "{searchQuery}". Try searching for "limits", "reciprocity", or "renewal".
            </div>
          ) : (
            displayedQuestions.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className={`w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                      isOpen ? 'text-[#16a34a] bg-emerald-50/40' : 'text-slate-800 hover:text-[#16a34a]'
                    }`}
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2">
                        {item.isStateSpecific ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Scale className="w-3 h-3 text-[#16a34a]" />
                            <span>{item.stateCode || activeState.code} State Law</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            <HelpCircle className="w-3 h-3" />
                            <span>General FAQ</span>
                          </span>
                        )}
                      </div>
                      <span className="leading-snug block text-slate-900 font-bold">{item.q}</span>
                    </div>

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform mt-0.5 ${
                      isOpen ? 'bg-[#16a34a] text-white rotate-90' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Center Green Buttons */}
        <div className="mt-12 text-center space-y-3">
          <div className="flex items-center justify-center flex-wrap gap-3">
            <button
              onClick={() => onOpenApply(activeState.id)}
              className="px-8 py-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              BOOK YOUR {activeState.code} MMJ EVALUATION
            </button>

            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="px-8 py-3.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                CONTACT OUR SUPPORT TEAM
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Still have questions about {activeState.name} medical cannabis? Our patient support team is available 7 days a week.
          </div>
        </div>

      </div>

      {/* JSON-LD Schema Inspector Modal */}
      {showSchemaModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setShowSchemaModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#22c55e] flex items-center justify-center border border-emerald-500/30">
                  <FileJson className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    Schema.org JSON-LD FAQPage Structured Data
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30">
                      Live Dynamic
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Automatically generated and injected for {activeState.name} ({activeState.code}) • {allQuestionsForSchema.length} Question/Answer entities
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSchemaModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Subheader & Actions */}
            <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="font-semibold text-slate-900">Script ID:</span>
                <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-[11px] font-mono text-emerald-700">
                  faq-section-jsonld-schema
                </code>
                <span className="text-slate-400">• Injected in &lt;head&gt; &amp; &lt;body&gt;</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySchema}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span className="text-[#16a34a]">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy JSON-LD</span>
                    </>
                  )}
                </button>

                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Rich Results Test</span>
                </a>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto p-6 bg-slate-950 text-slate-200">
              <pre className="text-xs font-mono leading-relaxed whitespace-pre font-normal text-emerald-400/90 select-all">
                {JSON.stringify(faqSchema, null, 2)}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                Valid Schema.org <code>FAQPage</code> syntax adhering to Google Search Central guidelines.
              </div>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
