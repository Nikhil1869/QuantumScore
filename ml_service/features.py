"""Feature extraction for match prediction — 10 features matching training data"""


def generate_features(match):
    """Generate exactly 10 features matching the trained model columns.

    Training data columns (in order):
        team_a_form, team_b_form, team_a_strength, team_b_strength,
        home_advantage, head_to_head_advantage,
        team_a_avg_goals, team_b_avg_goals,
        team_a_avg_conceded, team_b_avg_conceded
    """
    sport = match.get("sport", "football").lower()

    # 1-2: Team form (win rate 0-1)
    team_a_form = float(match.get("teamA_form", 0.5))
    team_b_form = float(match.get("teamB_form", 0.5))

    # 3-4: Team strength (combined attack/defense metric 0-1)
    team_a_strength = float(match.get("teamA_strength", 0.5))
    team_b_strength = float(match.get("teamB_strength", 0.5))

    # 5: Home advantage
    home_advantage = int(match.get("teamA_home", 0))

    # 6: Head-to-head advantage (0-1)
    head_to_head_advantage = float(match.get("head_to_head_advantage", 0.5))

    # 7-8: Average goals/runs/points scored
    if sport == "football":
        team_a_avg_goals = float(match.get("teamA_avg_goals", 1.5))
        team_b_avg_goals = float(match.get("teamB_avg_goals", 1.5))
    elif sport == "cricket":
        team_a_avg_goals = float(match.get("teamA_avg_runs", 155))
        team_b_avg_goals = float(match.get("teamB_avg_runs", 155))
    elif sport == "basketball":
        team_a_avg_goals = float(match.get("teamA_ppg", 110))
        team_b_avg_goals = float(match.get("teamB_ppg", 110))
    else:
        team_a_avg_goals = float(match.get("teamA_avg_goals", 1.5))
        team_b_avg_goals = float(match.get("teamB_avg_goals", 1.5))

    # 9-10: Average goals/runs/points conceded
    if sport == "football":
        team_a_avg_conceded = float(match.get("teamA_avg_conceded", 1.0))
        team_b_avg_conceded = float(match.get("teamB_avg_conceded", 1.0))
    elif sport == "cricket":
        team_a_avg_conceded = float(match.get("teamA_avg_wickets", 7))
        team_b_avg_conceded = float(match.get("teamB_avg_wickets", 7))
    elif sport == "basketball":
        # For basketball, use opponent PPG as "conceded"
        team_a_avg_conceded = float(match.get("teamA_avg_conceded", 110))
        team_b_avg_conceded = float(match.get("teamB_avg_conceded", 110))
    else:
        team_a_avg_conceded = float(match.get("teamA_avg_conceded", 1.0))
        team_b_avg_conceded = float(match.get("teamB_avg_conceded", 1.0))

    return [
        team_a_form,
        team_b_form,
        team_a_strength,
        team_b_strength,
        home_advantage,
        head_to_head_advantage,
        team_a_avg_goals,
        team_b_avg_goals,
        team_a_avg_conceded,
        team_b_avg_conceded,
    ]


# Feature names matching training data columns
FEATURE_NAMES = [
    "team_a_form",
    "team_b_form",
    "team_a_strength",
    "team_b_strength",
    "home_advantage",
    "head_to_head_advantage",
    "team_a_avg_goals",
    "team_b_avg_goals",
    "team_a_avg_conceded",
    "team_b_avg_conceded",
]
