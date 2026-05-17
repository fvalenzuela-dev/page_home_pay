---
name: Serene Ledger
colors:
  surface: "#f8f9ff"
  surface-dim: "#cbdbf5"
  surface-bright: "#f8f9ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#eff4ff"
  surface-container: "#e5eeff"
  surface-container-high: "#dce9ff"
  surface-container-highest: "#d3e4fe"
  on-surface: "#0b1c30"
  on-surface-variant: "#434655"
  inverse-surface: "#213145"
  inverse-on-surface: "#eaf1ff"
  outline: "#737686"
  outline-variant: "#c3c6d7"
  surface-tint: "#0053db"
  primary: "#004ac6"
  on-primary: "#ffffff"
  primary-container: "#2563eb"
  on-primary-container: "#eeefff"
  inverse-primary: "#b4c5ff"
  secondary: "#006c49"
  on-secondary: "#ffffff"
  secondary-container: "#6cf8bb"
  on-secondary-container: "#00714d"
  tertiary: "#784b00"
  on-tertiary: "#ffffff"
  tertiary-container: "#996100"
  on-tertiary-container: "#ffeedd"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#dbe1ff"
  primary-fixed-dim: "#b4c5ff"
  on-primary-fixed: "#00174b"
  on-primary-fixed-variant: "#003ea8"
  secondary-fixed: "#6ffbbe"
  secondary-fixed-dim: "#4edea3"
  on-secondary-fixed: "#002113"
  on-secondary-fixed-variant: "#005236"
  tertiary-fixed: "#ffddb8"
  tertiary-fixed-dim: "#ffb95f"
  on-tertiary-fixed: "#2a1700"
  on-tertiary-fixed-variant: "#653e00"
  background: "#f8f9ff"
  on-background: "#0b1c30"
  surface-variant: "#d3e4fe"
typography:
  h1:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
  mono-num:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "500"
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
  max_width: 1200px
---

## Brand & Style

The design system is rooted in the "Modern Professional" movement, prioritizing clarity, trust, and a sense of financial calm. The brand personality is that of a reliable steward—organized, transparent, and effortlessly efficient. It targets homeowners and heads of households who require a friction-less way to manage complex financial data without the stress of traditional accounting software.

The UI avoids high-frequency visuals in favor of expansive whitespace, subtle tonal transitions, and a logical information hierarchy. By utilizing a soft, cool-toned palette and intentional data visualization, the system transforms the chore of expense management into a ritual of financial empowerment and stability.

## Colors

The palette is centered on "Stability Blue" and "Growth Green." The primary blue provides a foundation of corporate reliability, while the secondary green is used for positive financial movements and "Paid" statuses. A neutral gray scale, derived from cool slate tones, manages the background and secondary text to maintain a high level of legibility without visual fatigue.

Status indicators are strictly enforced:

- **Paid:** A soft emerald green, signifying completion and health.
- **Pending:** A bright azure blue, signifying an active but controlled state.
- **Overdue:** A tempered coral red, providing high-visibility warning without inducing panic.

## Typography

This design system utilizes a dual-font strategy to balance character with utility. **Manrope** is used for headlines to provide a modern, refined, and approachable personality. **Inter** is used for all functional text, body copy, and data points due to its exceptional legibility and systematic performance in dense layouts.

Numerical data should always utilize tabular figures (monospace numbers) to ensure that currency amounts align vertically in lists and tables, facilitating easier scanning of household expenses.

## Layout & Spacing

The system employs a 12-column fluid grid for desktop and a single-column fluid layout for mobile, adhering to an 8px rhythmic grid. Content is housed within defined containers to prevent line lengths from becoming illegible on ultra-wide displays.

Spacing is used to group related expenses. For example, line items within a category use `sm` (8px) spacing, while major sections like "Monthly Overview" and "Upcoming Bills" are separated by `xl` (32px) margins. This "proximity-as-logic" approach reduces the need for heavy dividers.

## Elevation & Depth

To maintain a clean and trustworthy aesthetic, this design system uses **Tonal Layers** supplemented by **Low-Contrast Outlines**.

- **Level 0 (Background):** The base canvas uses a very light slate gray (#F8FAFC).
- **Level 1 (Cards/Containers):** Pure white surfaces with a subtle 1px border (#E2E8F0). No shadows are used at this level to keep the interface feeling "flat" and organized.
- **Level 2 (Modals/Dropdowns):** Elevated elements use a soft ambient shadow (10% opacity, 12px blur) to suggest they are floating above the grid.

Backdrop blurs (10px) are reserved specifically for global navigation bars to maintain context of the scroll position without distracting the user.

## Shapes

The design system adopts a **Rounded** (0.5rem) shape language. This radius is applied to buttons, input fields, and standard cards. For larger layout containers or featured "Monthly Summary" cards, a `rounded-xl` (1.5rem) radius is used to create a softer, more inviting enclosure.

Status chips and progress bar tracks use a "Full Pill" radius to differentiate functional indicators from interactive structural elements.

## Components

### Buttons

Primary buttons use the Stability Blue with white text. Secondary buttons use a Ghost style (no fill, slate-400 border) to prevent visual competition with primary actions.

### Data Visualization

- **Progress Bars:** Use a thick 8px track. The background is a 10% opacity version of the progress color. Use Growth Green for "Under Budget" and Overdue Red for "Over Budget."
- **Donut Charts:** Use a 24px stroke width with rounded caps to mirror the system's shape language.

### Status Indicators

Small, pill-shaped chips with a low-opacity background and high-contrast text.

- _Paid:_ Light green background, dark emerald text.
- _Pending:_ Light blue background, dark navy text.
- _Overdue:_ Light red background, dark crimson text.

### List Items

Expenses should be displayed in structured list rows. Each row includes a 40px rounded-lg icon container on the left, the merchant name and category in the center (stacked), and the amount/status on the right.

### Input Fields

Inputs are defined by a 1px border. On focus, the border transitions to Stability Blue with a 3px soft outer glow (20% opacity) to provide clear feedback. Labels sit above the field in `label-sm` typography.
