# Changelog

All notable changes to QuantumScore will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-06

### Added
- Multi-sport support: Football, Cricket, Basketball
- React 19 + TypeScript frontend with Vite 8
- Analytics dashboard with Recharts visualizations
- Prediction history table with persistent storage
- Team selection with searchable dropdowns (react-select)
- Framer Motion animations throughout the UI
- Cricsheet data pipeline for real IPL/T20 match training
- `parse_cricsheet.py` for parsing ball-by-ball JSON data
- `train_models.py` for training on real match data
- Model explainability with feature importance scores
- Live, past, and future match data endpoints
- Express.js backend proxy
- Auto-retrain capability via API endpoint
- Comprehensive `.gitignore` for clean repository
- Component-level READMEs (frontend, backend, scraper, ML service)
- `SECURITY.md` security policy
- `CONTRIBUTING.md` contribution guidelines
- `CHANGELOG.md` (this file)
- `.env.example` environment variable template

### Changed
- Upgraded from single-sport to multi-sport architecture
- Migrated frontend from basic setup to Vite + Tailwind CSS
- XGBoost model now supports 10 features (up from basic feature set)
- Project structure reorganized into 4 clear service directories

## [1.0.0] - 2024-01-01

### Added
- Initial single-sport prediction model
- Basic web interface
- XGBoost binary classification
