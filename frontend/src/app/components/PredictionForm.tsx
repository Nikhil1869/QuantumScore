import { useState } from 'react';
import type { Sport } from '../lib/sports-data';
import { TEAMS } from '../lib/sports-data';
import { Card } from './Card';
import { TeamSelect } from './TeamSelect';
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
  
  // Live Match Metrics
  const [currentScore, setCurrentScore] = useState<string>('');
  const [oversCompleted, setOversCompleted] = useState<string>('');
  const [wicketsLost, setWicketsLost] = useState<string>('');
  const [targetScore, setTargetScore] = useState<string>('');
  const [actualScore, setActualScore] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    const result = await predictOutcome(sport, homeTeam, awayTeam, { 
      weather, 
      pitch,
      homeRestDays,
      awayRestDays,
      matchContext,
      current_score: parseInt(currentScore) || 0,
      overs_completed: parseFloat(oversCompleted) || 0,
      wickets_lost: parseInt(wicketsLost) || 0,
      target_score: parseInt(targetScore) || 0,
      actual_score: parseInt(actualScore) || 0
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
          <TeamSelect
            sport={sport}
            label="Home Team"
            value={homeTeam}
            onChange={setHomeTeam}
          />

          <TeamSelect
            sport={sport}
            label="Away Team"
            value={awayTeam}
            onChange={setAwayTeam}
          />
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

        {/* Live Metrics for Cricket (In-play scenarios) */}
        {sport === 'cricket' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Current Score</label>
              <input 
                type="number" min="0" max="400"
                value={currentScore}
                onChange={(e) => setCurrentScore(e.target.value)}
                className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Overs Done</label>
              <input 
                type="number" step="0.1" min="0" max="50"
                value={oversCompleted}
                onChange={(e) => setOversCompleted(e.target.value)}
                className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
                placeholder="0.0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Wickets Lost</label>
              <input 
                type="number" min="0" max="10"
                value={wicketsLost}
                onChange={(e) => setWicketsLost(e.target.value)}
                className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Target Score (If 2nd Inn)</label>
              <input 
                type="number" min="0" max="400"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark"
                placeholder="0 for 1st Innings"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-olive/80 uppercase tracking-wide">Actual Final Score</label>
              <input 
                type="number" min="0" max="400"
                value={actualScore}
                onChange={(e) => setActualScore(e.target.value)}
                className="w-full border border-sage/40 bg-surface rounded-xl p-3 text-sm font-semibold text-textMain outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark bg-sage/5"
                placeholder="For testing error"
              />
            </div>
          </div>
        )}

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
