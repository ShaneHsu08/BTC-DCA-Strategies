# Bitcoin Strategy Comparison Tool
[中文版](README_zh.md)

<div align="center"><h1><a href=https://dca.btc.sv>Online Demo</a></h1></div>

A React-based web application for comparing different Bitcoin dollar-cost averaging strategies. Supports simulation and comparison of three strategies: standard DCA, dynamic DCA, and value averaging.

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
