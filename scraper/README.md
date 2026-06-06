# QuantumScore Scraper

Data fetching and training data generation module.

## Files

| File | Purpose |
|------|---------|
| `real_data_fetcher.py` | Fetches live, past, and upcoming match data from external sports APIs |
| `generate_training_data.py` | Generates synthetic training data for model training (2,000 samples) |

## Usage

### Fetch Real Match Data

```python
from scraper.real_data_fetcher import RealDataFetcher

fetcher = RealDataFetcher()

# Fetch live matches
live = fetcher.get_live_matches(sport="football")

# Fetch past matches
past = fetcher.get_past_matches(sport="cricket")

# Fetch upcoming matches
future = fetcher.get_future_matches(sport="basketball")
```

### Generate Synthetic Training Data

```bash
# From the project root
python -m scraper.generate_training_data
```

This creates `training_data.csv` at the project root with 2,000 synthetic match records across Football, Cricket, and Basketball.

## Data Sources

- Live/past/future match data is fetched from public sports APIs
- Synthetic data uses realistic probability distributions for team form, strength, and head-to-head records
