# ACCEPTANCE CRITERIA

## 1. Visual & Aesthetic Criteria
- [x] Primary palette conforms to specified tokens: Warm ivory `#F6F0E7`, soft cream `#FFF9F0`, forest green `#153D32`, burnt orange `#F06423`, soft peach `#F4B49B`, and ink black `#171715`.
- [x] Editorial typography combines high-legibility serif headings with clean sans-serif controls.
- [x] Hand-drawn vector illustrations feature books, coffee mugs, and Spanish literature motifs.
- [x] Negative space is generous; cards have tactile rounded corners (radius 20px) and subtle paper elevation.

## 2. Dashboard & Metrics
- [x] Overview grid renders 4 distinct educational cards (Study hours, Vocabulary learned, Lessons completed, Level).
- [x] "Continue Journey" hero card displays CEFR tag, title, duration, progress bar, and "Continuar viaje" CTA.
- [x] Weekly progress bar chart renders Monday through Sunday with real minutes data, selected-day highlight in burnt orange, and week/month toggle.
- [x] Skill proficiency displays separate progress bars for Reading, Listening, Writing, and Speaking.

## 3. Learning Engines
- [x] Vocabulary: Flippable flashcard with audio pronunciation, example sentence, favorite toggle, and 4-tier FSRS rating buttons.
- [x] Grammar: Progressive rule cards, comparison tables (Ser vs. Estar, Por vs. Para), and common mistakes callouts.
- [x] Verbs: Searchable verb directory with 6 tense tabs and pronoun conjugation table (yo through ellos).
- [x] Reading: Distraction-free digital book layout, adjustable text size, interactive word translation popover, and vocabulary saving.
- [x] Listening: Dedicated audio player with burnt orange scrubber, speed control (0.75x, 1x, 1.25x), 10s skip, and synced transcript with sentence repetition.
- [x] Exercises: Multiple choice and sentence reordering cards with instant educational feedback and explanations.

## 4. Technical & Architectural Criteria
- [x] Strict TypeScript compilation with 0 errors.
- [x] Deterministic FSRS spaced repetition engine covered by automated unit tests.
- [x] JSON data backup and restoration capability with schema validation.
- [x] Offline-first data model with SQLite / fixture isolation.

