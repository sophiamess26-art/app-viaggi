import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, Hotel, UtensilsCrossed, Bus, Map as MapIcon, Sparkles, Plane, Briefcase, Info } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  country: string;
  description: string;
  aesthetic_reason: string;
  image_query: string;
  hotel: {
    name: string;
    description: string;
    how_to_get_there: string;
  };
  food: {
    dish_name: string;
    place_to_eat: string;
    description: string;
    location_details: string;
  };
  flights: {
    type: 'ECONOMY' | 'PREMIUM' | 'LUXURY';
    airline: string;
    estimated_price: string;
    baggage: {
      included: string;
      dimensions: string;
      weight: string;
    };
  }[];
}

interface VibeScrollProps {
  locations: Location[];
  translations: any;
}

export const VibeScroll: React.FC<VibeScrollProps> = ({ locations, translations }) => {
  const t = translations;
  return (
    <div className="w-full space-y-32 pb-32">
      {locations.map((loc, index) => (
        <motion.section
          key={loc.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl mx-auto px-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Image and Title Area */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={`https://picsum.photos/seed/${loc.id}/1200/800`}
                  alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-[var(--vibe-accent)]" />
                    <span className="text-sm font-medium tracking-widest uppercase opacity-80">
                      {loc.country}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                    {loc.name}
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--vibe-primary)] font-bold text-sm uppercase tracking-wider">
                  <Sparkles size={16} />
                  <span>{t.matchLabel}</span>
                </div>
                <p className="text-2xl font-medium leading-relaxed text-[var(--vibe-text)]">
                  {loc.aesthetic_reason}
                </p>
                <p className="text-lg text-[var(--vibe-text)] opacity-70 leading-relaxed">
                  {loc.description}
                </p>
              </div>

              {/* Flights Section */}
              <div className="space-y-6 pt-8">
                <div className="flex items-center gap-2 text-[var(--vibe-primary)] font-bold text-sm uppercase tracking-wider">
                  <Plane size={18} />
                  <span>{t.flightsLabel}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loc.flights.map((flight) => (
                    <motion.div 
                      key={flight.type} 
                      whileHover={{ y: -5, scale: 1.02 }}
                      onClick={() => {
                        const query = encodeURIComponent(`${flight.airline} flights to ${loc.name} ${loc.country}`);
                        window.open(`https://www.skyscanner.it/trasporti/voli-per/${loc.name.toLowerCase().replace(/\s+/g, '-')}`, '_blank');
                      }}
                      className="glass-panel p-6 space-y-4 border-t-4 border-t-[var(--vibe-primary)]/30 cursor-pointer group/flight"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40 block mb-1">
                            {flight.type}
                          </span>
                          <p className="font-bold text-sm group-hover/flight:text-[var(--vibe-primary)] transition-colors">{flight.airline}</p>
                        </div>
                        <span className="text-lg font-bold text-[var(--vibe-primary)]">{flight.estimated_price}</span>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-black/5">
                        <div className="flex items-center gap-2 text-xs opacity-70">
                          <Briefcase size={14} className="shrink-0" />
                          <span className="font-medium">{flight.baggage.included}</span>
                        </div>
                        <div className="flex items-start gap-2 text-[10px] opacity-50 leading-tight">
                          <Info size={12} className="shrink-0 mt-0.5" />
                          <div>
                            <p>{flight.baggage.dimensions}</p>
                            <p>{flight.baggage.weight}</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 text-[10px] font-bold uppercase tracking-widest text-[var(--vibe-primary)] opacity-0 group-hover/flight:opacity-100 transition-opacity flex items-center gap-1">
                        <span>Prenota ora</span>
                        <ArrowRight size={10} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar with Hotel and Food */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <span className="text-[var(--vibe-primary)] font-mono text-xs uppercase tracking-widest opacity-50 block">
                  0{index + 1} / {t.detailsLabel}
                </span>

                {/* Hotel Card */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.hotel.name}, ${loc.name}, ${loc.country}`)}`, '_blank')}
                  className="glass-panel p-8 space-y-4 border-l-4 border-l-[var(--vibe-primary)] cursor-pointer group/card"
                >
                  <div className="flex items-center justify-between text-[var(--vibe-primary)]">
                    <div className="flex items-center gap-3">
                      <Hotel size={24} />
                      <h3 className="text-xl font-bold font-display">{t.stayLabel}</h3>
                    </div>
                    <MapIcon size={18} className="opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-lg">{loc.hotel.name}</p>
                      <p className="text-sm opacity-70 leading-relaxed">{loc.hotel.description}</p>
                    </div>
                    <div className="pt-3 border-t border-black/5 flex gap-3">
                      <Bus size={16} className="shrink-0 mt-1 opacity-60" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-40 mb-1">{t.getThereLabel}</p>
                        <p className="text-sm leading-snug">{loc.hotel.how_to_get_there}</p>
                      </div>
                    </div>
                    <div className="pt-4 mt-2 border-t border-black/5 flex items-center justify-between text-[var(--vibe-primary)] font-bold text-sm group-hover/card:translate-x-1 transition-transform">
                      <span>{t.exploreMaps}</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>

                {/* Food Card */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.food.place_to_eat}, ${loc.name}, ${loc.country}`)}`, '_blank')}
                  className="glass-panel p-8 space-y-4 border-l-4 border-l-[var(--vibe-accent)] cursor-pointer group/card"
                >
                  <div className="flex items-center justify-between text-[var(--vibe-primary)]">
                    <div className="flex items-center gap-3">
                      <UtensilsCrossed size={24} />
                      <h3 className="text-xl font-bold font-display">{t.foodLabel}</h3>
                    </div>
                    <MapIcon size={18} className="opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="font-bold text-lg">{loc.food.dish_name}</p>
                      <p className="text-sm font-medium italic opacity-80">{loc.food.place_to_eat}</p>
                      <p className="text-sm opacity-70 leading-relaxed mt-1">{loc.food.description}</p>
                    </div>
                    <div className="pt-3 border-t border-black/5 flex gap-3">
                      <MapIcon size={16} className="shrink-0 mt-1 opacity-60" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-40 mb-1">{t.findLabel}</p>
                        <p className="text-sm leading-snug">{loc.food.location_details}</p>
                      </div>
                    </div>
                    <div className="pt-4 mt-2 border-t border-black/5 flex items-center justify-between text-[var(--vibe-primary)] font-bold text-sm group-hover/card:translate-x-1 transition-transform">
                      <span>{t.exploreMaps}</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ x: 10 }}
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.name}, ${loc.country}`)}`, '_blank')}
                className="w-full py-6 bg-[var(--vibe-primary)] text-[var(--vibe-bg)] rounded-2xl font-bold flex items-center justify-center gap-3 group transition-all hover:opacity-90"
              >
                <span>{t.exploreBtn}</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </motion.section>
      ))}
    </div>
  );
};
