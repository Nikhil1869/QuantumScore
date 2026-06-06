export type Sport = 'football' | 'cricket' | 'basketball';

export const TEAMS = {
  football: ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'PSG'],
  cricket: ['India', 'Australia', 'England', 'New Zealand', 'South Africa', 'Pakistan', 'Chennai Super Kings', 'Mumbai Indians'],
  basketball: ['Lakers', 'Warriors', 'Celtics', 'Heat', 'Bulls', 'Nuggets', 'Suns', 'Bucks']
};

export const getSportAccent = (sport: Sport) => {
  switch (sport) {
    case 'football': return 'bg-green-500';
    case 'cricket': return 'bg-blue-500';
    case 'basketball': return 'bg-orange-500';
    default: return 'bg-purple-500';
  }
};

export const getSportAccentText = (sport: Sport) => {
  switch (sport) {
    case 'football': return 'text-green-500';
    case 'cricket': return 'text-blue-500';
    case 'basketball': return 'text-orange-500';
    default: return 'text-purple-500';
  }
};
