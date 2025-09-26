# Bitcoin DCA Strategy Comparison Tool
[中文版](README_zh.md)

<div align="center"><h1><a href=https://dca.btc.sv>Online Demo</a></h1></div>

A React-based web application for comparing different Bitcoin dollar-cost averaging strategies. Supports simulation and comparison of three strategies: standard DCA, dynamic DCA, and value averaging.

## About DCA

### Why DCA?
- Optimistic about the long-term value of BTC, but want to avoid the timing risk of a lump-sum investment, so spread out the buying times to reduce overall risk.
- Optimistic about the long-term value of BTC, but want to build a position gradually due to limited funds.
- Although unable to predict BTC's short-term trends, believe it has long-term holding value, and hope to use DCA to spread out volatility risk and accumulate some BTC at a relatively low average price.
- There is a need for "forced savings and long-term BTC accumulation." By using DCA, you can convert small, leftover funds each month (such as salary surplus) into BTC, which not only prevents idle funds or impulsive spending, but also allows you to accumulate assets over the long term.
In short, the prerequisite for DCA in any asset is that you are optimistic about its long-term value.

### Three Strategies
1. Standard DCA Strategy: Invest a fixed amount at regular intervals, such as $500 every week.
- Pros: The simplest, most exchanges support it directly, just transfer funds at a fixed time to execute the purchase.
- Cons: The same amount is invested regardless of whether the price is high or low, so the cost may be higher.
2. Dynamic DCA Strategy: Add some timing operations on top of standard DCA, most commonly using the RSI indicator (for example, RSI > 70 is considered "overbought, most people are buying," so buy less; RSI < 30 is considered "oversold, most people are selling," so buy more).
- Pros: The average purchase price will be lower, and the drawdown will be smaller during market declines.
- Cons: Each DCA requires calculating the specific investment amount based on indicators (such as RSI), making the operation more complex than standard DCA. Some exchanges may not support it directly, so manual calculation or tools are needed.
3. Value Averaging Strategy (VA): Regularly increase the value of holdings by a fixed amount, for example, the target portfolio value increases by $500 every week. If the BTC price surges this week and the current holding value exceeds the target of "last week's value + $500," buy less or even sell the excess.
- Pros: Can be seen as a passive buy-low-sell-high strategy. In a long-term sideways market, it can lower the holding cost more quickly. The calculation is also relatively simple.
- Cons: In a market crash, a large amount of additional funds is needed, which may be difficult to execute due to budget constraints; in a market surge, a large amount of BTC needs to be sold, which is not favorable for "stackers." We can improve this by limiting the maximum amount invested or sold each time.

### When to Stop
- Fiat-based: For example, stop when the total investment reaches $100,000.
- BTC-based: For example, stop when the BTC holdings reach 1 BTC.
- Strategic take-profit: When using the value averaging strategy, if the market continues to rise and the portfolio profit reaches the preset target (or the holding cost is much lower than the current market price), you can consider taking profit and exiting, and start the next round of DCA.
- If your fundamental conviction in the long-term value of BTC changes (for example, due to fundamental regulatory risks or the underlying technology being disrupted), causing the logic of "long-term holding" to become invalid, you should immediately stop DCA to avoid continued losses.

The biggest enemy of DCA is not the market, but giving up halfway. The key is to choose a strategy that you can execute long-term and stress-free, and then stick to it like eating and sleeping.

## About This Application
- Initial release includes BTC data from 2011-01-03 to 2025-09-15. Please select backtest dates within this range. The next version will support real-time data.
- Currently, the simulation only models DCA investments made every Monday. Although some statistics suggest that consistently investing on Mondays yields slightly higher returns compared to other days of the week (Tuesday to Sunday), it is still recommended to choose a schedule that best suits you—after all, consistency is the key to success.
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
