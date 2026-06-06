import { useState } from 'react';
import type { Sport } from '../lib/sports-data';
import { TEAMS } from '../lib/sports-data';
import { Card } from './Card';
import { predictOutcome } from '../lib/predictor';

interface PredictionFormProps {
  sport: Sport;
  onPredict: (result: any) => void;
}

export function PredictionForm({ sport, onPredict }: PredictionFormProps) {
  const [homeTeam, setHomeTeam] = useState(TEAMS[sport][0]);
  const [awayTeam, setAwayTeam] = useState(TEAMS[sport][1]);
  const [isPredicting, setIsPredicting] = useState(false);

  // Form states specific to sport
  const [weather, setWeather] = useState('clear');
  const [pitch, setPitch] = useState('dry');

  // Advanced feature states
  const [homeRestDays, setHomeRestDays] = useState(7);
  const [awayRestDays, setAwayRestDays] = useState(7);
  const [matchContext, setMatchContext] = useState('Regular');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    const result = await predictOutcome(sport, homeTeam, awayTeam, { 
      weather, 
      pitch,
      homeRestDays,
      awayRestDays,
      matchContext
    });
    setIsPredicting(false);
    onPredict(result);
  };

  return (
    <Card className="w-full">
      <div className="p-8 border-b border-sage/20 text-center relative">
        <h2 className="text-2xl font-bold capitalize text-textMain">New {sport} Prediction</h2>
        <p className="text-sm text-textMuted mt-1 font-medium">Fill in match details below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Home Team</label>
            <select 
              className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
            >
              {TEAMS[sport].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Away Team</label>
            <select 
              className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
            >
              {TEAMS[sport].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Advanced Modifiers based on external feature analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Home Rest Days: {homeRestDays}</label>
            <input 
              type="range" min="2" max="14" step="1"
              value={homeRestDays}
              onChange={(e) => setHomeRestDays(parseInt(e.target.value))}
              className="w-full accent-sage"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Away Rest Days: {awayRestDays}</label>
            <input 
              type="range" min="2" max="14" step="1"
              value={awayRestDays}
              onChange={(e) => setAwayRestDays(parseInt(e.target.value))}
              className="w-full accent-sage"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Match Context</label>
            <select 
              className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
              value={matchContext}
              onChange={(e) => setMatchContext(e.target.value)}
            >
              <option value="Regular">Regular Match</option>
              <option value="Derby">Local Derby</option>
              <option value="Top 6 Clash">Top 6 Clash</option>
              <option value="Relegation Battle">Relegation Battle</option>
            </select>
          </div>
        </div>

        {/* Custom Modifiers based on sport to replicate the Uizard modal forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Weather Conditions</label>
            <select 
              className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
            >
              <option value="clear">Clear / Sunny</option>
              <option value="rain">Rain / Wet</option>
              <option value="snow">Snow / Cold</option>
            </select>
          </div>

          {sport === 'cricket' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Pitch Condition</label>
              <select 
                className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
              >
                <option value="dry">Dry / Dusty</option>
                <option value="green">Green / Seaming</option>
                <option value="flat">Flat / Batting Friendly</option>
              </select>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isPredicting || homeTeam === awayTeam}
          className="w-full bg-sage hover:bg-sage-dark disabled:bg-sage-light disabled:text-olive/50 text-olive-dark font-bold py-3.5 rounded-full mt-4 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {isPredicting ? (
            <>
              <div className="w-4 h-4 border-2 border-olive-dark/30 border-t-olive-dark rounded-full animate-spin" />
              Running Model...
            </>
          ) : 'Generate Prediction'}
        </button>
      </form>
    </Card>
  );
}
