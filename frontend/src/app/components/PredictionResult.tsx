import type { PredictionResultData } from '../lib/predictor';
import { Card } from './Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { Sport } from '../lib/sports-data';

export function PredictionResult({ result, sport, onReset }: { result: PredictionResultData, sport: Sport, onReset: () => void }) {
  const pieData = [
    { name: 'Home Win', value: result.homeWin },
    { name: 'Draw', value: result.draw },
    { name: 'Away Win', value: result.awayWin },
  ];

  // Sage/Olive color palette for charts
  const COLORS = ['#6b7e61', '#e5e7eb', '#d8e6c4'];

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Prediction Results</h2>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-surface text-textMain border border-gray-200 rounded font-medium text-sm hover:bg-gray-100"
        >
          New Prediction
        </button>
      </div>

      {/* Model Diagnostic / Error Analysis Card */}
      {result.actualScore && result.projectedScore && (
        <Card className="p-6 bg-olive/10 border-olive/30">
          <h3 className="text-sm font-bold mb-6 text-olive-dark flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Post-Match Error Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col gap-1 p-4 bg-white/60 rounded-xl">
              <span className="text-xs font-bold text-olive/70 uppercase tracking-wider">Match</span>
              <span className="text-base font-bold text-textMain">{result.homeTeamName} vs {result.awayTeamName}</span>
            </div>
            <div className="flex flex-col gap-1 p-4 bg-white/60 rounded-xl">
              <span className="text-xs font-bold text-olive/70 uppercase tracking-wider">Actual Score</span>
              <span className="text-2xl font-bold text-textMain">{result.actualScore}</span>
            </div>
            <div className="flex flex-col gap-1 p-4 bg-white/60 rounded-xl">
              <span className="text-xs font-bold text-olive/70 uppercase tracking-wider">Predicted Score</span>
              <span className="text-2xl font-bold text-textMain">{result.projectedScore}</span>
            </div>
            <div className="flex flex-col gap-1 p-4 bg-white/60 rounded-xl border-b-4 border-red-500 shadow-sm">
              <span className="text-xs font-bold text-olive/70 uppercase tracking-wider">Absolute Error</span>
              <span className="text-2xl font-bold text-red-600">{Math.abs(result.actualScore - result.projectedScore)} Runs</span>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Outcome Card */}
        <Card className="col-span-1 md:col-span-2 p-6 flex flex-col justify-center relative">
          <h3 className="text-sm font-bold absolute top-6 left-6 text-textMain">Match Outcome Probabilities</h3>
          
          <div className="w-full flex flex-col gap-6 mt-12">
            
            {/* Home Team Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg text-textMain">{result.homeTeamName}</span>
                <span className="font-bold text-xl text-olive">{result.homeWin.toFixed(1)}%</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-olive transition-all duration-1000 ease-out rounded-full" 
                  style={{ width: `${result.homeWin}%` }}
                ></div>
              </div>
            </div>

            {/* Away Team Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg text-textMain">{result.awayTeamName}</span>
                <span className="font-bold text-xl text-sage-dark">{result.awayWin.toFixed(1)}%</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sage-dark transition-all duration-1000 ease-out rounded-full" 
                  style={{ width: `${result.awayWin}%` }}
                ></div>
              </div>
            </div>

            {/* Draw Bar (Only for sports with draws) */}
            {result.draw > 0 && (
              <div className="flex flex-col gap-2 mt-2 opacity-60">
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-sm text-textMuted">Draw</span>
                  <span className="font-semibold text-sm text-textMuted">{result.draw.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-400 transition-all duration-1000 ease-out rounded-full" 
                    style={{ width: `${result.draw}%` }}
                  ></div>
                </div>
              </div>
            )}

          </div>
        </Card>

        {/* Confidence KPI Card */}
        <Card className="col-span-1 p-6 flex flex-col justify-center">
          <div className="text-xs text-textMuted mb-2">Model Confidence</div>
          <div className="text-4xl font-bold flex items-center gap-2 mb-2">
            {(result.confidence * 100).toFixed(1)}%
            {result.confidence > 0.7 ? (
              <span className="text-olive text-lg">↑</span>
            ) : (
              <span className="text-red-500 text-lg">↓</span>
            )}
          </div>
          <div className="text-xs text-textMuted mt-4">
            Based on current {sport} weights and historical dataset alignment.
          </div>
        </Card>
      </div>

      {/* AI Insights / Match Summary */}
      {result.insights && result.insights.length > 0 && (
        <Card className="p-6 bg-olive/5 border-olive/20">
          <h3 className="text-sm font-bold mb-4 text-olive-dark flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            AI Match Summary
          </h3>
          <div className="flex flex-col gap-3">
            {result.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/60 p-3 rounded-lg border border-sage/30">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-sage/40 flex items-center justify-center flex-shrink-0 text-olive-dark text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm font-medium text-textMain leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Feature Importance */}
      <Card className="p-6">
        <h3 className="text-sm font-bold mb-6">Feature Importance (SHAP values)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.featureImportance} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
              <Tooltip 
                cursor={{fill: '#f5f5f5'}}
                formatter={(value: any) => Number(value).toFixed(3)}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f5f6f5', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="#6b7e61" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}


