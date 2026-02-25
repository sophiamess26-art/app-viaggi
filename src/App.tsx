import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoodInput } from './components/MoodInput';
import { VibeScroll } from './components/VibeScroll';
import { interpretMood, VibeResponse } from './services/vibeService';
import { Compass, Globe, Info, Check } from 'lucide-react';

const LANGUAGES = [
  { id: 'it', label: 'Italiano', flag: '🇮🇹' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const TRANSLATIONS: Record<string, any> = {
  it: {
    heroTitle: 'Scopri la tua',
    heroAesthetic: 'Meta Ideale.',
    heroSub: 'Dove vuoi sentirti? Descrivi un mood, un colore o un sogno, e lascia che l\'AI tracci il tuo viaggio.',
    calibrating: 'Calibrazione Vibe...',
    currentPalette: 'Palette Attuale',
    error: 'Il controllo del vibe è fallito. Prova un altro mood.',
    footer: 'Tutti i diritti riservati. Creato con Gemini 1.5 & Antigravity Engine.',
    placeholder: 'Descrivi il tuo mood... (es. \'solitario, nebbioso, architettura nordica\')',
    vibeBtn: 'Esplora',
    matchLabel: 'Corrispondenza Estetica',
    stayLabel: 'Dove Soggiornare',
    foodLabel: 'Sapori Tipici',
    getThereLabel: 'Come arrivare',
    findLabel: 'Dove trovarlo',
    exploreMaps: 'Esplora su Maps',
    detailsLabel: 'Dettagli Esperienza',
    exploreBtn: 'Esplora Destinazione',
    budgetLabel: 'Budget (al giorno)',
    minLabel: 'Min',
    maxLabel: 'Max',
    flightsLabel: 'Opzioni Volo',
    travelersLabel: 'Viaggiatori',
    adultsLabel: 'Adulti',
    childrenLabel: 'Bambini',
    petsLabel: 'Animali',
    durationLabel: 'Durata (giorni)',
    regionLabel: 'Regione',
    regions: {
      any: 'Ovunque',
      italy: 'Italia',
      europe: 'Europa',
      outside: 'Fuori Europa'
    },
    attractionsLabel: 'Cosa Visitare'
  },
  en: {
    heroTitle: 'Discover Your',
    heroAesthetic: 'Ideal Destination.',
    heroSub: 'Where do you want to feel? Describe a mood, a color, or a dream, and let AI map your journey.',
    calibrating: 'Calibrating Vibe...',
    currentPalette: 'Current Palette',
    error: 'The vibe check failed. Try another mood.',
    footer: 'All rights reserved. Built with Gemini 1.5 & Antigravity Engine.',
    placeholder: 'Describe your mood... (e.g. \'lonely, foggy, nordic architecture\')',
    vibeBtn: 'Explore',
    matchLabel: 'Aesthetic Match',
    stayLabel: 'Where to Stay',
    foodLabel: 'Typical Flavors',
    getThereLabel: 'How to get there',
    findLabel: 'Where to find it',
    exploreMaps: 'Explore on Maps',
    detailsLabel: 'Experience Details',
    exploreBtn: 'Explore Destination',
    budgetLabel: 'Budget (per day)',
    minLabel: 'Min',
    maxLabel: 'Max',
    flightsLabel: 'Flight Options',
    travelersLabel: 'Travelers',
    adultsLabel: 'Adults',
    childrenLabel: 'Children',
    petsLabel: 'Pets',
    durationLabel: 'Duration (days)',
    regionLabel: 'Region',
    regions: {
      any: 'Anywhere',
      italy: 'Italy',
      europe: 'Europe',
      outside: 'Outside Europe'
    },
    attractionsLabel: 'What to Visit'
  },
  fr: {
    heroTitle: 'Découvrez Votre',
    heroAesthetic: 'Destination Idéale.',
    heroSub: 'Où voulez-vous vous sentir ? Décrivez une ambiance, une couleur ou un rêve, et laissez l\'IA tracer votre voyage.',
    calibrating: 'Calibration du Vibe...',
    currentPalette: 'Palette Actuelle',
    error: 'Le contrôle du vibe a échoué. Essayez une altra ambiance.',
    footer: 'Tous droits réservés. Créé avec Gemini 1.5 & Antigravity Engine.',
    placeholder: 'Décrivez votre ambiance... (ex. \'solitaire, brumeux, architecture nordique\')',
    vibeBtn: 'Explorer',
    matchLabel: 'Match Esthétique',
    stayLabel: 'Où Séjourner',
    foodLabel: 'Saveurs Typiques',
    getThereLabel: 'Comment s\'y rendre',
    findLabel: 'Où le trouver',
    exploreMaps: 'Explorer su Maps',
    detailsLabel: 'Détails de l\'Expérience',
    exploreBtn: 'Explorer la Destination',
    budgetLabel: 'Budget (par jour)',
    minLabel: 'Min',
    maxLabel: 'Max',
    flightsLabel: 'Options de Vol',
    travelersLabel: 'Voyageurs',
    adultsLabel: 'Adultes',
    childrenLabel: 'Enfants',
    petsLabel: 'Animaux',
    durationLabel: 'Durée (jours)',
    regionLabel: 'Région',
    regions: {
      any: 'Partout',
      italy: 'Italie',
      europe: 'Europe',
      outside: 'Hors Europe'
    },
    attractionsLabel: 'À Visiter'
  },
  es: {
    heroTitle: 'Descubre Tu',
    heroAesthetic: 'Destino Ideal.',
    heroSub: '¿Dónde quieres sentirte? Describe un estado de ánimo, un color o un sueño, y deja que la IA trace tu viaje.',
    calibrating: 'Calibrando Vibe...',
    currentPalette: 'Paleta Actual',
    error: 'El control de vibe falló. Prueba otro estado de ánimo.',
    footer: 'Todos los derechos reservados. Creado con Gemini 1.5 & Antigravity Engine.',
    placeholder: 'Describe tu estado de ánimo... (ej. \'solitario, brumoso, arquitectura nórdica\')',
    vibeBtn: 'Explorar',
    matchLabel: 'Coincidencia Estética',
    stayLabel: 'Dónde Alojarse',
    foodLabel: 'Sabores Típicos',
    getThereLabel: 'Cómo llegar',
    findLabel: 'Dónde encontrarlo',
    exploreMaps: 'Explorar en Maps',
    detailsLabel: 'Detalles de la Experiencia',
    exploreBtn: 'Explorar Destino',
    budgetLabel: 'Presupuesto (por día)',
    minLabel: 'Mín',
    maxLabel: 'Máx',
    flightsLabel: 'Opciones de Vuelo',
    travelersLabel: 'Viajeros',
    adultsLabel: 'Adultos',
    childrenLabel: 'Niños',
    petsLabel: 'Mascotas',
    durationLabel: 'Duración (días)',
    regionLabel: 'Región',
    regions: {
      any: 'Cualquier lugar',
      italy: 'Italia',
      europe: 'Europa',
      outside: 'Fuera de Europa'
    },
    attractionsLabel: 'Qué Visitar'
  },
  de: {
    heroTitle: 'Entdecke Deine',
    heroAesthetic: 'Ideales Ziel.',
    heroSub: 'Wo möchtest du dich fühlen? Beschreibe eine Stimmung, eine Farbe oder einen Traum und lass die KI deine Reise planen.',
    calibrating: 'Vibe-Kalibrierung...',
    currentPalette: 'Aktuelle Palette',
    error: 'Vibe-Check fehlgeschlagen. Versuche eine andere Stimmung.',
    footer: 'Alle Rechte vorbehalten. Erstellt mit Gemini 1.5 & Antigravity Engine.',
    placeholder: 'Beschreibe deine Stimmung... (z.B. \'einsam, neblig, nordische Architektur\')',
    vibeBtn: 'Erkunden',
    matchLabel: 'Ästhetische Übereinstimmung',
    stayLabel: 'Unterkunft',
    foodLabel: 'Typische Aromen',
    getThereLabel: 'Anreise',
    findLabel: 'Standort',
    exploreMaps: 'Auf Maps erkunden',
    detailsLabel: 'Erlebnisdetails',
    exploreBtn: 'Ziel erkunden',
    budgetLabel: 'Budget (pro Tag)',
    minLabel: 'Min',
    maxLabel: 'Max',
    flightsLabel: 'Flugoptionen',
    travelersLabel: 'Reisende',
    adultsLabel: 'Erwachsene',
    childrenLabel: 'Kinder',
    petsLabel: 'Haustiere',
    durationLabel: 'Dauer (Tage)',
    regionLabel: 'Region',
    regions: {
      any: 'Überall',
      italy: 'Italien',
      europe: 'Europa',
      outside: 'Außerhalb Europas'
    },
    attractionsLabel: 'Sehenswürdigkeiten'
  }
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [vibeData, setVibeData] = useState<VibeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('vibeguide-lang');
    if (saved) {
      const found = LANGUAGES.find(l => l.id === saved);
      if (found) return found;
    }
    return LANGUAGES[0];
  });

  useEffect(() => {
    localStorage.setItem('vibeguide-lang', currentLang.id);
  }, [currentLang]);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isBudgetMenuOpen, setIsBudgetMenuOpen] = useState(false);
  const [budget, setBudget] = useState({ min: 50, max: 500 });
  const [travelers, setTravelers] = useState({ adults: 1, children: 0, pets: 0 });
  const [preferences, setPreferences] = useState({ days: 7, region: 'any' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLang.id];

  const getColorFromMood = (mood: string) => {
    const m = mood.toLowerCase();
    // Giallo (Gioia)
    if (m.includes('gioia') || m.includes('felic') || m.includes('joy') || m.includes('happy')) 
      return { primary: '#FBBF24', accent: '#F59E0B', bg: '#FFFBEB' }; 
    // Blu (Tristezza)
    if (m.includes('tristez') || m.includes('malincon') || m.includes('sad') || m.includes('blue')) 
      return { primary: '#3B82F6', accent: '#2563EB', bg: '#EFF6FF' }; 
    // Verde (Disgusto/Invidia)
    if (m.includes('disgust') || m.includes('invidia') || m.includes('envy') || m.includes('verde')) 
      return { primary: '#10B981', accent: '#059669', bg: '#ECFDF5' }; 
    // Rosso (Rabbia/Adrenalina)
    if (m.includes('rabbia') || m.includes('adrenalin') || m.includes('anger') || m.includes('rage') || m.includes('rosso')) 
      return { primary: '#EF4444', accent: '#DC2626', bg: '#FEF2F2' }; 
    // Viola (Noia/Stanchezza)
    if (m.includes('noia') || m.includes('stanc') || m.includes('bored') || m.includes('tired') || m.includes('viola')) 
      return { primary: '#8B5CF6', accent: '#7C3AED', bg: '#F5F3FF' }; 
    // Arancione (Energia)
    if (m.includes('energi') || m.includes('creativ') || m.includes('energy') || m.includes('arancione')) 
      return { primary: '#F97316', accent: '#EA580C', bg: '#FFF7ED' }; 
    // Rosa (Amore)
    if (m.includes('amore') || m.includes('dolcez') || m.includes('love') || m.includes('rosa')) 
      return { primary: '#EC4899', accent: '#DB2777', bg: '#FDF2F8' }; 
    // Azzurro (Calma)
    if (m.includes('calm') || m.includes('pace') || m.includes('peace') || m.includes('azzurro')) 
      return { primary: '#06B6D4', accent: '#0891B2', bg: '#ECFEFF' }; 
    // Neon
    if (m.includes('neon') || m.includes('night')) 
      return { primary: '#FF00FF', accent: '#00FFFF', bg: '#0F172A' }; 
    // Tech / Futuristico
    if (m.includes('futur') || m.includes('tecnolog') || m.includes('tech') || m.includes('cibernetico')) 
      return { primary: '#00D1FF', accent: '#0075FF', bg: '#F8FAFC' }; 
    // Elettrico / Vibrante
    if (m.includes('elettrico') || m.includes('vibrante') || m.includes('zap')) 
      return { primary: '#FFFF00', accent: '#FF00FF', bg: '#111111' };
    // Urbano
    if (m.includes('urbano') || m.includes('città') || m.includes('city')) 
      return { primary: '#64748B', accent: '#334155', bg: '#F1F5F9' };
    return null;
  };

  const handleMoodChange = (mood: string) => {
    const colors = getColorFromMood(mood);
    if (colors) {
      const root = document.documentElement;
      root.style.setProperty('--vibe-primary', colors.primary);
      root.style.setProperty('--vibe-accent', colors.accent);
      root.style.setProperty('--vibe-bg', colors.bg);
      // Update text color based on background brightness for accessibility
      const isDark = colors.bg === '#0F172A';
      root.style.setProperty('--vibe-text', isDark ? '#F8FAFC' : '#0F172A');
    }
  };

  const handleSearch = async (mood: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await interpretMood(mood, currentLang.label, budget, travelers, {
        days: preferences.days,
        region: t.regions[preferences.region as keyof typeof t.regions]
      });
      setVibeData(data);
      
      // Update CSS variables for dynamic theme
      const root = document.documentElement;
      root.style.setProperty('--vibe-primary', data.color_palette.primary);
      root.style.setProperty('--vibe-accent', data.color_palette.accent);
      root.style.setProperty('--vibe-bg', data.color_palette.bg);
      root.style.setProperty('--vibe-text', data.color_palette.text);

      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(t.error);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-end items-center pointer-events-none">
        <div className="flex gap-4 pointer-events-auto relative">
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="w-10 h-10 glass-panel flex items-center justify-center text-[var(--vibe-text)] hover:bg-white/20 transition-colors"
            >
              <Globe size={20} />
            </button>
            
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 glass-panel overflow-hidden shadow-2xl z-[60]"
                >
                  <div className="py-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setCurrentLang(lang);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center justify-between text-sm transition-colors hover:bg-black/5 ${
                          currentLang.id === lang.id ? 'text-[var(--vibe-primary)] font-bold' : 'text-[var(--vibe-text)] opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                        {currentLang.id === lang.id && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsBudgetMenuOpen(!isBudgetMenuOpen)}
              className="w-10 h-10 glass-panel flex items-center justify-center text-[var(--vibe-text)] hover:bg-white/20 transition-colors"
            >
              <Info size={20} />
            </button>

            <AnimatePresence>
              {isBudgetMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 glass-panel p-6 shadow-2xl z-[60] space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-50">{t.budgetLabel}</h4>
                      <div className="flex items-center justify-between text-lg font-bold text-[var(--vibe-primary)]">
                        <span>{budget.min}€</span>
                        <span className="opacity-30">—</span>
                        <span>{budget.max}€</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold opacity-40">{t.minLabel}</label>
                        <input 
                          type="range" 
                          min="10" 
                          max="200" 
                          step="10"
                          value={budget.min}
                          onChange={(e) => setBudget(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max - 20) }))}
                          className="w-full accent-[var(--vibe-primary)]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold opacity-40">{t.maxLabel}</label>
                        <input 
                          type="range" 
                          min="100" 
                          max="2000" 
                          step="50"
                          value={budget.max}
                          onChange={(e) => setBudget(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min + 20) }))}
                          className="w-full accent-[var(--vibe-primary)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-50">{t.travelersLabel}</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'adults', label: t.adultsLabel, min: 1 },
                        { key: 'children', label: t.childrenLabel, min: 0 },
                        { key: 'pets', label: t.petsLabel, min: 0 }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-sm font-medium opacity-70">{item.label}</span>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setTravelers(prev => ({ ...prev, [item.key]: Math.max(item.min, (prev as any)[item.key] - 1) }))}
                              className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5"
                            >
                              -
                            </button>
                            <span className="w-4 text-center text-sm font-bold">{(travelers as any)[item.key]}</span>
                            <button 
                              onClick={() => setTravelers(prev => ({ ...prev, [item.key]: (prev as any)[item.key] + 1 }))}
                              className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-50">{t.durationLabel}</h4>
                      <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          min="1" 
                          max="90"
                          value={preferences.days}
                          onChange={(e) => setPreferences(prev => ({ ...prev, days: Number(e.target.value) }))}
                          className="w-20 glass-panel px-3 py-2 text-sm font-bold text-[var(--vibe-primary)] focus:outline-none"
                        />
                        <input 
                          type="range" 
                          min="1" 
                          max="30" 
                          value={preferences.days}
                          onChange={(e) => setPreferences(prev => ({ ...prev, days: Number(e.target.value) }))}
                          className="flex-1 accent-[var(--vibe-primary)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-50">{t.regionLabel}</h4>
                      <select 
                        value={preferences.region}
                        onChange={(e) => setPreferences(prev => ({ ...prev, region: e.target.value }))}
                        className="w-full glass-panel px-3 py-2 text-sm font-bold text-[var(--vibe-primary)] focus:outline-none appearance-none cursor-pointer"
                      >
                        {Object.keys(t.regions).map(key => (
                          <option key={key} value={key} className="bg-white text-black">{t.regions[key as keyof typeof t.regions]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-[var(--vibe-accent)]/20 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[var(--vibe-primary)]/10 blur-[100px] rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl space-y-8"
        >
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="font-mono text-sm uppercase tracking-[0.3em] text-[var(--vibe-text)]"
            >
              Powered by Antigravity
            </motion.span>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-[var(--vibe-text)] leading-[0.9]">
              {t.heroTitle} <br />
              <span className="italic font-light">{t.heroAesthetic}</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-[var(--vibe-text)] opacity-60 max-w-2xl mx-auto font-light leading-relaxed">
            {t.heroSub}
          </p>

          <div className="pt-8">
            <MoodInput onSearch={handleSearch} onChange={handleMoodChange} isLoading={isLoading} translations={t} />
          </div>
        </motion.div>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {vibeData && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            {/* Mood Tags Bar */}
            <div className="sticky top-0 z-40 bg-[var(--vibe-bg)]/80 backdrop-blur-md border-b border-black/5 py-2 px-6 mb-8">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {vibeData.mood_tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[var(--vibe-primary)] text-[var(--vibe-bg)] text-[10px] font-bold uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {[vibeData.color_palette.primary, vibeData.color_palette.accent, vibeData.color_palette.bg].map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border-2 border-[var(--vibe-bg)] shadow-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono opacity-40">{t.currentPalette}</span>
                </div>
              </div>
            </div>

            <VibeScroll locations={vibeData.recommended_locations} translations={t} />
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[var(--vibe-bg)]/80 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full border-2 border-[var(--vibe-primary)] flex items-center justify-center"
            >
              <Compass size={40} className="text-[var(--vibe-primary)]" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 font-mono text-xs uppercase tracking-[0.5em] text-[var(--vibe-primary)]"
            >
              {t.calibrating}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-500 text-white rounded-full shadow-xl font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto py-12 px-8 border-t border-black/5 text-center">
        <p className="text-sm opacity-40 font-mono">
          © 2026 VibeGuide. {t.footer}
        </p>
      </footer>
    </div>
  );
}
