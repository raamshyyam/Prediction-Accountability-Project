# 🎯 Prediction Accountability Platform (PAP)

> *Hold claims accountable. Track predictions. Expose bias. Empower informed decisions.*

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue)](https://www.typescriptlang.org/)
[![React + Vite](https://img.shields.io/badge/React%20%2B%20Vite-27282D?logo=react)](https://vitejs.dev/)
[![Powered by Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4)](https://ai.google.dev/)

**[📖 Read the Vision](#-why-prediction-accountability-matters) • [🚀 Get Started](#-quick-start) • [✨ Features](#-core-features) • [🔗 Live Demo](#) • [📋 Roadmap](#-roadmap)**

</div>

<div align="center">
<img width="800" alt="PAP Dashboard" src="https://via.placeholder.com/800x400?text=Prediction+Accountability+Platform" />
</div>

---

## 🌍 Why Prediction Accountability Matters

In today's post-truth era, the internet is flooded with predictions from "experts"—**analysts, astrologers, politicians, economist, influencers**—yet **no one is held accountable**. When predictions fail, they're forgotten. When they're vague, no one notices. When biases skew forecasts, no one tracks them.

### The Problem
- 📺 Predictions on TV, social media, and podcasts influence public opinion, investments, and votes
- 🔍 **Zero follow-up**: Claims rarely get verified against real-world outcomes
- 🎭 **Hidden bias**: Claimants maintain credibility despite poor track records
- 🌀 **Misinformation thrives**: In emerging markets like Nepal, vague or false predictions spread unchecked
- 📊 **No accountability**: Scattered claims across platforms make it impossible to aggregate and analyze

### Our Solution: PAP

**Prediction Accountability Platform** is a **web-based system** that systematically collects, tracks, verifies, and analyzes public claims and predictions about future events. We transform scattered opinions into a **searchable, data-driven database** with:

✅ **Unbiased verification** based on facts, not opinions  
✅ **Claimant profiling** showing historical accuracy and bias patterns  
✅ **Vagueness scoring** to identify unverifiable claims  
✅ **Long-term tracking** with timeline monitoring and automated updates  
✅ **Crowdsourced verification** for transparency and scale  
✅ **AI-powered analysis** for pattern detection and claim parsing  

---

## 🎯 Use Cases

### 👥 **Users & Citizens**
Search a claimant's history before trusting their advice
- *"Has this economist been accurate on inflation predictions?"*
- *"What's the track record of this political analyst?"*
- *"Has this astrologer's predictions been reliable?"*

### 📰 **Journalists & Researchers**
Analyze trends and biases across claims
- *How often do financial gurus predict market movements correctly?*
- *Which political analysts have the best accuracy rate?*
- Find patterns: "Economic claims from party X are 60% accurate; party Y is 35%"

### 🎓 **Educators & Students**
Teach critical thinking and media literacy
- Lesson: "Analyze 5 political predictions; rate their specificity and verify them"
- Build understanding of: bias, vagueness, confirmation bias, and accountability

### 🏢 **Claimants & Experts**
Build credibility by submitting and verifying their own predictions
- Self-service verification: "I predicted this; here's the evidence it was correct"
- Public profiles showing track records

### 🇳🇵 **Nepal-Focused Impact**
Initial focus on **Nepal-specific topics**:
- 🗳️ **Politics**: Election predictions, policy outcomes, government accountability
- 📊 **Economy**: GDP forecasts, inflation, investment trends
- ⚡ **Hydropower**: Infrastructure project timelines and completion
- 🏔️ **Tourism**: Recovery predictions post-COVID
- ✨ **Astrology**: Personal and political forecasts (with cultural relevance)

---

## ✨ Core Features

### 📝 **1. Claim Recording**
- Users can record claims from anywhere: social media, news, podcasts, personal submissions
- **Structure**: Claim text, date made, target/prediction date, category, confidence level, sources
- **Vagueness Index**: Automatically scored 1-10 based on specificity (numbers, dates, named actors, measurable outcomes)

### 👤 **2. Claimant Profiles**
- **Key Metrics**: 
  - Total claims made
  - Accuracy rate (% of predictions that came true)
  - Vagueness score (average specificity)
  - Affiliation & bio
  - Historical trends (improving/declining accuracy?)
- **Analytics**: Bias detection (e.g., always optimistic on economy?)
- **Public profiles** searchable and shareable

### ✔️ **3. Verification & Tracking**
- **Status Categories**: 
  - ✅ **Fulfilled** (proven true)
  - ❌ **Disproven** (proven false)
  - 🟡 **Partial** (e.g., 50% accurate)
  - ⏳ **Ongoing** (awaiting resolution)
  - ❓ **Inconclusive** (ambiguous or context changed)
- **Automated Updates**: AI monitors news/events for claim resolution
- **Human-AI Hybrid**: AI suggests verdicts; community/moderators confirm
- **Evidence Links**: Facts, data sources, fact-checks

### 🔍 **4. Smart Search & Grouping**
- Search by:
  - 🔎 Claimant name or affiliation
  - 📂 Category (politics, economy, astrology, etc.)
  - 📅 Date range or specific prediction period
  - 🏷️ Topic/theme (e.g., "Nepal Tourism," "Election 2027")
- **ML-Powered Clustering**: Automatically groups similar claims using NLP
  - Insights: "Average accuracy for economic claims: 45%" or "All-tourism-boost predictions: 20% came true"

### 📊 **5. Dashboards & Analytics**
- **Timeline Views**: See claim lifecycle from announcement to resolution
- **Visual Reports**: 
  - Pie charts of Fulfilled vs. Disproven claims
  - Trend lines showing claimant accuracy over time
  - Comparison: Claimant vs. category average
- **Export Data**: Download reports as CSV/JSON for research

### 🤖 **6. AI-Powered Insights**
- **Automatic Parsing**: Extract dates, metrics, and outcomes from claim text
- **Vagueness Analysis**: NLP-based scoring for claim specificity
- **Bias Detection**: Identify patterns (e.g., "Economist X is overly optimistic by 15%")
- **News Monitoring**: Auto-scan for events that resolve predictions
- **Fallback Heuristics**: Works with or without API key (local analysis available)

### 📱 **7. Multi-Language Support**
- **English & Nepali**: Interface and claims in both languages
- **Translation features** for global expansion

---

## 🛠️ Technical Stack

### **Frontend**
- **React 18** + **TypeScript** for type-safe UI components
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive design
- **Recharts** for data visualization (charts, graphs)

### **Backend & Services**
- **Node.js/Vite** local backend for API routes
- **Firebase** for authentication, real-time database (optional)
- **Google Gemini AI** for NLP-powered analysis and insights
- **PDF.js** for manifesto/document text extraction

### **Storage**
- **Local Storage/IndexedDB** for client-side persistence (MVP)
- **Firebase Realtime DB** or **PostgreSQL** for production scaling
- **Vercel KV** for caching and session management

### **AI & NLP**
- **Google Gemini 2.0 Flash** for:
  - Claim parsing and vagueness scoring
  - Verification vector analysis
  - Manifesto claim extraction
  - Claimant background research
- **Fallback heuristics** for offline/no-API scenarios

### **Deployment**
- **Vercel** (easiest for Next.js/Node.js)
- **GitHub Pages** (static export option)
- **Docker** for self-hosted instances

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Gemini API Key** (free from [ai.google.dev](https://ai.google.dev)) — optional but recommended

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/prediction-accountability-platform.git
   cd prediction-accountability-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Gemini API key:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```
   *Note: The app works without an API key, but AI features will be limited.*

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm run preview  # Test the build locally
   ```

### 🐳 Docker Deployment (Optional)
```bash
docker build -t pap .
docker run -p 3000:3000 pap
```

---

## 📋 Detailed Features

### Claims Management
- ✏️ Add, edit, and delete claims
- 🏷️ Categorize by type (Politics, Economy, Astrology, Hydropower, Tourism, Manifesto)
- 📎 Attach sources and evidence
- 🔗 Link to related claims (threads)
- 📜 View claim history and status changes

### Claimant Database
- 👥 Create and manage claimant profiles
- 📊 View accuracy metrics and trends
- 🔗 See all claims by a specific person
- 📈 Analyze bias and pattern

### Manifesto Tracker
- 📄 Upload political party manifestos (PDF or text)
- 🤖 Automatic extraction of key promises
- ✅ Track fulfillment status and progress
- 📊 Compare promises across parties
- 🔍 Search for specific pledges

### Verification System
- Manual verification by community moderators
- AI-assisted suggestion of verdict
- Evidence-based reasoning
- Historical changelog of decisions
- Confidence scoring

---

## 🔓 Data Privacy & Open Source

- **Privacy First**: All user data stays in your browser (local storage) or your own database
- **No Tracking**: This is not Google Analytics—we don't track users
- **Open Source**: MIT License—fork, modify, and deploy freely
- **Crowdsourced Verification**: Community-driven fact-checking, not censorship

---

## 📊 Comparison with Similar Platforms

| Feature | PAP | Metaculus | Good Judgment | TipRanks | Politifact |
|---------|-----|-----------|----------------|----------|-----------|
| **Public Claims** | ✅ Tracks expert claims | ❌ User-generated | ❌ User-generated | ✅ Analyst tracking | ✅ Fact-checks |
| **Claimant Profiles** | ✅ Detailed | ❌ Minimal | ❌ Minimal | ✅ Yes | ❌ Limited |
| **Automated Verification** | ✅ AI-powered | ❌ Manual | ❌ Manual | ✅ Partial | ❌ Manual |
| **Nepal/Localized** | ✅ Yes | ❌ Global | ❌ Global | ❌ Global | ❌ Global |
| **Astrology Support** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **Open Source** | ✅ MIT | ❌ Closed | ❌ Closed | ❌ Closed | ❌ Closed |
| **Offline Mode** | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |

**PAP is unique** in combining expert accountability, Nepal focus, astrology tracking, and open-source accessibility.

---

## 🎨 UI/UX Highlights

- **Modern Dashboard**: Real-time overview of claims, verification status, and claimant metrics
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Option for reduced eye strain
- **Accessibility**: WCAG 2.1 compliant for screen readers and keyboard navigation
- **Bilingual Interface**: Full support for English and Nepali

---

## 🤝 Contributing

We welcome contributions from developers, researchers, designers, and domain experts!

### How to Contribute
1. **Fork** the repository
2. **Create a branch** (`git checkout -b feature/your-feature`)
3. **Commit changes** (`git commit -m 'Add feature'`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open a Pull Request** with a clear description

### Contribution Areas
- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **Features**: Add new functionality (see Roadmap)
- 📖 **Documentation**: Improve README, guides, and comments
- 🎨 **Design**: Improve UI/UX
- 🧪 **Testing**: Write and improve tests
- 🌍 **Localization**: Add support for more languages

### Development Guidelines
- Code style: Use Prettier and ESLint configs provided
- Testing: Write tests for new features (`npm run test`)
- Commits: Use clear, descriptive messages
- PRs: Reference issues and provide context

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 🗺️ Roadmap

### **Phase 1: MVP (Current)**
- ✅ Core claim recording and tracking
- ✅ Basic claimant profiles
- ✅ Manual verification system
- ✅ Local storage persistence
- ✅ Nepal-focused categories

### **Phase 2: AI & Automation (Q2 2026)**
- 🚀 Automated claim parsing with Gemini AI
- 🤖 Vagueness index calculation
- 📊 Smart clustering of similar claims
- 📰 Auto news monitoring for resolution
- 🔍 Bias detection and pattern analysis

### **Phase 3: Scaling & Community (Q3 2026)**
- 👥 User authentication and profiles
- 💬 Community forums and debates
- 🏆 Leaderboards for most accurate claimants
- 📱 Mobile app (React Native)
- 🌐 Global expansion (other countries/languages)

### **Phase 4: Advanced Features (Q4 2026+)**
- 📈 Prediction markets integration
- 🔗 API for third-party integrations
- 📊 Advanced analytics and ML models
- 🎤 Podcast/video transcript auto-extraction
- 🤝 Integration with fact-checking orgs (Snopes, PolitiFact)

---

## 📚 Resources & Documentation

- **[ABOUT.md](./ABOUT.md)**: Deep dive into the vision and impact
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Developer guide and contribution workflow
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**: Detailed setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical architecture and design decisions
- **[API_DOCS.md](./API_DOCS.md)**: API reference for backend endpoints

---

## 🔗 Related Projects

Inspired by and complementary to:
- **[Metaculus](https://www.metaculus.com/)** — Community forecasting platform
- **[Good Judgment Open](https://www.gjopen.com/)** — Expert predictions
- **[Manifold Markets](https://manifold.markets/)** — Prediction markets
- **[TipRanks](https://www.tipranks.com/)** — Analyst performance tracking
- **[SocialPredict](https://github.com/openpredictionmarkets/socialpredict)** — Open-source prediction engine

---

## 📞 Support & Feedback

- 🐛 **Found a bug?** Open an [issue](https://github.com/yourusername/pap/issues)
- 💡 **Have an idea?** Start a [discussion](https://github.com/yourusername/pap/discussions)
- 📧 **Email**: contact@predictionaccountability.org
- 🐦 **Twitter**: [@PAPofficial](https://twitter.com)

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

You're free to:
- ✅ Use for personal or commercial projects
- ✅ Modify and redistribute
- ✅ Include in proprietary software

Just credit the original authors.

---

## 🙏 Acknowledgments

- **Grok AI** for helping refine the initial concept
- **Google Gemini** for powering AI features
- **React & Vite** communities for excellent tools
- **Nepal's open-source community** for inspiration and support
- **All contributors** (you!) making this better

---

## 🌟 Give Us a Star

If you find PAP useful, please star this repository! It helps others discover the project and motivates the team.

⭐ **[Star this repo!](https://github.com/yourusername/pap/stargazers)**

---

<div align="center">

**Built with ❤️ to promote accountability and transparency in public discourse.**

*Let's hold predictions accountable.*

</div>
