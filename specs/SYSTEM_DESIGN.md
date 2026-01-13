# Bitcoin Strategy Comparison Tool - System Design Document

## 1. System Overview

### 1.1 Project Background
Web application developed based on the research report in Research.txt for comparing and simulating different Bitcoin dollar-cost averaging strategies. The system supports three main strategies: standard DCA, dynamic DCA, and value averaging.

### 1.2 Core Objectives
- Provide intuitive strategy comparison interface
- Strategy backtesting based on historical data
- Support parameter customization and real-time simulation
- Multi-language internationalization support

## 2. System Architecture

### 2.1 Overall Architecture Diagram

| Frontend Layer         |     Business Logic Layer      |     Data Layer    |
|------------------------|-------------------------------|-------------------|
| **React Components**   | **Simulation Service**        | **Static Data**   |
| - App.tsx              | - runSimulation()             | - btcPriceData.ts |
| - InputForm            | - Strategy Logic              | - Historical BTC  |
| - ResultsDashboard     | - Metrics Calc                | - RSI Indicators  |
| - Charts               |                               |                   |
| **State Management**   | **Data Processing**           | **Type Definitions** |
| - useState             | - Price Data                  | - types.ts        |
| - useCallback          | - Time Series                 | - Interfaces      |
| - Context API          | - Filtering                   | - Enums           |
| **UI Framework**       | **Calculations**              | **Configuration** |
| - Tailwind CSS         | - RSI Calculation             | - i18n config     |
| - ShadCN/UI            | - Metrics                     | - Theme config    |
| - Recharts             | - ROI/Sharpe                  | - Vite config     |

### 2.2 Technology Stack Selection

| Layer                |    Technology Choice     |                             Reasons                      |
|----------------------|--------------------------|----------------------------------------------------------|
| Frontend Framework   | React 19 + TypeScript    | Type safety, component-based development, rich ecosystem |
| Build Tool           | Vite                     | Fast hot reload, modern build                            |
| UI Framework         | Tailwind CSS + ShadCN/UI | Fast development, consistent design                      |
| Chart Library        | Recharts                 | React ecosystem, lightweight, easy to use                |
| State Management     | React Hooks              | Lightweight, follows React best practices                |
| Internationalization | Custom i18n              | Flexibility, lightweight                                 |

## 3. Core Module Design

### 3.1 Strategy Simulation Engine

#### 3.1.1 Standard DCA
```typescript
interface StandardDCAStrategy {
  weeklyBudget: number;
  execution: (priceData: PriceDataPoint[]) => StrategyResult;
}

// Core logic
const runStandardDCA = (params: SimulationParams, priceData: PriceDataPoint[]) => {
  // Invest fixed amount weekly
  // Calculate accumulated BTC and portfolio value
  // Generate time series data
}
```

#### 3.1.2 Dynamic DCA
```typescript
interface DynamicDCAStrategy {
  rsiThresholds: {
    extremeLow: number;
    low: number;
    high: number;
    extremeHigh: number;
  };
  budgetMultipliers: {
    extremeLow: number;
    low: number;
    normal: number;
    high: number;
    extremeHigh: number;
  };
}
```

#### 3.1.3 Value Averaging
```typescript
interface ValueAveragingStrategy {
  weeklyGrowthTarget: number;
  maxBuyCap: number;
  maxSellCap: number;
  execution: (priceData: PriceDataPoint[]) => StrategyResult;
}
```

### 3.2 Data Model Design

#### 3.2.1 Core Data Types
```typescript
interface PriceDataPoint {
  date: string;
  close: number;
  rsi: number;
}

interface SimulationParams {
  weeklyBudget: number;
  startDate: string;
  endDate: string;
  // Dynamic DCA parameters
  rsiExtremeLow: number;
  budgetExtremeLow: number;
  // ... other parameters
}

interface StrategyResult {
  strategyName: string;
  metrics: Metrics;
  timeSeries: TimeSeriesPoint[];
}
```

#### 3.2.2 Metrics Calculation
```typescript
interface Metrics {
  totalUsdInvested: number;
  totalBtcAccumulated: number;
  finalPortfolioValue: number;
  averageCostBasis: number;
  roiPercentage: number;
  maxDrawdown: number;
  sharpeRatio: number;
}
```

### 3.3 Component Architecture

#### 3.3.1 Component Hierarchy
```
App
|-- Header
|-- InputForm
|   |-- Basic Parameters
|   |-- Dynamic DCA Settings
|   └-- Value Averaging Settings
└-- ResultsDashboard
    |-- Metrics Cards
    |-- Comparison Table
    └-- Charts
        |-- PortfolioChart
        |-- InvestmentChart
        └-- MetricCharts
```

#### 3.3.2 State Management
```typescript
// Main application state
const [simulationParams, setSimulationParams] = useState<SimulationParams>();
const [results, setResults] = useState<StrategyResult[] | null>();
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

## 4. Data Flow Design

### 4.1 User Interaction Flow
```
User Input Parameters → Parameter Validation → Run Simulation → Calculate Metrics → Generate Charts → Display Results
```

### 4.2 Data Flow Diagram
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
|  User Input |───▶|  Validation  |───▶|  Simulation |
└─────────────┘    └──────────────┘    └─────────────┘
                                              |
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
|  Results    |◀───|  Metrics     |◀───| Time Series |
|  Display    |    |  Calculation |    |             |
└─────────────┘    └──────────────┘    └─────────────┘
```

### 4.3 Simulation Execution Flow
1. **Data Filtering**: Filter historical data based on user-selected date range
2. **Strategy Execution**: Execute three strategy algorithms in parallel
3. **Metrics Calculation**: Calculate ROI, Sharpe ratio, maximum drawdown, and other metrics
4. **Result Aggregation**: Package results into unified format
5. **UI Update**: Trigger component re-rendering

## 5. Performance Optimization

### 5.1 Computational Optimization
- **Parallel Computing**: Execute three strategies simultaneously
- **Data Caching**: Preload historical data
- **Lazy Loading**: Render chart components on demand

### 5.2 Rendering Optimization
- **React.memo**: Prevent unnecessary re-renders
- **useCallback**: Optimize event handler functions
- **Virtualization**: Paginated display for large datasets

### 5.3 Memory Management
- **Data Cleanup**: Timely cleanup of unnecessary data
- **Component Unmounting**: Proper cleanup of side effects

## 6. Extensibility Design

### 6.1 Adding New Strategies
```typescript
// 1. Define strategy interface
interface NewStrategy {
  name: string;
  parameters: StrategyParameters;
  execute: (params: SimulationParams, data: PriceDataPoint[]) => StrategyResult;
}

// 2. Implement strategy logic
const runNewStrategy = (params: SimulationParams, priceData: PriceDataPoint[]) => {
  // Strategy implementation
}

// 3. Register to simulation service
export const runSimulation = (params: SimulationParams, data: PriceDataPoint[]) => {
  return [
    runStandardDCA(params, data),
    runDynamicDCA(params, data),
    runValueAveraging(params, data),
    runNewStrategy(params, data), // New strategy
  ];
}
```

### 6.2 Adding New Metrics
```typescript
// 1. Extend Metrics interface
interface Metrics {
  // Existing metrics...
  newMetric: number;
}

// 2. Implement calculation logic
const calculateNewMetric = (timeSeries: TimeSeriesPoint[]): number => {
  // Calculation logic
}

// 3. Integrate into metrics calculation
const calculateMetrics = (timeSeries: TimeSeriesPoint[]): Metrics => {
  return {
    // Existing calculations...
    newMetric: calculateNewMetric(timeSeries),
  };
}
```

### 6.3 Adding New Chart Types
```typescript
// 1. Create chart component
const NewChart: React.FC<{ data: StrategyResult[] }> = ({ data }) => {
  // Chart implementation
}

// 2. Integrate into results panel
export const ResultsDashboard: React.FC<Props> = ({ results }) => {
  return (
    <div>
      {/* Existing charts */}
      <NewChart data={results} />
    </div>
  );
}
```

## 7. Internationalization Architecture

### 7.1 Language Support Structure
```
i18n/
|-- index.ts              # Main entry
|-- LanguageProvider.tsx  # Context provider
└-- locales/
    |-- zh.ts            # Chinese
    |-- en.ts            # English
    └-- ja.ts            # Japanese
```

### 7.2 Translation Key Structure
```typescript
interface TranslationKeys {
  header: {
    title: string;
    subtitle: string;
  };
  form: {
    title: string;
    description: string;
    // ... more keys
  };
  // ... more namespaces
}
```

### 7.3 Usage
```typescript
const { t, language } = useLanguage();
const title = t('header.title');
```

## 8. Error Handling

### 8.1 Error Types
- **Parameter Validation Errors**: Date range, value range checks
- **Insufficient Data Errors**: Not enough historical data
- **Calculation Errors**: Strategy execution exceptions
- **Rendering Errors**: Component rendering failures

### 8.2 Error Handling Strategy
```typescript
try {
  const results = runSimulation(params, data);
  setResults(results);
} catch (error) {
  if (error instanceof ValidationError) {
    setError(t('error.validation'));
  } else if (error instanceof DataError) {
    setError(t('error.data'));
  } else {
    setError(t('error.unknown'));
  }
}
```

## 9. Testing Strategy

### 9.1 Unit Testing
- **Strategy Algorithm Testing**: Verify calculation logic correctness
- **Utility Function Testing**: Test helper functions
- **Component Testing**: Test UI component behavior

### 9.2 Integration Testing
- **End-to-End Testing**: Complete user flow testing
- **Performance Testing**: Large dataset processing capability
- **Compatibility Testing**: Different browsers and devices

## 10. Deployment Architecture

### 10.1 Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
});
```

### 10.2 Deployment Options
- **Static Deployment**: Netlify, Vercel, GitHub Pages
- **CDN Deployment**: Global accelerated access
- **Containerization**: Docker deployment to cloud servers

## 11. Future Extensions

### 11.1 Feature Extensions
- **Real-time Data**: Connect to real market data APIs
- **User Accounts**: Save and share strategy configurations
- **Social Features**: Strategy sharing and discussion

### 11.2 Technical Upgrades
- **Backend Services**: Support more complex calculations
- **Database**: Store user data and historical records
- **Caching System**: Improve response speed
- **Microservices**: Modular deployment

## 12. Summary

This system design follows modern web development best practices and has the following characteristics:

1. **Modular Architecture**: Clear separation of responsibilities, easy to maintain and extend
2. **Type Safety**: Comprehensive TypeScript type definitions
3. **Performance Optimization**: Reasonable computational and rendering optimization
4. **Internationalization Support**: Complete multi-language solution
5. **Extensibility**: Well-designed extension points

This architecture can support current functional requirements and provides a solid foundation for future feature extensions.
