import { useState } from 'react';
import { Card } from './Card';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryRow {
  id: number;
  match: string;
  sport: string;
  predicted: string;
  actual: string;
  confidence: number;
  isCorrect: boolean;
  date: string;
}

interface Props {
  data: HistoryRow[];
}

export function PredictionHistoryTable({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(row => 
    row.match.toLowerCase().includes(searchTerm.toLowerCase()) || 
    row.sport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <Card className="w-full mt-6">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <h3 className="font-semibold text-textMain text-lg">Prediction History</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-olive" />
          <input 
            type="text" 
            placeholder="Search match or sport..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2 bg-surface border border-sage/40 rounded-full text-sm outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark text-textMain w-[250px]"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-textMain">
          <thead className="bg-surface border-b border-sage/20 text-xs text-olive capitalize">
            <tr>
              <th className="px-6 py-4 font-semibold w-10">
                <input type="checkbox" className="rounded border-sage/50 text-olive focus:ring-olive" />
              </th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Match</th>
              <th className="px-6 py-4 font-semibold">Sport</th>
              <th className="px-6 py-4 font-semibold">Predicted</th>
              <th className="px-6 py-4 font-semibold">Actual</th>
              <th className="px-6 py-4 font-semibold">Confidence</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/10 text-textMuted">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-sage-light/30 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-sage/50 text-olive focus:ring-olive" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                <td className="px-6 py-4 font-semibold text-textMain">{row.match}</td>
                <td className="px-6 py-4">
                  <span className="bg-sage-light px-2.5 py-1 rounded border border-sage/30 text-xs text-olive-dark font-medium">{row.sport}</span>
                </td>
                <td className="px-6 py-4">{row.predicted}</td>
                <td className="px-6 py-4">{row.actual === 'Pending' ? '-' : row.actual}</td>
                <td className="px-6 py-4">{row.confidence}%</td>
                <td className="px-6 py-4 text-center">
                  {row.isCorrect === null ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-surface text-olive border border-sage/30">
                      Pending
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      row.isCorrect 
                        ? 'bg-[#eaf0e4] text-[#3e4a38]' 
                        : 'bg-[#fff4f4] text-[#c92a2a]'
                    }`}>
                      {row.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-textMuted">
                  No predictions found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-textMuted">
          Showing <span className="font-medium">{Math.min(1 + (currentPage - 1) * itemsPerPage, filteredData.length)}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
