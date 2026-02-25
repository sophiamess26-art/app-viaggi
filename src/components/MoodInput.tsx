import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Send, Zap, Cpu, Globe, Compass } from 'lucide-react';

interface MoodInputProps {
  onSearch: (mood: string) => void;
  onChange?: (mood: string) => void;
  isLoading: boolean;
  translations: any;
}

export const MoodInput: React.FC<MoodInputProps> = ({ onSearch, onChange, isLoading, translations }) => {
  const [input, setInput] = useState('');

  const t = translations;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSearch(input);
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    if (onChange) onChange(val);
  };

  const suggestions = [
    { label: 'Neon Nightlife', icon: <Sparkles size={14} /> },
    { label: 'Futurismo', icon: <Zap size={14} /> },
    { label: 'Alta Tecnologia', icon: <Cpu size={14} /> },
    { label: 'Cyberpunk Tokyo', icon: <Globe size={14} /> },
    { label: 'Minimalist Alps', icon: <Compass size={14} /> }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <motion.div
          initial={false}
          animate={{
            scale: isLoading ? 0.98 : 1,
            opacity: 1
          }}
          className="relative flex items-center"
        >
          <div className="absolute left-6 text-[var(--vibe-primary)] opacity-50 group-focus-within:opacity-100 transition-opacity">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t.placeholder}
            className="w-full h-16 pl-14 pr-32 bg-white/80 backdrop-blur-xl border border-black/5 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[var(--vibe-primary)]/20 shadow-lg transition-all"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-12 px-6 bg-[var(--vibe-primary)] text-[var(--vibe-bg)] rounded-full font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles size={18} />
                </motion.div>
              ) : (
                <>
                  <span>{t.vibeBtn}</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </form>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => {
              handleInputChange(suggestion.label);
              onSearch(suggestion.label);
            }}
            className="text-xs font-medium px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-black/5 hover:bg-[var(--vibe-primary)] hover:text-[var(--vibe-bg)] transition-all text-[var(--vibe-text)] flex items-center gap-2 shadow-sm active:scale-95"
          >
            {suggestion.icon}
            <span>{suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
