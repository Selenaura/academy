# Design System — Quantum Ethereal

## Colors (Tailwind classes)
bg-selene-bg (#0C0E1A) — main background (60% navy)
bg-selene-card (#1C1F38) — card surfaces
bg-selene-elevated (#242845) — raised elements, inputs
bg-selene-hover (#22222F) — hover states
border-selene-border (#2A2A35) — all borders
text-selene-gold (#D4A843) — CTAs, prices, primary action buttons (10%)
text-selene-lavender (#9B8EC4) — decorative borders, icons, labels, tags (30%)
text-selene-gold-light (#E8D5A0) — gold hover/light variant
text-selene-white (#F0EDE4) — primary text
text-selene-white-dim (#A8A4A0) — secondary text, labels
text-selene-blue (#6B8FC5) — science/info accent
text-selene-teal (#5BB8A6) — success, free tier
text-selene-rose (#D4879B) — errors, danger
text-selene-purple (#8B7CC8) — Magnetismo Consciente course
text-selene-success (#5BB88F) — completed, free labels

## Typography
font-display = Cormorant Garamond — headings, titles, hero, certificate text
font-body = Outfit — body text, buttons, labels, navigation
Both loaded via Google Fonts in app/globals.css.

## Principles
- Dark theme ONLY. Premium feel like luxury jewelry brand.
- 60-30-10 rule: Navy (#0C0E1A) backgrounds 60%, Lavender (#9B8EC4) decorative 30%, Gold (#D4A843) CTAs 10%.
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
