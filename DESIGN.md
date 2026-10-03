# DESIGN.md — Kasa AutoBox Cloud Visual Authority

## Aesthetic World: Tactical Automotive Telemetry & Workshop Console
The interface reflects an instrument-grade automotive workshop diagnostic terminal and cloud operations bridge. It avoids consumer-SaaS "playful" AI tropes (gradient text, pastel blobs, generic cards) in favor of high-density precision, clear technical contrast, and mechanical tactile feedback.

## Surface & Depth System
- **Ground (Canvas)**: `#0a0c10` (Dark obsidian slate with neutral cool tint).
- **Raised Surface (Bays & Control Cards)**: `#12161f` with 1px border `#1e2638`.
- **Inset Surface (Terminals, OBD-II Log Viewers, Token Vault)**: `#07080c` with inset border `#161c28`.
- **Active / Focused Element**: `#182030` with border `#2d3748`.
- **Elevation**: Flat, technical depth using crisp 1px borders rather than blurry drop shadows.

## Color Tokens (OKLCH Mapped)
- **Primary Telemetry Accent (System Nominal / Active)**: 
  - Token: `--color-nominal`
  - Value: `#10b981` (Emerald / OKLCH `72% 0.17 155`)
- **Warning & Ignition Accent (Expiring Soon / DTC Warning / Countdown)**:
  - Token: `--color-warning`
  - Value: `#f59e0b` (Amber / OKLCH `75% 0.16 75`)
- **Critical / Fault Accent (Critical DTC / Terminated / Error)**:
  - Token: `--color-critical`
  - Value: `#ef4444` (Crimson / OKLCH `60% 0.22 25`)
- **Cloud Infrastructure Accent (AWS ECS / Route)**:
  - Token: `--color-aws-blue`
  - Value: `#3b82f6` (Cobalt / OKLCH `62% 0.18 250`)
- **Neutral Foregrounds**:
  - High Contrast Heading: `#f8fafc` (`oklch(98% 0 0)`)
  - Body Text: `#cbd5e1` (`oklch(86% 0.01 250)`)
  - Secondary / Metadata: `#64748b` (`oklch(55% 0.02 250)`)
  - Hairline Rule: `#1e2638` (`oklch(22% 0.02 250)`)

## Typography Architecture
1. **Header & UI Controls**: Clean, high-legibility sans-serif (`Inter`, `system-ui`).
   - Title Tracking: `-0.025em` (tight, crisp, authoritative).
2. **Telemetry, Clocks, VINs & Log Feeds**: Strict monospace with `font-variant-numeric: tabular-nums`.
   - Countdown clocks must never jitter or shift width as digits tick down.
   - Vehicle VINs, Task IDs, and IP addresses formatted in dedicated monospaced pill badges.

## Layout & Spatial Composition
- **Asymmetric Command Center**:
  - **Header Bar**: Live status indicator (AWS Connected vs Local Simulator Mode toggle), FinOps savings ticker, active environment count.
  - **Left Rail (Control & Launcher)**: Template selector (Workshop Bay, OBD-II Telematics, Fault Diagnostic), TTL selector buttons (15m, 30m, 1h, 2h), VIN selector, "Launch Ephemeral Sandbox" trigger.
  - **Center Grid (Active Fleet B bays)**: Active sandbox monitors with real-time countdown clocks, live health gauges, direct URL buttons, and STS credential drawer.
  - **Right Rail / Drawer (Diagnostic Simulator & CloudWatch Logs)**:
    - Interactive OBD-II Fault Injector (inject DTC codes directly into active containers).
    - Terminal-grade live CloudWatch log streamer with severity filters (ALL, INFO, WARN, DTC_FAULT).

## Strict Refusals & Anti-Patterns (Impeccable Floor)
- ❌ No gradient text or decorative text fills.
- ❌ No floating blurred colorful background blobs.
- ❌ No identical repeated cards without functional differentiation.
- ❌ No emojis in place of icons (all iconography uses unified 1.5px stroke Lucide SVGs).
- ❌ No unlabelled metric boxes without domain context.
- ❌ No fake non-functional buttons; every control performs a deterministic action.
