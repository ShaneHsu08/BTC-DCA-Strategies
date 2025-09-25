# Bitcoin DCA Strategy Comparison Tool
[中文版](README_zh.md)

<div align="center"><h1><a href=https://dca.btc.sv>Online Demo</a></h1></div>

A React-based web application for comparing different Bitcoin dollar-cost averaging strategies. Supports simulation and comparison of three strategies: standard DCA, dynamic DCA, and value averaging.

## About DCA

### Why DCA?
- You believe in the long-term value of BTC, but want to avoid the timing risk of a lump-sum investment by spreading out your entry points and reducing overall risk.
- You believe in the long-term value of BTC, but have limited funds and prefer to build your position gradually.
- Even if you don't fully understand BTC, you want to take advantage of its volatility to accumulate some BTC at relatively lower prices.
...

### Three Strategies
1. Standard DCA: Invest a fixed amount at a fixed interval (e.g., $500 every week).
- Pros: Easiest to execute; most exchanges support it directly; just automate the regular transfer.
- Cons: Same amount regardless of price level, which can lead to a higher average cost in strong uptrends.

2. Dynamic DCA: Add a light timing layer on top of Standard DCA, commonly using RSI. Invest less when most people are buying (RSI high) and more when most people are selling (RSI low).
- Pros: Lowers average entry price; typically results in smaller drawdowns during market dips.
- Cons: Requires calculating how much to invest each time (a small tool or script helps).

3. Value Averaging (VA): Target portfolio value increases by a fixed amount (e.g., +$500 per week). If price drops, buy more to catch up; if price rises, buy less or even sell the “excess.”
- Pros: Functions like a passive buy-low/sell-high mechanism; in prolonged ranges, it can lower the cost basis quickly; simple math.
- Cons: Can demand large capital during sharp selloffs (hard to execute on a budget); during powerful rallies, it can force selling and reduce BTC stack. A practical improvement is to cap the maximum buy/sell per period.

### When to Stop
- Fiat-denominated: For example, stop when total invested capital reaches $100,000.
- BTC-denominated: For example, stop once you accumulate 1 BTC.
- Strategic take-profit: With VA, if a long uptrend drives your cost basis extremely low (even near zero), consider taking profit and starting a new DCA cycle.

The biggest enemy of DCA is not the market, but giving up halfway. The key is to choose a strategy that you feel comfortable with, and stick to it as naturally as eating or sleeping.

## About This Application
- Initial release includes BTC data from 2011-01-03 to 2025-09-15. Please select backtest dates within this range. The next version will support real-time data.
- Transaction fees are not considered for now.
- Results are for reference only.


## Features

### Core Features
- **Standard DCA**: Fixed-amount periodic investment strategy
- **Dynamic DCA**: Intelligent DCA strategy based on RSI indicators
- **Value Averaging**: Value averaging strategy with limitations

### Technical Features
- 📊 Real-time data visualization (portfolio value, BTC accumulation, cost basis, etc.)
- 🌍 Multi-language support (Chinese, English, Japanese)
- 📱 Responsive design, mobile-friendly
- ⚡ Fast development environment based on Vite
- 🎨 Modern UI design (Tailwind CSS + ShadCN/UI)

## Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS + ShadCN/UI
- **Chart Library**: Recharts
- **Internationalization**: Custom i18n solution

## Project Structure

```
BTCStrategies/
├── components/           # React components
│   ├── ui/              # Basic UI components
│   ├── Header.tsx       # Page header
│   ├── InputForm.tsx    # Parameter input form
│   ├── ResultsDashboard.tsx # Results display panel
│   └── ...
├── contexts/            # React contexts
├── data/               # Static data
│   └── btcPriceData.ts # Bitcoin historical price data
├── i18n/               # Internationalization
│   ├── locales/        # Language files
│   └── LanguageProvider.tsx
├── services/           # Business logic
│   └── simulationService.ts # Strategy simulation service
├── types.ts           # TypeScript type definitions
└── utils.ts           # Utility functions
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation and Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   Open browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## User Guide

### 1. Set Parameters
- **Base Weekly Budget**: Set weekly investment amount
- **Time Range**: Select simulation start and end dates
- **Dynamic DCA Parameters**: Configure RSI thresholds and corresponding investment amounts
- **Value Averaging Parameters**: Set target growth and buy/sell limits

### 2. Run Simulation
Click the "Run Simulation" button, and the system will calculate the performance of three strategies based on historical data.

### 3. Analyze Results
- View key metric comparisons (ROI, BTC accumulation, maximum drawdown, etc.)
- Analyze portfolio value trends over time
- Compare capital efficiency of different strategies

## Strategy Descriptions

### Standard DCA
- Invest a fixed amount weekly
- Simple to execute, low psychological pressure
- Suitable for long-term investors

### Dynamic DCA
- Adjust investment amount based on RSI indicators
- RSI < custom threshold: Increase investment (oversold market)
- RSI > custom threshold: Decrease investment (overbought market)
- Balance risk and return

### Value Averaging
- Goal: Portfolio value increases by a fixed amount weekly
- Buy when below target, sell when above target
- Set buy/sell limits to avoid extreme operations


## Data Description

- Built-in Bitcoin historical price data from 2011-2025 (can connect to real APIs when deployed)
- Includes RSI technical indicator calculations

## Development Guide

### Adding New Strategies
1. Define new strategy types in `types.ts`
2. Implement strategy logic in `simulationService.ts`
3. Add parameter inputs in `InputForm.tsx`
4. Display results in `ResultsDashboard.tsx`

### Internationalization
- Add new language files in `i18n/locales/`
- Register new languages in `LanguageProvider.tsx`
- Use `useLanguage` hook to get translated text

## Deployment

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## Contributing

Welcome to submit Issues and Pull Requests to improve this project.

## Disclaimer

This tool is for educational and research purposes only and does not constitute investment advice. Investment involves risks, please make decisions carefully.

## License

MIT License
