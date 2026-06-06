// Mock backend endpoint data for the analytics dashboard

export const MODEL_META = {
  version: "XGB-V2.1-Advanced",
  lastTrained: "2026-06-01T08:00:00Z",
  metrics: {
    overallAccuracy: 0.764,
    precision: 0.742,
    recall: 0.781,
    f1Score: 0.761
  },
  winRates: {
    football: 0.72,
    cricket: 0.81,
    basketball: 0.78
  }
};

// Data for Confidence Calibration Chart (Predicted vs Actual Win Rate)
export const CALIBRATION_DATA = [
  { bin: "50-60%", predicted: 55, actual: 52 },
  { bin: "60-70%", predicted: 65, actual: 63 },
  { bin: "70-80%", predicted: 75, actual: 78 },
  { bin: "80-90%", predicted: 85, actual: 82 },
  { bin: "90-100%", predicted: 95, actual: 91 },
];

// Data for Global Feature Importance Bar Chart
export const GLOBAL_FEATURE_IMPORTANCE = [
  { feature: "Bayesian Elo Rating", impact: 0.85 },
  { feature: "Expected Goals (xG)", impact: 0.78 },
  { feature: "Rest Days Advantage", impact: 0.72 },
  { feature: "Historical H2H Win Rate", impact: 0.65 },
  { feature: "Recent Goal Patterns", impact: 0.54 },
  { feature: "Travel Distance", impact: 0.41 },
  { feature: "Pitch/Weather Context", impact: 0.38 },
];

// Data for Accuracy Trend Line Chart (Last 30 Days)
export const ACCURACY_TREND_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  
  // Create a realistic looking trend that generally improves but has noise
  const baseAcc = 72 + (i / 30) * 6; // Trends from 72 to 78
  const noise = (Math.random() - 0.5) * 5;
  
  return {
    date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    accuracy: Number((baseAcc + noise).toFixed(1))
  };
});

// Mock Data Drift Alert
export const DRIFT_ALERT = {
  active: true,
  message: "Slight data drift detected in 'Travel Distance' distributions for recent Basketball fixtures. Model retraining recommended.",
  severity: "warning" // 'info', 'warning', 'critical'
};

// Mock prediction history data
export const HISTORY_DATA = Array.from({ length: 50 }, (_, i) => {
  const sports = ['Football', 'Cricket', 'Basketball'];
  const sport = sports[Math.floor(Math.random() * sports.length)];
  const isCorrect = Math.random() > 0.25; // ~75% accuracy
  const homeWin = Math.random() > 0.5;
  return {
    id: 5000 - i,
    match: `Match ${5000 - i}`,
    sport,
    predicted: homeWin ? 'Home Win' : 'Away Win',
    actual: isCorrect ? (homeWin ? 'Home Win' : 'Away Win') : (homeWin ? 'Away Win' : 'Home Win'),
    confidence: Math.round(50 + Math.random() * 45),
    isCorrect,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString('en-GB')
  };
});