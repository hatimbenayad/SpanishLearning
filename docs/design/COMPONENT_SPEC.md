# COMPONENT SPECIFICATIONS

## 1. Atomic & Base Components

### 1.1 `EditorialText`
- **Props:**
  - `variant`: `'displayLarge' | 'displayMedium' | 'displaySmall' | 'headline' | 'bodyLarge' | 'bodyRegular' | 'bodySmall' | 'label' | 'handwritten' | 'statNumber'`
  - `color`: Key of theme colors (default: `text.primary`)
  - `align`: `'left' | 'center' | 'right'`
  - `children`: ReactNode
- **Behavior:**
  - Uses Serif font for display variants and long-form Spanish reading text.
  - Uses Sans font for body, headline, statNumber, and labels.
  - Uses handwritten styling for editorial annotations.
  - Automatically handles font scaling and platform-specific font families (iOS Georgia, Android serif).

### 1.2 `PillButton`
- **Props:**
  - `title`: string
  - `onPress`: () => void
  - `variant`: `'primary' | 'secondary' | 'outline' | 'dark'`
  - `iconRight`: Icon component or name
  - `disabled`: boolean
  - `fullWidth`: boolean
- **Styling:**
  - `primary`: Burnt Orange `#F06423` background with Cream `#FFF9F0` text.
  - `secondary`: Forest Green `#153D32` background with Cream text.
  - `dark`: Ink Black `#171715` background with Cream text and burnt orange arrow.
  - `outline`: Transparent background with `#171715` border and text.
  - Border radius: `9999px` (Pill).
  - Tactile padding: 14px vertical, 24px horizontal.

### 1.3 `EducationalCard`
- **Props:**
  - `variant`: `'cream' | 'peach' | 'sage' | 'dark' | 'ivory'`
  - `title`: string
  - `subtitle`: string (optional)
  - `icon`: Icon component or node
  - `onPress`: () => void (optional)
  - `children`: ReactNode
- **Styling:**
  - Radius: `20px`
  - Subtle hairline border: 1px `#E6DCCD`
  - Background tints:
    - `cream`: `#FFF9F0`
    - `peach`: `#FCEBE3`
    - `sage`: `#E8F0EC`
    - `dark`: `#153D32`
    - `ivory`: `#F6F0E7`
  - Padding: 16px to 20px

### 1.4 `ProgressBar`
- **Props:**
  - `progress`: number (0 to 1)
  - `color`: string (default: Burnt Orange `#F06423`)
  - `trackColor`: string (default: `#EBE4D8`)
  - `height`: number (default: 8)
- **Styling:**
  - Fully rounded capsule track.
  - Smooth animation or proportional width fill.

---

## 2. Domain & Learning Components

### 2.1 `StatCard`
- Compact educational metric card (inspired by Reference 2).
- Shows an icon container, numeric value (e.g. `7h 50m`, `480`), and descriptive label (`Vocabulario`, `Horas`).

### 2.2 `ContinueJourneyCard`
- Prominent hero card on the Dashboard.
- Shows current CEFR level tag, lesson title, estimated time, progress bar, and "Continuar" CTA button.

### 2.3 `WeeklyBarChart`
- Renders 7 day columns (Lun-Dom) with fill bars proportional to daily learning minutes.
- Active day is highlighted in burnt orange, others in soft forest green or neutral fill.
- Displays daily goal threshold and day labels.

### 2.4 `Flashcard`
- Flippable card for vocabulary acquisition.
- Front displays Spanish term, part of speech badge, phonetics, and audio button.
- Back displays translation, definition, and example sentence with highlighted term.
- Accompanied by 4 FSRS review buttons (Again, Hard, Good, Easy).

### 2.5 `TappableReadingText`
- Renders long-form Spanish text broken into interactive word tokens.
- Tapping a word opens the Translation Popover with definition, pronunciation, and "Guardar palabra" action.

### 2.6 `AudioPlayerControls`
- Scrub bar in burnt orange, play/pause button, 10-second skip buttons, and playback speed selector.

### 2.7 `ExerciseCard`
- Renders question prompt, options (chips or cards), and feedback modal with educational explanations.

---

## 3. Illustration & Visual Components

### 3.1 Hand-drawn Editorial Vector Illustrations
- `ReaderIllustration`: Young reader holding an open orange book with floating book covers ("Cien años de soledad", "Don Quijote", "Poesía").
- `BooksStackIllustration`: Stack of books with a warm coffee mug labeled "Poco a poco".
- `GrammarIllustration`: Journal and fountain pen representing structured grammar rules.
- `VocabularyIllustration`: Hand-drawn index flashcards with botanical sprig accents.
- `AudioIllustration`: Acoustic Spanish guitar and headphones with organic sound waves.
- `MilestoneBadge`: Hand-drawn starburst / wreath for CEFR milestones.

