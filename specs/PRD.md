# Product Requirements Document (PRD)
## Web App: Bitcoin Strategy Comparison Tool

---

## 1. Overview
The **Bitcoin Strategy Comparison Tool** is a web application designed to help retail investors, traders, and Bitcoin accumulators compare three major periodic investment strategies:
- **Standard Dollar-Cost Averaging (DCA)**
- **Dynamic DCA (RSI-based)**
- **Value Averaging with Limits (VA-Limited)**

The tool provides an interactive, data-driven simulation and visualization environment where users can input parameters (budget, timeframe, indicator thresholds) and evaluate outcomes (BTC accumulated, ROI, drawdowns, etc.). The app aims to simplify complex strategy evaluation and support evidence-based accumulation decisions.

---

## 2. Goals & Objectives
- **Educate users** on different Bitcoin accumulation strategies.
- **Visualize outcomes** under real historical data and user-defined assumptions.
- **Enable parameter tuning** to see how strategies behave under different budgets, durations, and market conditions.
- **Highlight trade-offs** (simplicity vs. complexity, USD vs. BTC focus, drawdown risks, capital call risks).
- **Promote long-term discipline** by demonstrating systematic approaches to Bitcoin accumulation.

---

## 3. Target Audience
- **Retail Bitcoin investors** who want to evaluate smarter alternatives to standard DCA.
- **Crypto traders** who want a data-driven comparison tool.
- **Financial educators** explaining investment strategies in volatile markets.
- **Developers/researchers** seeking to backtest DCA variants.

---

## 4. Features

### 4.1 Core Features
1. **User Input Form**
   - Weekly budget (USD).
   - Investment timeframe (start & end dates).
   - RSI thresholds for Dynamic DCA.
   - VA-Limited constraints (max buy/sell caps).
   - Price dataset (default: BTC historical price 2022–present).

2. **Simulation Engine**
   - Backend runs strategy logic:
     - Standard DCA = fixed buy.
     - Dynamic DCA = variable buy based on RSI thresholds.
     - VA-Limited = buy/sell based on value path with caps.
   - Outputs portfolio growth and key performance metrics.

3. **Metrics Dashboard**
   - Total USD invested.
   - BTC accumulated.
   - Average cost basis.
   - Final portfolio value (USD).
   - ROI (%).
   - Max drawdown.
   - Sharpe ratio.

4. **Visualizations**
   - Portfolio value over time (line chart).
   - BTC accumulated over time (line chart).
   - Weekly investment amounts (bar chart).
   - Cost basis evolution (line chart).
   - Side-by-side comparison table.

### 4.2 Advanced Features
- Export results (CSV, PDF).
- Pre-configured presets (e.g., “\$500/week 2022–2025”).
- Multi-currency support (USD, EUR, etc.).
- Mobile-friendly responsive design.

---

## 5. Technical Requirements

### 5.1 Frontend
- Framework: **React + Tailwind CSS + ShadCN/UI**
- Charts: **Recharts or D3.js**
- Responsive UI for desktop and mobile.

### 5.2 Backend
- Framework: **FastAPI (Python)**
- Historical data source: **Yahoo Finance API / CoinGecko API**
- Strategy simulation logic implemented in Python (backtesting code extended from research).
- Deployment: **Dockerized** for VPS hosting.

### 5.3 Database
- **SQLite or PostgreSQL** for user configs, saved scenarios.
- Optional caching (Redis) for performance if multi-user scaling is required.

---

## 6. User Flow
1. **Landing Page:** Introduction + quick comparison table.
2. **Input Page:** Users enter strategy parameters.
3. **Simulation:** Backend runs strategies and returns results.
4. **Results Dashboard:** Metrics + charts + insights.
5. **Comparison View:** Direct side-by-side breakdown of Standard DCA, Dynamic DCA, VA-Limited.
6. **Export/Share:** Users download or share results.

---

## 7. Non-Functional Requirements
- **Performance:** Simulation for 3–5 years of data should return results in <3 seconds.
- **Scalability:** Handle 500 concurrent users.
- **Reliability:** 99.5% uptime target.
- **Security:** HTTPS, user data encrypted.
- **Privacy:** No personal financial data stored beyond chosen parameters.

---

## 8. Risks & Mitigations
- **Market data reliability:** Use multiple APIs with fallback.
- **User confusion on VA selling BTC:** Include educational tooltips and warnings.
- **Over-complex interface:** Provide presets and simple mode to keep UX beginner-friendly.

---

## 9. Success Metrics
- Number of unique simulations run.
- Average session length (time spent exploring results).
- Ratio of preset vs. custom parameter usage.
- User feedback on clarity of insights.

---

## 10. Roadmap
**Phase 1 (MVP):**
- Implement Standard DCA, Dynamic DCA (RSI), VA-Limited.
- Basic input form and results dashboard.
- Key metrics + charts.
- Hosted on VPS.

**Phase 2:**
- Export results (CSV/PDF).
- Multi-currency support.
- More advanced analytics (Sharpe ratio, drawdown visualization).

**Phase 3:**
- User accounts + scenario saving.
- Social sharing (Twitter, Reddit embeds).
- Expansion to other crypto assets.

---