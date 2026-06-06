export type Sport = 'football' | 'cricket' | 'basketball';

export const CRICKET_TEAMS = {
  international: [
    'Afghanistan', 'Argentina', 'Australia', 'Austria', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 
    'Belgium', 'Belize', 'Bermuda', 'Bhutan', 'Botswana', 'Brazil', 'Bulgaria', 'Cambodia', 'Cameroon', 
    'Canada', 'Cayman Islands', 'Chile', 'China', 'Cook Islands', 'Costa Rica', 'Croatia', 'Cyprus', 
    'Czech Republic', 'Denmark', 'England', 'Estonia', 'Eswatini', 'Fiji', 'Finland', 'France', 'Gambia', 
    'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Guernsey', 'Hong Kong', 'Hungary', 'India', 'Indonesia', 
    'Iran', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Ivory Coast', 'Japan', 'Jersey', 'Kenya', 
    'Kuwait', 'Lesotho', 'Luxembourg', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mexico', 
    'Mongolia', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 
    'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Philippines', 'Portugal', 'Qatar', 
    'Romania', 'Rwanda', 'Samoa', 'Saudi Arabia', 'Scotland', 'Serbia', 'Seychelles', 'Sierra Leone', 
    'Singapore', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Helena', 
    'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Tanzania', 'Thailand', 'Timor-Leste', 'Turkey', 
    'Turks and Caicos Island', 'Uganda', 'United Arab Emirates', 'United States of America', 'Vanuatu', 
    'West Indies', 'Zambia', 'Zimbabwe'
  ],
  ipl: [
    'Chennai Super Kings', 'Deccan Chargers', 'Delhi Capitals', 'Delhi Daredevils', 'Gujarat Lions', 
    'Gujarat Titans', 'Kings XI Punjab', 'Kochi Tuskers Kerala', 'Kolkata Knight Riders', 
    'Lucknow Super Giants', 'Mumbai Indians', 'Pune Warriors', 'Punjab Kings', 'Rajasthan Royals', 
    'Rising Pune Supergiant', 'Rising Pune Supergiants', 'Royal Challengers Bangalore', 
    'Royal Challengers Bengaluru', 'Sunrisers Hyderabad'
  ]
};

export const TEAMS = {
  football: ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'PSG'],
  cricket: [...CRICKET_TEAMS.international, ...CRICKET_TEAMS.ipl].sort(),
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
