# Trading & Financial Markets — QA and release contract

Status: NOT PUBLISHED. Do not announce `/trading/` routes until deployed and HTTP-tested.

## Design system
Use the existing `/assets/academy-brand-theme.css`, `/assets/academy-navigation.js`, and `/assets/academy-page-contract.js` with canonical logo/favicon, skip link, header/footer and accessible breadcrumbs. Brand-kit tokens: Ink Navy `#03033A`, Skunk Blue `#1E6BD0`, Signal Orange `#F24208`, white `#FFFFFF`, Off White `#F7F9FC`, Graphite `#15171A`. Use Inter Display for headings and Open Sans for body. Avoid independent purple/cyan themes. Minimum WCAG AA contrast 4.5:1 normal text, 3:1 large text and UI components.

## Ten required courses
TRD-101 CFDs (`/trading/CFDs/`), TRD-102 Forex (`/trading/forex/`), TRD-103 Charts (`/trading/charts/`), TRD-104 Candlesticks (`/trading/candlesticks/`), TRD-105 Indicators (`/trading/indicators/`), TRD-106 Support and Resistance (`/trading/support-resistance/`), TRD-107 Risk Management (`/trading/risk-management/`), TRD-108 TradingView (`/trading/tradingview/`), TRD-109 Order Types (`/trading/order-types/`), TRD-110 Trading Strategies (`/trading/trading-strategies/`).

## Acceptance gates
1. Each route resolves with HTTP 200 and unique canonical, title, meta description, H1, course code, estimated duration, outcomes, prerequisite, 3+ sections, illustrations with text alternatives, worked numerical example, paper-trading exercise, knowledge check with explanations, citations, and risk disclosure.
2. Confirm charts explain bid/ask spread, margin, leverage, liquidation/stop-out, slippage and overnight funding where relevant; never imply guaranteed returns. Use synthetic prices and clearly label illustrations.
3. Test keyboard-only navigation, focus states, 200% zoom, mobile 320/375/768px, desktop 1440px, light/dark contrast, reduced motion, quiz scoring, navigation, link targets and no console errors.
4. Run automated link checks, HTML validation, axe accessibility, Lighthouse mobile/desktop and Playwright flows. Run k6 at 10, 50 and 100 virtual users for 5 minutes per stage against a staging endpoint with permission; report p50/p95, error rates, request throughput and page transfer sizes. Do not claim load testing without measured results.
5. Validate CI and preview deployment, review screenshots, then merge to main and retest live canonical URLs.

## Current blocker
The trading course pages were absent from this feature branch at the time of inspection on 2026-10-21. This file is a QA/release contract, not evidence of ten completed courses or successful testing.
