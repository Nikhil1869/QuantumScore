import type { Sport } from '../lib/sports-data';
import { Card } from './Card';

export function SportSelector({ onSelect }: { onSelect: (s: Sport) => void }) {
  const sports: { id: Sport; icon: string; title: string; stats: string }[] = [
    { id: 'football', icon: '⚽', title: 'Football', stats: '92% Accuracy • 142k Matches' },
    { id: 'cricket', icon: '🏏', title: 'Cricket', stats: '88% Accuracy • 45k Matches' },
    { id: 'basketball', icon: '🏀', title: 'Basketball', stats: '89% Accuracy • 82k Matches' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Select a Sport</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sports.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="text-left"
          >
            <Card className="p-6 transition-all duration-300 hover:border-sage hover:shadow-md group h-full">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform origin-left">{s.icon}</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-olive transition-colors">{s.title}</h3>
              <p className="text-xs text-textMuted">{s.stats}</p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
