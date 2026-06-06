import React, { useState, useRef, useEffect } from 'react';
import { CRICKET_TEAMS, TEAMS } from '../lib/sports-data';
import type { Sport } from '../lib/sports-data';

interface TeamSelectProps {
  sport: Sport;
  value: string;
  onChange: (team: string) => void;
  label: string;
}

export function TeamSelect({ sport, value, onChange, label }: TeamSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isIntlOpen, setIsIntlOpen] = useState(true);
  const [isIplOpen, setIsIplOpen] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (team: string) => {
    onChange(team);
    setIsOpen(false);
    setSearch('');
  };

  const renderOptions = () => {
    if (sport !== 'cricket') {
      const filtered = TEAMS[sport].filter(t => t.toLowerCase().includes(search.toLowerCase()));
      return filtered.map(t => (
        <div key={t} onClick={() => handleSelect(t)} className="px-4 py-2 hover:bg-sage/20 cursor-pointer text-sm font-semibold text-textMain">
          {t}
        </div>
      ));
    }

    // Cricket specifically
    const filteredIntl = CRICKET_TEAMS.international.filter(t => t.toLowerCase().includes(search.toLowerCase()));
    const filteredIpl = CRICKET_TEAMS.ipl.filter(t => t.toLowerCase().includes(search.toLowerCase()));

    return (
      <>
        {filteredIntl.length > 0 && (
          <div className="py-1">
            <div 
              className="px-3 py-2 text-xs font-bold text-olive/80 uppercase bg-gray-50/80 cursor-pointer flex justify-between items-center hover:bg-sage/10 transition-colors"
              onClick={() => setIsIntlOpen(!isIntlOpen)}
            >
              <span>International Teams</span>
              <svg className={`w-3 h-3 transition-transform ${isIntlOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {isIntlOpen && filteredIntl.map(t => (
              <div key={t} onClick={() => handleSelect(t)} className="px-4 py-2 hover:bg-sage/20 cursor-pointer text-sm font-semibold text-textMain">
                {t}
              </div>
            ))}
          </div>
        )}
        {filteredIpl.length > 0 && (
          <div className="py-1 border-t border-sage/10">
            <div 
              className="px-3 py-2 text-xs font-bold text-olive/80 uppercase bg-gray-50/80 cursor-pointer flex justify-between items-center hover:bg-sage/10 transition-colors"
              onClick={() => setIsIplOpen(!isIplOpen)}
            >
              <span>IPL Franchises</span>
              <svg className={`w-3 h-3 transition-transform ${isIplOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {isIplOpen && filteredIpl.map(t => (
              <div key={t} onClick={() => handleSelect(t)} className="px-4 py-2 hover:bg-sage/20 cursor-pointer text-sm font-semibold text-textMain">
                {t}
              </div>
            ))}
          </div>
        )}
        {filteredIntl.length === 0 && filteredIpl.length === 0 && (
          <div className="px-4 py-3 text-sm text-textMuted text-center">No teams found</div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={wrapperRef}>
      <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark cursor-pointer flex justify-between items-center"
      >
        <span>{value || "Select Team"}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-surface border border-sage/40 rounded-xl shadow-lg max-h-64 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-sage/20">
            <input 
              type="text" 
              placeholder="Search teams..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50/50 border border-sage/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage focus:ring-1 focus:ring-sage"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {renderOptions()}
          </div>
        </div>
      )}
    </div>
  );
}
