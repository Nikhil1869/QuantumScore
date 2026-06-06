import json
import glob
import pandas as pd
import os
from collections import defaultdict
import datetime

raw_dir = 'data/raw'
files = glob.glob(os.path.join(raw_dir, '*.json'))

def get_match_date(data):
    dates = data.get('info', {}).get('dates', [])
    if dates:
        try:
            return datetime.datetime.strptime(dates[0], '%Y-%m-%d')
        except ValueError:
            pass
    return datetime.datetime.min

def get_pitch_type(venue, city):
    loc = str(venue).lower() + " " + str(city).lower()
    spin_keywords = ['india', 'sri lanka', 'bangladesh', 'pakistan', 'uae', 'emirates', 'dubai', 'sharjah', 'dhaka', 'colombo', 'chennai', 'mumbai', 'kolkata', 'mirpur']
    for k in spin_keywords:
        if k in loc:
            return "spin"
    return "pace"

elo_ratings = defaultdict(lambda: 1500)
def expected_score(elo_a, elo_b):
    return 1 / (1 + 10 ** ((elo_b - elo_a) / 400))

def update_elo(elo_a, elo_b, actual_score_a, k=32):
    exp_a = expected_score(elo_a, elo_b)
    return elo_a + k * (actual_score_a - exp_a)

h2h_records = defaultdict(lambda: 0) # e.g. "India-Australia": 15 (India wins against Aus)
recent_form = defaultdict(list)

def get_form_score(team):
    form = recent_form[team]
    if not form: return 0.5
    return sum(form) / len(form)

def get_h2h_win_rate(teamA, teamB):
    key_A = f"{teamA}-{teamB}"
    key_B = f"{teamB}-{teamA}"
    wins_A = h2h_records[key_A]
    wins_B = h2h_records[key_B]
    total = wins_A + wins_B
    if total == 0: return 0.5
    return wins_A / total

print("Loading and sorting files by date...")
match_headers = []
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        data = json.load(file)
        match_headers.append((get_match_date(data), f, data))

match_headers.sort(key=lambda x: x[0])

innings1_data = []
innings2_data = []

print("Parsing matches chronologically...")
for date, f, data in match_headers:
    info = data.get('info', {})
    teams = info.get('teams', [])
    venue = info.get('venue', 'Unknown')
    city = info.get('city', 'Unknown')
    
    if len(teams) < 2:
        continue

    outcome = info.get('outcome', {})
    winner = outcome.get('winner', None)
    if not winner:
        continue

    pitch_type = get_pitch_type(venue, city)
    team1 = teams[0]
    team2 = teams[1]

    # Parse ball by ball to extract features
    innings = data.get('innings', [])
    if len(innings) < 1: continue

    # INNINGS 1
    inn1 = innings[0]
    bat1 = inn1.get('team')
    bowl1 = team2 if team1 == bat1 else team1
    overs1 = inn1.get('overs', [])
    
    curr_score1 = 0
    wickets1 = 0
    balls1 = 0
    dots1 = 0
    bounds1 = 0
    recent_runs1 = [] # queue of runs off last 18 balls for momentum
    
    over_states1 = []
    
    for over in overs1:
        over_num = over.get('over', 0)
        for d in over.get('deliveries', []):
            runs = d.get('runs', {}).get('total', 0)
            bat_runs = d.get('runs', {}).get('batsman', 0)
            curr_score1 += runs
            balls1 += 1
            if bat_runs == 0 and runs == 0: dots1 += 1
            if bat_runs >= 4: bounds1 += 1
            
            recent_runs1.append(runs)
            if len(recent_runs1) > 18: recent_runs1.pop(0)
                
            if 'wickets' in d: wickets1 += len(d['wickets'])
            
        phase = "Powerplay" if over_num < 6 else "Middle" if over_num < 15 else "Death"
        crr = (curr_score1 / max(1, balls1)) * 6
        momentum = sum(recent_runs1)
        dot_pct = dots1 / max(1, balls1)
        bound_pct = bounds1 / max(1, balls1)
        
        over_states1.append({
            'venue': venue,
            'pitch_type': pitch_type,
            'batting_team': bat1,
            'bowling_team': bowl1,
            'overs_completed': over_num + 1,
            'current_score': curr_score1,
            'wickets_lost': wickets1,
            'crr': crr,
            'phase': phase,
            'momentum': momentum,
            'dot_pct': dot_pct,
            'bound_pct': bound_pct,
            'elo_diff': elo_ratings[bat1] - elo_ratings[bowl1],
            'form_bat': get_form_score(bat1),
            'form_bowl': get_form_score(bowl1),
            'h2h_win_rate': get_h2h_win_rate(bat1, bowl1)
        })
        
    final_score1 = curr_score1
    for state in over_states1:
        state['final_score'] = final_score1
        innings1_data.append(state)

    # INNINGS 2
    win_a = 1 if winner == team1 else 0
    win_b = 1 if winner == team2 else 0

    if len(innings) >= 2:
        inn2 = innings[1]
        bat2 = inn2.get('team')
        bowl2 = team2 if team1 == bat2 else team1
        target = final_score1 + 1
        overs2 = inn2.get('overs', [])
        
        curr_score2 = 0
        wickets2 = 0
        balls2 = 0
        dots2 = 0
        bounds2 = 0
        recent_runs2 = []
        is_win = 1 if winner == bat2 else 0

        over_states2 = []
        
        for over in overs2:
            over_num = over.get('over', 0)
            for d in over.get('deliveries', []):
                runs = d.get('runs', {}).get('total', 0)
                bat_runs = d.get('runs', {}).get('batsman', 0)
                curr_score2 += runs
                balls2 += 1
                if bat_runs == 0 and runs == 0: dots2 += 1
                if bat_runs >= 4: bounds2 += 1
                
                recent_runs2.append(runs)
                if len(recent_runs2) > 18: recent_runs2.pop(0)
                
                if 'wickets' in d: wickets2 += len(d['wickets'])
                
            phase = "Powerplay" if over_num < 6 else "Middle" if over_num < 15 else "Death"
            balls_rem = 120 - balls2
            runs_req = target - curr_score2
            crr = (curr_score2 / max(1, balls2)) * 6
            rrr = (runs_req / max(1, balls_rem)) * 6 if balls_rem > 0 else 99.0
            
            pressure_idx = (rrr - crr) + (wickets2 * 1.5)
            
            momentum = sum(recent_runs2)
            dot_pct = dots2 / max(1, balls2)
            bound_pct = bounds2 / max(1, balls2)
            
            over_states2.append({
                'venue': venue,
                'pitch_type': pitch_type,
                'batting_team': bat2,
                'bowling_team': bowl2,
                'target_score': target,
                'overs_completed': over_num + 1,
                'current_score': curr_score2,
                'wickets_lost': wickets2,
                'runs_required': runs_req,
                'balls_remaining': balls_rem,
                'crr': crr,
                'rrr': rrr,
                'pressure_index': pressure_idx,
                'phase': phase,
                'momentum': momentum,
                'dot_pct': dot_pct,
                'bound_pct': bound_pct,
                'elo_diff': elo_ratings[bat2] - elo_ratings[bowl2],
                'form_bat': get_form_score(bat2),
                'form_bowl': get_form_score(bowl2),
                'h2h_win_rate': get_h2h_win_rate(bat2, bowl2),
                'is_win': is_win
            })
            
        for state in over_states2:
            innings2_data.append(state)

    # Post Match Updates
    elo_ratings[team1] = update_elo(elo_ratings[team1], elo_ratings[team2], win_a)
    elo_ratings[team2] = update_elo(elo_ratings[team2], elo_ratings[team1], win_b)
    
    recent_form[team1].append(win_a)
    recent_form[team2].append(win_b)
    if len(recent_form[team1]) > 5: recent_form[team1].pop(0)
    if len(recent_form[team2]) > 5: recent_form[team2].pop(0)

    # Update H2H
    if win_a:
        h2h_records[f"{team1}-{team2}"] += 1
    elif win_b:
        h2h_records[f"{team2}-{team1}"] += 1

print(f"Finished parsing. Gen 1st inn: {len(innings1_data)} rows. Gen 2nd inn: {len(innings2_data)} rows.")
df1 = pd.DataFrame(innings1_data)
df2 = pd.DataFrame(innings2_data)

os.makedirs('data/processed', exist_ok=True)
df1.to_csv('data/processed/dataset_1st_innings.csv', index=False)
df2.to_csv('data/processed/dataset_2nd_innings.csv', index=False)

# Save tracking metadata for live inference
with open('data/processed/elo_ratings.json', 'w') as f:
    json.dump(dict(elo_ratings), f)
with open('data/processed/h2h_records.json', 'w') as f:
    json.dump(dict(h2h_records), f)
with open('data/processed/recent_form.json', 'w') as f:
    json.dump(dict(recent_form), f)
