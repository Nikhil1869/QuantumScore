import { Filter } from 'lucide-react';
import { useState } from 'react';

export function RecentPredictions({ predictions }: { predictions: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (predictions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-textMuted">
        No predictions made yet. Go make one!
      </div>
    );
  }

  const filteredPredictions = predictions.filter(p => 
    p.sport?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.outcome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    'Home vs Away'.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Prediction History</h2>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-olive text-white rounded font-medium text-sm hover:bg-olive-dark">
            Filter <Filter size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <select className="bg-olive text-white px-3 py-1.5 rounded text-sm outline-none">
          <option>All time</option>
        </select>
        <input 
          type="text" 
          placeholder="Search past predictions by sport or outcome..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-surface border-none px-4 py-1.5 rounded text-sm flex-1 outline-none focus:ring-1 ring-olive/50"
        />
      </div>

      <div className="flex-1 overflow-auto rounded-t-lg border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-textMuted border-b border-gray-100 bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium w-8"><input type="checkbox" /></th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Sport</th>
              <th className="px-4 py-3 font-medium">Matchup</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3 font-medium">Predicted Outcome</th>
            </tr>
          </thead>
          <tbody>
            {filteredPredictions.map((p, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3"><input type="checkbox" /></td>
                <td className="px-4 py-3 text-textMuted">{p.date}</td>
                <td className="px-4 py-3 font-medium capitalize">{p.sport}</td>
                <td className="px-4 py-3">Home vs Away</td>
                <td className="px-4 py-3 font-medium text-textMain">{(p.confidence * 100).toFixed(1)}%</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium inline-block w-24 text-center ${
                    p.outcome === 'Home Win' ? 'bg-sage text-olive-dark' : 
                    p.outcome === 'Away Win' ? 'bg-olive text-white' : 
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {p.outcome}
                  </span>
                </td>
              </tr>
            ))}
            {filteredPredictions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-textMuted">
                  No predictions match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
