# DESIGN SYSTEM SPECIFICATION: EDITORIAL MEETS MODERN EDUCATIONAL DASHBOARD

## 1. Vision & Identity

The SpanishLearn visual identity synthesizes two complementary paradigms:
1. **The Artistic Editorial Aesthetic (Reference 1):** A warm, bookish, literary haven celebrating the beauty of Spanish language and culture. Evokes the tactile romance of printed literature, notebooks, warm coffee mugs, hand-drawn annotations, and thoughtful discovery.
2. **The Modern Educational Dashboard (Reference 2):** Clear information architecture, rounded metric cards, intuitive progress charts, categorized learning pathways, and scannable visual indicators.

### What It Is
- A thoughtful, premium Spanish-learning journal and companion.
- A calm, tactile study sanctuary with generous negative space and literary warmth.
- An empowering dashboard where real learning progress is visualized clearly.

### What It Is Not
- A generic SaaS dashboard or corporate portal.
- A noisy, hyper-gamified Duolingo clone filled with neon streaks and cartoon popups.
- An unstyled, clinical flashcard drill.
- A generic AI template.

---

## 2. Color Palette & Semantic Tokens

```
/* Primary Palette */
Warm Ivory (Canvas Base)      : #F6F0E7
Soft Cream (Card Surface)      : #FFF9F0
Forest Green (Primary Accent)  : #153D32
Deep Green (Nav / Dark Surface): #102E26
Burnt Orange (CTA / Highlights): #F06423
Soft Peach (Subtle Tint / Card): #F4B49B
Ink Black (Primary Typography) : #171715
Muted Grey (Secondary Text)    : #858078

/* Extended & Functional Palette */
Cream Border / Hairline        : #E6DCCD
Warm Amber (Warning/Streak)    : #E58A28
Sage Light (Success Tint)      : #E5EFE9
Terracotta Dark (Pressed CTA)  : #D55418
Forest Green Dark (Pressed)    : #0D261F
Paper Shadow                   : rgba(23, 23, 21, 0.06)
Card Shadow                    : rgba(21, 61, 50, 0.08)
```

### Color Semantics

| Token | Hex Value | Usage Description |
|---|---|---|
| `color.background.base` | `#F6F0E7` | Primary screen canvas background (warm ivory) |
| `color.background.surface` | `#FFF9F0` | Default card & sheet background (soft cream) |
| `color.background.surfacePeach` | `#FCEBE3` | Warm peach card variant (level/time cards) |
| `color.background.surfaceGreen` | `#E8F0EC` | Soft sage card variant (progress/success) |
| `color.background.surfaceDark` | `#153D32` | Forest green reading banner, hero card, player |
| `color.text.primary` | `#171715` | Ink black headings, main reading text, titles |
| `color.text.secondary` | `#858078` | Muted grey metadata, timestamps, subtitles |
| `color.text.inverse` | `#FFF9F0` | White/cream text on dark green & orange buttons |
| `color.text.brand` | `#153D32` | Editorial section headers, active tab icons |
| `color.action.primary` | `#F06423` | Main CTA buttons, progress bar fill, highlights |
| `color.action.primaryHover` | `#D55418` | Pressed CTA state |
| `color.action.secondary` | `#153D32` | Secondary buttons, pill navigation |
| `color.border.subtle` | `#E6DCCD` | Subtle hairline dividers and card boundaries |
| `color.border.strong` | `#171715` | Hand-drawn illustration strokes, bold outlines |

---

## 3. Typography System

We pair an **editorial serif** for literary headlines and reading passages with a **clean modern sans-serif** for interface controls, labels, and statistics, complemented by **handwritten script** accents for annotations.

### Font Families
- **Display / Editorial Headings:** Serif (`Georgia` on iOS / `serif` on Android / `DM Serif Display` or `Playfair Display`)
- **Body & Interface:** Clean Sans (`System Sans` / `SF Pro` / `Roboto` / `Inter`)
- **Handwritten Annotations:** Script/Handwritten accent styling (`Caveat`, italicized hand-crafted notes)

### Type Scale

| Style Name | Font Family | Size | Line Height | Weight | Usage |
|---|---|---|---|---|---|
| `displayLarge` | Serif | 34pt | 42pt | Bold (700) | Onboarding hero, Level titles |
| `displayMedium`| Serif | 28pt | 36pt | SemiBold (600) | Screen titles, Reader headings |
| `displaySmall` | Serif | 22pt | 30pt | SemiBold (600) | Card titles, "Continue journey" |
| `headline`     | Sans | 18pt | 24pt | SemiBold (600) | Activity titles, Section headers |
| `bodyLarge`    | Serif/Sans | 17pt | 28pt | Regular (400) | Long-form Spanish reading text |
| `bodyRegular`  | Sans | 15pt | 22pt | Regular (400) | Card summaries, exercises, descriptions |
| `bodySmall`    | Sans | 13pt | 18pt | Regular (400) | Secondary info, translations |
| `statNumber`   | Sans | 26pt | 32pt | Bold (700) | Dashboard numbers, streak count |
| `label`        | Sans | 12pt | 16pt | Medium (500) | Badge labels, tab labels, captions |
| `handwritten`  | Script/Italic| 15pt | 20pt | Regular (400) | Organic annotations, notebook tips |

---

## 4. Spacing, Radii & Elevations

### Spacing Scale (4pt base)
- `space.xxs`: 4px
- `space.xs`: 8px
- `space.sm`: 12px
- `space.md`: 16px
- `space.lg`: 24px
- `space.xl`: 32px
- `space.xxl`: 48px

### Border Radii
- `radius.sm`: 8px (Small badges, chips)
- `radius.md`: 14px (Input fields, exercise choice buttons)
- `radius.lg`: 20px (Educational cards, stat boxes)
- `radius.xl`: 28px (Hero banners, reader containers)
- `radius.full`: 9999px (Pill buttons, avatars, tab capsules)

### Shadows & Elevation
- `elevation.paper`: Offset (0, 2), Radius: 4, Opacity: 0.05 (tactile paper card)
- `elevation.card`: Offset (0, 4), Radius: 12, Opacity: 0.08 (floating action card)
- `elevation.modal`: Offset (0, 10), Radius: 24, Opacity: 0.14 (translation popover)

---

## 5. Component Style Guide

### 1. Metric / Stat Cards (Reference 2 Inspiration)
- Rounded rectangles (`radius.lg = 20px`).
- Subtle background tints: Ivory (`#FFF9F0`), Peach (`#FCEBE3`), Sage (`#E8F0EC`), or Lavender Mist.
- Circular or squircle icon badge in upper left.
- Label: uppercase or small caps `12pt` muted grey.
- Stat number: `26pt` bold ink black with organic trend or units (`7h 50m`, `320 words`, `A1 Level`).

### 2. "Continue Your Journey" Hero Card
- Distinctive Forest Green (`#153D32`) or Cream surface with warm border.
- Features hand-drawn literary book graphic or Spanish landscape vignette.
- Progress bar in vibrant Burnt Orange (`#F06423`).
- Subtitle: CEFR Level badge + Lesson title (e.g., `A1 — Lección 8: Pidiendo comida en el restaurante`).
- Primary action: Ink black or burnt orange pill button (`Continuar →`).

### 3. Weekly Progress Performance Chart (Reference 2 Inspiration)
- Rounded card with week day columns (`Lun`, `Mar`, `Mié`, `Jue`, `Vie`, `Sáb`, `Dom`).
- Capsule bars with smooth rounded caps:
  - Inactive/background track: `#EFE8DE`.
  - Active fill: Burnt orange (`#F06423`) or Forest green (`#153D32`).
- Real-time time indicator tooltip above active day.
- Segmented control toggle: `Semanal` vs `Mensual`.

### 4. Reading Canvas (Reference 1 Inspiration)
- Background: Warm Ivory (`#F6F0E7`) for low-glare, eye-comfortable reading.
- Typography: High-legibility serif text with generous line-height (`1.65 - 1.8`).
- Adjustable typography toolbar: Font size `A- / A+`, night mode warm tint, line height.
- Interactive tokenization: Each Spanish word is tappable, presenting a quick translation popover with phonetics, example usage, and "Guardar palabra" (Save to Flashcards) button.

### 5. Audio Player Interface (Listening Module)
- Deep Forest Green or Soft Cream aesthetic with tactile player controls.
- Play/pause pill button in Burnt Orange.
- 10-second rewind/forward buttons.
- Playback speed chip toggle (`0.75x`, `1.0x`, `1.25x`, `1.5x`).
- Synced transcript view with highlighted current sentence, repeatable at a single tap.

### 6. Interactive Exercise Cards
- Clean, tactile question cards.
- Choice states:
  - Default: Soft cream background with subtle border `#E6DCCD`.
  - Selected: Soft peach or ivory with Forest Green border.
  - Correct: Light sage green `#E5EFE9` with green border `#236B56`.
  - Incorrect: Light terracotta `#FDE8E4` with burnt orange border `#D55418`.
- Clear, educational feedback drawer explaining the grammatical or lexical reasoning.

---

## 6. Illustration & Iconography Philosophy

- **Hand-drawn, organic warmth:** Hand-drawn line art illustrations with imperfect ink outlines, subtle dot hatching, and warm color fills (Burnt Orange, Forest Green, Soft Peach).
- **Cultural and literary subjects:** People reading books with cozy mugs, stacked Spanish literature ("Cien años de soledad", "Don Quijote", poetry books), Spanish courtyards, guitars, olive branches, and travel journals.
- **Micro-illustrations:** Small decorative sparkles, underlines, and asterisk doodles alongside key achievements and milestones.
- **Iconography:** Clean, modern line icons (2px stroke) paired with tactile warmth, ensuring fast recognition and seamless visual harmony across platforms.
