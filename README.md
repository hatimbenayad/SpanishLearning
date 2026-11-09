# SpanishLearn — Editorial Spanish Learning Mobile Application

> **Editorial illustration meets modern educational dashboard.**  
> A thoughtfully crafted Spanish-learning mobile application taking learners from CEFR A1 to B2.

---

## 📖 Vision & Visual Identity

SpanishLearn harmonizes two design philosophies:
1. **The Artistic Editorial Aesthetic:** Warm ivory (`#F6F0E7`) canvas, soft cream (`#FFF9F0`) card surfaces, deep forest green (`#153D32`), and vibrant burnt orange (`#F06423`). Features literary serif typography (`Georgia`/`serif`), handwritten notes, and custom hand-drawn SVG illustrations of students reading Spanish literature, cozy coffee mugs, and botanical accents.
2. **The Modern Educational Dashboard:** Clean information architecture, rounded metric cards (`radius: 20px`), capsule bar charts tracking daily learning minutes across Monday–Sunday with week/month toggles, CEFR level indicators, and distinct skill progress meters for Reading, Listening, Writing, and Speaking.

---

## ✨ Core Features

### 1. Welcoming Onboarding Flow
- Warm literary greeting: *"Un nuevo idioma. Nuevas posibilidades."*
- Goal calibration: Literature & Culture, Travel & Conversation, Career, or Intellectual Challenge.
- CEFR Level self-assessment (A1, A2, B1, B2).
- Daily study pace commitment (10 min, 20 min recommended, 30 min).

### 2. Personalized Educational Dashboard
- Editorial header greeting with user avatar, active CEFR level, and daily streak badge.
- 4 Quick-Stat educational cards (Study hours, Vocabulary learned, Lessons completed, Level).
- **"Continue Your Journey" Hero Card:** Next recommended lesson (*A1 — Lección 08: Pidiendo comida en el restaurante*) with duration, progress bar, and 1-tap continue button.
- Daily learning activities pathways (Reading, Listening, Vocabulary, Grammar, Verbs).
- **Weekly Progress Bar Chart:** 7-day capsule bar chart with real minutes data, selected-day highlight in burnt orange, and week/month toggle.
- **Skill Proficiency Breakdown:** Separate progress bars for Reading, Listening, Writing, and Speaking.

### 3. Vocabulary Acquisition with FSRS Spaced Repetition
- Flippable flashcards with audio pronunciation, grammatical gender tags, phonetic transcription, and authentic example sentences.
- 4-Tier FSRS rating buttons (*Otra vez* <10m, *Difícil* 1d, *Bien* 3d, *Fácil* 7d) backed by a deterministic spaced repetition algorithm.
- Searchable word bank with category filters (*Alimentos, Viajes, Cultura*) and favorite curation.

### 4. Progressive Grammar Curriculum
- Step-by-step rule explanations without convoluted jargon.
- Interactive comparison cards (*Ser vs. Estar*, *Por vs. Para*).
- *"Errores comunes a evitar"* callouts highlighting common learner pitfalls.
- Inline interactive practice exercises embedded directly in lessons.

### 5. Searchable Verb Conjugator
- Conjugation tables across 6 key tenses: *Presente, Pretérito Perfecto, Imperfecto, Futuro, Condicional, Subjuntivo*.
- Full pronoun coverage: *yo, tú, él/ella/usted, nosotros, vosotros, ellos/ellas/ustedes*.
- Regular (-ar, -er, -ir) vs. irregular status indicators.

### 6. Distraction-Free Digital Book Reader
- Authentic public-domain texts (*El café de la esquina*, *Rinconete y Cortadillo*).
- Adjustable typography toolbar (`A- / A+`).
- **Interactive Tap-to-Translate Tokens:** Tap any word in the passage to open a dictionary popover with phonetics, translation, and a *"Guardar en vocabulario"* action.
- Reading comprehension questions.

### 7. Audio Player with Synced Transcripts
- Forest green audio player with burnt orange scrubber and speed controls (`0.75x`, `1.0x`, `1.25x`).
- 10-second skip forward / rewind.
- Synced sentence-by-sentence transcript with repeat-on-tap capability.

### 8. Writing & Speaking Practice
- **Writing Workshop:** Level-tiered writing prompts with word count targets, drafting area, and clickable vocabulary suggestions.
- **Speaking & Pronunciation:** Native audio model playback, simulated voice recording, playback controls, and pronunciation tips.

### 9. Data Portability & Offline Persistence
- **Offline-First:** Local SQLite database abstraction with change mutation queue.
- **Supabase Cloud Sync:** Bidirectional sync engine with conflict resolution (newest timestamp wins).
- **Versioned JSON Backup:** Full export and restore with formal schema validation.

---

## 🛠 Tech Stack

- **Frontend:** React Native 0.76.7, Expo ~52.0.32, TypeScript 5.3.3.
- **Vector Illustrations & Charts:** `react-native-svg` 15.8.0.
- **Icons:** `lucide-react-native` and Unicode iconography.
- **Persistence & Cloud:** Expo SQLite and `@supabase/supabase-js` 2.47.10.
- **Testing:** Jest 29.7.0, `ts-jest` 29.2.5 (21 unit tests).

---

## 📂 Project Structure

```
├── docs/                     # Spec-Driven Development (SDD) Documentation
│   ├── design/               # DESIGN_SYSTEM.md, SCREEN_SPEC.md, COMPONENT_SPEC.md
│   ├── product/              # PRD.md, USER_JOURNEYS.md, ACCEPTANCE_CRITERIA.md
│   ├── specs/                # FUNCTIONAL_SPEC.md, TECHNICAL_SPEC.md
│   ├── architecture/         # SYSTEM_ARCHITECTURE.md, DATABASE_SCHEMA.md, NAVIGATION_STRUCTURE.md
│   ├── implementation/       # IMPLEMENTATION_PLAN.md
│   └── decisions/            # ADR-001.md
├── src/
│   ├── theme/                # Design tokens (colors, typography, spacing, tokens)
│   ├── types/                # TypeScript interfaces & models
│   ├── components/
│   │   ├── common/           # EditorialText, PillButton, ProgressBar, Badge
│   │   ├── cards/            # EducationalCard, StatCard, ContinueJourneyCard
│   │   ├── charts/           # WeeklyBarChart, SkillProficiencyList
│   │   ├── illustrations/    # ReaderIllustration, BooksStackIllustration
│   │   ├── learning/         # Flashcard, TappableReadingText, ConjugationTable, AudioPlayerView, ExerciseCard
│   │   └── navigation/       # TabBar, AppHeader
│   ├── data/                 # CEFR curriculum fixtures (vocabulary, grammar, reading, listening, verbs)
│   ├── screens/              # Onboarding, Home, Learn, Vocabulary, Grammar, Verbs, Reading, Listening, Progress, Profile, Practice
│   └── services/             # FSRSEngine, LearningService, DatabaseService, SyncEngine, JSONSchemaValidator
└── __tests__/                # Automated test suites
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
```bash
# Clone the repository
git clone https://github.com/hatimbenayad/SpanishLearning.git
cd SpanishLearning

# Install dependencies
npm install
```

### Running the App
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on Web
npm run web
```

### Running Tests & Typecheck
```bash
# Run unit tests
npm test

# Run strict TypeScript validation
npm run typecheck
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

