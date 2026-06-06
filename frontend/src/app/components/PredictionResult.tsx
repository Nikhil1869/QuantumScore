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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Outcome Card */}
        <Card className="col-span-1 md:col-span-2 p-6 flex flex-col justify-center items-center relative">
          <h3 className="text-sm font-bold absolute top-6 left-6 text-textMain">Match Outcome Probabilities</h3>
          <div className="h-64 w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `${(Number(value) * 100).toFixed(1)}%`}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f5f6f5', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-olive"></div> <span className="text-sm">Home ({(result.homeWin * 100).toFixed(0)}%)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200"></div> <span className="text-sm">Draw ({(result.draw * 100).toFixed(0)}%)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sage"></div> <span className="text-sm">Away ({(result.awayWin * 100).toFixed(0)}%)</span></div>
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


