# Design System — Quantum Ethereal

## Colors (Tailwind classes)
bg-selene-bg (#0A0A0F) — main background
bg-selene-card (#12121A) — card surfaces
bg-selene-elevated (#1A1A25) — raised elements, inputs
bg-selene-hover (#22222F) — hover states
border-selene-border (#2A2A35) — all borders
text-selene-gold (#C9A84C) — primary accent, CTAs, highlights
text-selene-gold-light (#E8D5A0) — gold hover/light variant
text-selene-white (#F0EDE4) — primary text
text-selene-white-dim (#A8A4A0) — secondary text, labels
text-selene-blue (#4A6FA5) — science/info accent
text-selene-teal (#5B9E8F) — success, free tier
text-selene-rose (#C97B8B) — errors, danger
text-selene-purple (#7B68AE) — Magnetismo Consciente course
text-selene-success (#5BB88F) — completed, free labels

## Typography
font-display = Cormorant Garamond — headings, titles, hero, certificate text
font-body = Outfit — body text, buttons, labels, navigation
Both loaded via Google Fonts in app/globals.css.

## Principles
- Dark theme ONLY. Premium feel like luxury jewelry brand.
- Gold is the primary accent. Use sparingly for maximum impact.
- Generous spacing. Let elements breathe.
- Border radius: 10-16px for cards, 8-12px for buttons, 20px for certificates.
- Subtle glow effects: box-shadow with gold at 0.08 opacity.
- Star/dot patterns at 0.04 opacity for depth.
- No generic flat Material Design. No bright colors on dark. Muted and elegant.

## Component patterns (see components/ui/index.js)
Card — bg-selene-card rounded-2xl border border-selene-border
Badge — small colored label (course tags, prices)
ProgressBar — animated width transition, custom color per course
Spinner — border-t-selene-gold spinning for loading states
GoldDivider — thin gold line for section breaks
