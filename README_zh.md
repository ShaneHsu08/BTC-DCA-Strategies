# 比特币策略比较工具

[English](README.md)

<div align="center"><h1><a href=https://dca.btc.sv>在线演示</a></h1></div>

一个基于React的Web应用程序，用于比较不同的比特币定投策略。支持标准定投、动态定投和价值平均法三种策略的模拟和比较。

## 功能特性

### 核心功能
- **标准定投 (Standard DCA)**: 固定金额的定期投资策略
- **动态定投 (Dynamic DCA)**: 基于RSI指标的智能定投策略
- **价值平均法 (Value Averaging)**: 带限制的价值平均策略

### 技术特性
- 📊 实时数据可视化（投资组合价值、BTC累计量、成本基础等）
- 🌍 多语言支持（中文、英文、日文）
- 📱 响应式设计，支持移动端
- ⚡ 基于Vite的快速开发环境
- 🎨 现代化UI设计（Tailwind CSS + ShadCN/UI）

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI框架**: Tailwind CSS + ShadCN/UI
- **图表库**: Recharts
- **国际化**: 自定义i18n解决方案

## 项目结构

```
BTCStrategies/
├── components/           # React组件
│   ├── ui/              # 基础UI组件
│   ├── Header.tsx       # 页面头部
│   ├── InputForm.tsx    # 参数输入表单
│   ├── ResultsDashboard.tsx # 结果展示面板
│   └── ...
├── contexts/            # React上下文
├── data/               # 静态数据
│   └── btcPriceData.ts # 比特币历史价格数据
├── i18n/               # 国际化
│   ├── locales/        # 语言文件
│   └── LanguageProvider.tsx
├── services/           # 业务逻辑
│   └── simulationService.ts # 策略模拟服务
├── types.ts           # TypeScript类型定义
└── utils.ts           # 工具函数
```

## 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装和运行

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **访问应用**:
   打开浏览器访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

## 使用指南

### 1. 设置参数
- **基础周预算**: 设置每周投资金额
- **时间范围**: 选择模拟的开始和结束日期
- **动态定投参数**: 配置RSI阈值和对应的投资金额
- **价值平均法参数**: 设置目标增长和买卖限制

### 2. 运行模拟
点击"运行模拟"按钮，系统将基于历史数据计算三种策略的表现。

### 3. 分析结果
- 查看关键指标对比（ROI、BTC累计量、最大回撤等）
- 分析投资组合价值变化趋势
- 比较不同策略的资本效率

## 策略说明

### 标准定投 (Standard DCA)
- 每周固定投资相同金额
- 简单易执行，心理压力小
- 适合长期投资者

### 动态定投 (Dynamic DCA)
- 基于RSI指标调整投资金额
- RSI < 自定义阈值: 增加投资（市场超卖）
- RSI > 自定义阈值: 减少投资（市场超买）
- 平衡风险与收益

### 价值平均法 (Value Averaging)
- 目标：投资组合价值每周增长固定金额
- 低于目标时买入，高于目标时卖出
- 设置买卖限制避免极端操作

## 数据说明

- 内置2011-2025年比特币历史价格数据（实际部署时可接入真实API）
- 包含RSI技术指标计算

## 开发说明

### 添加新策略
1. 在 `types.ts` 中定义新的策略类型
2. 在 `simulationService.ts` 中实现策略逻辑
3. 在 `InputForm.tsx` 中添加参数输入
4. 在 `ResultsDashboard.tsx` 中展示结果

### 国际化
- 在 `i18n/locales/` 中添加新语言文件
- 在 `LanguageProvider.tsx` 中注册新语言
- 使用 `useLanguage` hook 获取翻译文本

## 部署

### 构建
```bash
npm run build
```

### 预览
```bash
npm run preview
```

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 免责声明

本工具仅用于教育和研究目的，不构成投资建议。投资有风险，请谨慎决策。

## 许可证

MIT License
