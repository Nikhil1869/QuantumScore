import type { Sport } from './sports-data';

export interface PredictionFeature {
  name: string;
  value: number; // 0 to 1
}

export interface PredictionResultData {
  homeWin: number;
  draw: number;
  awayWin: number;
  confidence: number;
  featureImportance: PredictionFeature[];
  modelVersion: string;
  inferenceMs: number;
  insights: string[];
}

// Deterministic mock predictor
export const predictOutcome = async (
  sport: Sport,
  homeTeam: string,
  awayTeam: string,
  formData: any
): Promise<PredictionResultData> => {
  // Simulate network delay
  const inferenceMs = 600 + Math.random() * 400;
  await new Promise(resolve => setTimeout(resolve, inferenceMs));

  // Create a deterministic hash from the team names to generate stable "randomness"
  const hash = (homeTeam + awayTeam).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Base probabilities based on hash
  let homeWin = (hash % 60) + 20; // 20-80%
  let draw = sport === 'basketball' ? 0 : (hash % 20) + 10; // 10-30%
  let awayWin = 100 - homeWin - draw;

  // Track dynamic insights
  let insights: string[] = [];

  // 1. APPLY REST DAYS ADVANTAGE
  const homeRest = formData.homeRestDays ? parseInt(formData.homeRestDays, 10) : 7;
  const awayRest = formData.awayRestDays ? parseInt(formData.awayRestDays, 10) : 7;
  const restAdvantage = homeRest - awayRest;
  
  if (Math.abs(restAdvantage) > 2) {
    // Huge impact for 3+ days difference
    const restModifier = restAdvantage * 1.5;
    homeWin += restModifier;
    awayWin -= restModifier;
    const restedTeam = restAdvantage > 0 ? homeTeam : awayTeam;
    const tiredTeam = restAdvantage > 0 ? awayTeam : homeTeam;
    insights.push(`Significant ${Math.abs(restAdvantage)}-day rest advantage for ${restedTeam} severely penalizes ${tiredTeam}'s expected performance.`);
  }

  // 2. APPLY MATCH CONTEXT (Derby, Top 6, Relegation)
  if (formData.matchContext === 'Derby') {
    // Derbies are tight, draw probability spikes
    draw += 15;
    homeWin -= 7.5;
    awayWin -= 7.5;
    insights.push("Local Derby dynamics heavily increase the probability of a tight, low-scoring draw.");
  } else if (formData.matchContext === 'Top 6 Clash') {
    // Top 6 clash slightly favors the home team tactically
    homeWin += 5;
    insights.push("In Top 6 clashes, tactical rigidity slightly favors the home side.");
  } else if (formData.matchContext === 'Relegation Battle') {
    // Relegation battles are highly volatile
    insights.push("Relegation battle context adds high volatility to the expected outcome.");
  }

  // Normalize
  const total = homeWin + draw + awayWin;
  homeWin = (homeWin / total) * 100;
  draw = (draw / total) * 100;
  awayWin = (awayWin / total) * 100;

  // Confidence is how dominant the winning prediction is
  const maxProb = Math.max(homeWin, draw, awayWin);
  let confidence = maxProb > 60 ? (maxProb / 100) * 1.1 : (maxProb / 100) * 1.3;
  if (formData.matchContext === 'Relegation Battle') confidence *= 0.85; // Penalty for volatility
  confidence = Math.min(0.99, Math.max(0.4, confidence));

  // Generate features based on sport
  let featureImportance: PredictionFeature[] = [];

  if (sport === 'football') {
    // Upgraded Football Features based on external repo
    featureImportance = [
      { name: 'Bayesian Elo Rating', value: 0.35 },
      { name: 'Expected Goals (xG)', value: 0.25 },
      { name: 'Rest Days Advantage', value: 0.20 },
      { name: 'Recent Goal Patterns', value: 0.10 },
      { name: 'Travel Distance', value: 0.10 },
    ];
    if (insights.length === 0) {
      insights.push(`${homeTeam}'s superior Bayesian Elo Rating is heavily influencing the model.`);
      insights.push(`Shot conversion metrics and Expected Goals (xG) strongly correlate with this outcome.`);
    }
  } else if (sport === 'cricket') {
    featureImportance = [
      { name: 'Batting Avg', value: 0.30 },
      { name: 'Pitch Type', value: 0.25 },
      { name: 'Bowling Economy', value: 0.20 },
      { name: 'Toss Winner', value: 0.15 },
      { name: 'Weather', value: 0.10 },
    ];
    if (insights.length === 0) {
      insights.push(`The pitch conditions favor the spin attack of ${maxProb === homeWin ? homeTeam : awayTeam}.`);
      insights.push(`Batting averages in recent matches strongly correlate with this prediction.`);
    }
  } else {
    // Basketball
    featureImportance = [
      { name: 'Points Per Game', value: 0.30 },
      { name: 'Rest Advantage', value: 0.25 },
      { name: '3PT Percentage', value: 0.20 },
      { name: 'Rebounds', value: 0.15 },
      { name: 'Pace', value: 0.10 },
    ];
    if (insights.length === 0) {
      insights.push(`Perimeter shooting efficiency (3PT%) is the defining metric for this matchup.`);
      insights.push(`Rebounding dominance will likely control the game tempo.`);
    }
  }

  // Jiggle feature values slightly deterministically
  featureImportance = featureImportance.map(f => ({
    name: f.name,
    value: Math.min(1, Math.max(0, f.value + ((hash % 10) - 5) / 100))
  })).sort((a, b) => b.value - a.value);

  return {
    homeWin,
    draw,
    awayWin,
    confidence,
    featureImportance,
    modelVersion: "XGB-V2.1-Advanced",
    inferenceMs: Math.round(inferenceMs),
    insights
  };
};
