"""Generate realistic training data with rich features for sports prediction"""
import pandas as pd
import numpy as np
import os


def generate_training_data(n_samples=2000):
    """Generate realistic training data with 10 match features across 3 sports"""
    np.random.seed(42)

    sports = ["cricket", "football", "basketball"]

    # Real team profiles with base stats per sport
    team_profiles = {
        "football": [
            ("Manchester United", 0.72, 1.8, 0.9),
            ("Liverpool", 0.78, 2.1, 0.8),
            ("Barcelona", 0.80, 2.3, 0.7),
            ("Real Madrid", 0.76, 2.0, 0.9),
            ("Bayern Munich", 0.82, 2.4, 0.6),
            ("Borussia Dortmund", 0.68, 1.6, 1.1),
            ("Arsenal", 0.74, 1.9, 0.8),
            ("Chelsea", 0.70, 1.7, 1.0),
            ("Paris Saint-Germain", 0.79, 2.2, 0.7),
            ("Manchester City", 0.84, 2.5, 0.5),
            ("Juventus", 0.73, 1.6, 0.7),
            ("AC Milan", 0.69, 1.5, 0.9),
            ("Tottenham", 0.65, 1.5, 1.2),
            ("Newcastle", 0.67, 1.4, 1.0),
            ("Atletico Madrid", 0.71, 1.3, 0.6),
        ],
        "cricket": [
            ("India", 0.75, 170, 6.2),
            ("Australia", 0.72, 165, 6.5),
            ("England", 0.68, 162, 7.0),
            ("Pakistan", 0.65, 155, 6.8),
            ("South Africa", 0.70, 160, 6.6),
            ("New Zealand", 0.66, 158, 6.9),
            ("West Indies", 0.58, 152, 7.2),
            ("Sri Lanka", 0.60, 150, 7.1),
            ("Bangladesh", 0.55, 148, 7.5),
            ("Afghanistan", 0.52, 145, 7.8),
        ],
        "basketball": [
            ("Los Angeles Lakers", 0.62, 115.2, 110.5),
            ("Boston Celtics", 0.68, 118.5, 108.2),
            ("Golden State Warriors", 0.70, 120.1, 109.8),
            ("Brooklyn Nets", 0.48, 112.3, 114.5),
            ("Denver Nuggets", 0.72, 116.8, 107.3),
            ("Phoenix Suns", 0.65, 114.5, 111.2),
            ("Miami Heat", 0.60, 111.8, 109.5),
            ("Milwaukee Bucks", 0.71, 119.2, 108.8),
            ("Dallas Mavericks", 0.63, 117.5, 112.0),
            ("Los Angeles Clippers", 0.61, 115.8, 110.8),
        ],
    }

    data = []
    for _ in range(n_samples):
        sport = np.random.choice(sports)
        profiles = team_profiles[sport]

        # Pick two different teams
        idx_a, idx_b = np.random.choice(len(profiles), 2, replace=False)
        team_a = profiles[idx_a]
        team_b = profiles[idx_b]

        # Add noise to base stats for variability
        noise = lambda v, pct=0.15: v * (1 + np.random.normal(0, pct))

        team_a_form = np.clip(noise(team_a[1], 0.12), 0.1, 0.99)
        team_b_form = np.clip(noise(team_b[1], 0.12), 0.1, 0.99)

        # Strength is derived from scoring and defense
        if sport == "football":
            team_a_avg_goals = np.clip(noise(team_a[2], 0.2), 0.3, 4.0)
            team_b_avg_goals = np.clip(noise(team_b[2], 0.2), 0.3, 4.0)
            team_a_avg_conceded = np.clip(noise(team_a[3], 0.2), 0.2, 3.0)
            team_b_avg_conceded = np.clip(noise(team_b[3], 0.2), 0.2, 3.0)
        elif sport == "cricket":
            team_a_avg_goals = np.clip(noise(team_a[2], 0.1), 100, 220)
            team_b_avg_goals = np.clip(noise(team_b[2], 0.1), 100, 220)
            team_a_avg_conceded = np.clip(noise(team_a[3], 0.1), 4, 10)
            team_b_avg_conceded = np.clip(noise(team_b[3], 0.1), 4, 10)
        else:  # basketball
            team_a_avg_goals = np.clip(noise(team_a[2], 0.08), 95, 135)
            team_b_avg_goals = np.clip(noise(team_b[2], 0.08), 95, 135)
            team_a_avg_conceded = np.clip(noise(team_a[3], 0.08), 95, 130)
            team_b_avg_conceded = np.clip(noise(team_b[3], 0.08), 95, 130)

        # Compute strength (normalized attack - defense balance)
        if sport == "football":
            a_atk = min(team_a_avg_goals / 3.0, 1.0)
            a_def = 1.0 - min(team_a_avg_conceded / 2.5, 1.0)
            b_atk = min(team_b_avg_goals / 3.0, 1.0)
            b_def = 1.0 - min(team_b_avg_conceded / 2.5, 1.0)
        elif sport == "cricket":
            a_atk = min(team_a_avg_goals / 200.0, 1.0)
            a_def = 1.0 - min(team_a_avg_conceded / 10.0, 1.0)
            b_atk = min(team_b_avg_goals / 200.0, 1.0)
            b_def = 1.0 - min(team_b_avg_conceded / 10.0, 1.0)
        else:
            a_atk = min(team_a_avg_goals / 130.0, 1.0)
            a_def = 1.0 - min(team_a_avg_conceded / 125.0, 1.0)
            b_atk = min(team_b_avg_goals / 130.0, 1.0)
            b_def = 1.0 - min(team_b_avg_conceded / 125.0, 1.0)

        team_a_strength = np.clip(a_atk * 0.6 + a_def * 0.4, 0.0, 1.0)
        team_b_strength = np.clip(b_atk * 0.6 + b_def * 0.4, 0.0, 1.0)

        home_advantage = np.random.choice([0, 1])

        # Head-to-head advantage (simulated historical bias)
        base_h2h = 0.5 + (team_a[1] - team_b[1]) * 0.3
        head_to_head_advantage = np.clip(noise(base_h2h, 0.15), 0.1, 0.9)

        # Winner probability model
        prob_a_wins = (
            0.25 * team_a_form / (team_a_form + team_b_form + 1e-8)
            + 0.20 * team_a_strength / (team_a_strength + team_b_strength + 1e-8)
            + 0.15 * head_to_head_advantage
            + 0.10 * home_advantage
            + 0.15 * (1.0 if team_a_avg_goals > team_b_avg_goals else 0.4)
            + 0.15 * (1.0 if team_a_avg_conceded < team_b_avg_conceded else 0.4)
        )
        prob_a_wins = np.clip(prob_a_wins, 0.05, 0.95)
        winner = 1 if np.random.random() < prob_a_wins else 0

        data.append(
            {
                "sport": sport,
                "team_a_form": round(team_a_form, 4),
                "team_b_form": round(team_b_form, 4),
                "team_a_strength": round(team_a_strength, 4),
                "team_b_strength": round(team_b_strength, 4),
                "home_advantage": home_advantage,
                "head_to_head_advantage": round(head_to_head_advantage, 4),
                "team_a_avg_goals": round(team_a_avg_goals, 2),
                "team_b_avg_goals": round(team_b_avg_goals, 2),
                "team_a_avg_conceded": round(team_a_avg_conceded, 2),
                "team_b_avg_conceded": round(team_b_avg_conceded, 2),
                "winner": winner,
            }
        )

    df = pd.DataFrame(data)

    output_path = os.path.join(os.path.dirname(__file__), "..", "training_data.csv")
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} training samples saved to {output_path}")
    print(f"Winner distribution: {df['winner'].value_counts().to_dict()}")
    print(f"Sports distribution: {df['sport'].value_counts().to_dict()}")

    return df


if __name__ == "__main__":
    generate_training_data(2000)
