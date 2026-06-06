import type { Sport } from './sports-data';

export interface PredictionFeature {
  name: string;
  value: number; // 0 to 1
}

export interface PredictionResultData {
  homeTeamName: string;
  awayTeamName: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
  featureImportance: PredictionFeature[];
  modelVersion: string;
  inferenceMs: number;
  insights: string[];
}

export const predictOutcome = async (
  sport: Sport,
  homeTeam: string,
  awayTeam: string,
  formData: any
): Promise<PredictionResultData> => {
  const startTime = Date.now();
  
  try {
    const response = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sport, homeTeam, awayTeam, ...formData })
    });
    
    if (!response.ok) throw new Error("Failed to fetch prediction");
    const data = await response.json();
    
    const inferenceMs = Date.now() - startTime;
    
    // Map feature dictionary to array
    const featureImportance = Object.entries(data.feature_importance || {}).map(
      ([name, value]) => ({ name, value: Number(value) })
    ).sort((a, b) => b.value - a.value);

    // Calibrated confidence logic
    // The backend returns a real calibrated confidence, usually above 50 (e.g. 55-90)
    // Map backend confidence (0-100 or 0-1 range). 
    // Wait, the backend returns confidence as `round(confidence * 100, 1)`
    const confidencePercent = data.confidence; 
    let confidenceRatio = confidencePercent / 100;
    
    // Map binary win to home/away/draw percentages
    let homeWin = 0;
    let awayWin = 0;
    let draw = sport === 'basketball' ? 0 : 5;
    
    if (data.winner === homeTeam) {
      homeWin = confidencePercent - (draw / 2);
      awayWin = 100 - homeWin - draw;
    } else {
      awayWin = confidencePercent - (draw / 2);
      homeWin = 100 - awayWin - draw;
    }

    return {
      homeTeamName: homeTeam,
      awayTeamName: awayTeam,
      homeWin: Math.max(0, homeWin),
      draw: draw,
      awayWin: Math.max(0, awayWin),
      confidence: confidenceRatio,
      featureImportance,
      modelVersion: "XGB-Calibrated-V3",
      inferenceMs,
      insights: data.reasons || []
    };
    
  } catch (err) {
    console.error("Predict error, falling back to mock:", err);
    // Fallback Mock Logic
    const inferenceMs = Date.now() - startTime;
    const hash = (homeTeam + awayTeam).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockConf = 0.75 + (hash % 20) / 100;
    return {
      homeTeamName: homeTeam,
      awayTeamName: awayTeam,
      homeWin: 65, draw: 5, awayWin: 30,
      confidence: mockConf,
      featureImportance: [{ name: "Fallback Feature", value: 0.8 }],
      modelVersion: "Mock-Fallback",
      inferenceMs,
      insights: ["Connected to mock backend due to API failure."]
    };
  }
};
