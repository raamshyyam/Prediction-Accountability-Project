# Changelog

All notable changes to the Prediction Accountability Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Bug fixes for claim details view crash
- Improved vagueness score calculation with heuristic analysis
- Login modal now requires user interaction (no auto-auth)
- Better manifesto claim extraction with keyword matching
- AI insights fallback to local algorithms when API unavailable

### Fixed
- ClaimDetailView no longer crashes (missing imports resolved)
- Verification vectors now display correctly
- Vagueness scores calculated intelligently (no more default 5/10)
- Login modal no longer auto-authenticates on load
- Manifesto tracker shows extracted claims more reliably

### Improved
- UI/UX improvements to dashboard
- Better error messages and user feedback
- More robust AI feature fallbacks

---

## [1.0.0] - 2026-02-09

### Added
- **Core Features**
  - 📝 Record and track public claims and predictions
  - 👤 Create detailed claimant profiles with accuracy metrics
  - ✔️ Verify claims with evidence-based verification status
  - 📊 Dashboard with analytics and visualizations
  - 🔍 Smart search and filtering by category, date, claimant
  - 📜 Manifesto Tracker for political promises
  - 🌍 Multi-language support (English & Nepali)
  - 🤖 AI-powered insights (Gemini API integration)

- **Claim Management**
  - Add, edit, delete claims
  - Categorize claims (Politics, Economy, Astrology, Hydropower, Tourism, Manifesto)
  - Attach sources and evidence
  - Track vagueness (1-10 scale)
  - Set target dates for claims
  - View claim history and status changes

- **Claimant Profiles**
  - Track claimant accuracy rate
  - Historical performance metrics
  - Affiliation and bio information
  - Avatar/profile photos
  - Tags and categorization

- **Verification System**
  - Mark claims as Fulfilled, Disproven, Partial, Ongoing, or Inconclusive
  - Add evidence links from fact-checkers or data sources
  - Track verification confidence levels
  - Maintain changelog of verdict changes

- **Analytics & Dashboards**
  - Claims by category (bar chart)
  - Verification status distribution (pie chart)
  - Claimant comparison
  - Trend analysis
  - Data export (JSON/CSV)

- **Backend & Storage**
  - Local Storage persistence (development)
  - Firebase integration (optional for production)
  - RESTful API endpoints
  - PDF text extraction for manifestos
  - Responsive design for desktop and mobile

### Technical Stack
- React 18 + TypeScript
- Vite build system
- Tailwind CSS styling
- Recharts for data visualization
- PDF.js for document processing
- Google Gemini AI API
- Firebase (optional)
- Vercel deployment ready

### Documentation
- Comprehensive README.md
- ABOUT.md with vision and impact story
- CONTRIBUTING.md for developers
- SETUP_GUIDE.md for installation
- CODE_OF_CONDUCT.md for community standards
- MIT License for open-source distribution

### Known Limitations
- ⚠️ Local Storage only (no cloud sync in MVP)
- ⚠️ Limited AI features without Gemini API key
- ⚠️ Manual verification (no automated news monitoring)
- ⚠️ No mobile app (web app only)
- ⚠️ Single-user (no authentication system yet)

---

## Future Releases

### [Planned: v1.1.0] - Q1 2026
- User authentication and profiles
- Cloud sync with Firebase
- Advanced search filters
- Community moderation system
- Mobile-responsive improvements

### [Planned: v1.2.0] - Q2 2026
- Automated news monitoring for claim resolution
- Predictive models for accuracy forecasting
- API for third-party integrations
- Advanced analytics and ML-based bias detection
- Mobile app (iOS/Android with React Native)

### [Planned: v1.3.0] - Q3 2026
- Global expansion (more languages, countries)
- Partnership integrations (Metaculus, prediction markets)
- Leaderboards and gamification
- Community forums and debates
- Podcast/video transcript extraction

### [Planned: v2.0.0] - 2027+
- Full mobile applications
- International expansion
- Prediction market integration
- Advanced ML models
- Organization/enterprise features

---

## How to Report Changes

### For Users

See a bug or want to suggest a feature? 

- 🐛 [Report a bug](https://github.com/yourrepo/pap/issues/new?template=bug_report.md)
- ✨ [Suggest a feature](https://github.com/yourrepo/pap/issues/new?template=feature_request.md)
- 💬 [Start a discussion](https://github.com/yourrepo/pap/discussions)

### For Developers

Contributing code? Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- How to set up development environment
- Coding standards
- Testing requirements
- Commit and PR guidelines

---

## Acknowledgements

- **[Keep a Changelog](https://keepachangelog.com/)** for changelog format inspiration
- **[Semantic Versioning](https://semver.org/)** for version numbering
- **[All Contributors](./CONTRIBUTORS.md)** who have helped improve PAP

---

**Last Updated**: 2026-02-09  
**Maintained by**: PAP Contributors  
**Next Review**: 2026-03-01

