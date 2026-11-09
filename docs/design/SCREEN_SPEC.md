# SCREEN SPECIFICATIONS: EDITORIAL SPANISH LEARNING

## 1. Screen Architecture & Navigation Flow

The application utilizes a persistent bottom tab bar coupled with focused modal flows:

```
[Onboarding Stack] (Initial Launch)
  ├── 1. Welcome Screen ("New language. New possibilities.")
  ├── 2. Learning Goals Screen ("Why are you learning Spanish?")
  ├── 3. Proficiency Level Screen ("What is your current level?")
  └── 4. Daily Commitment Screen ("Set your daily study pace")

[Main Tab Navigation]
  ├── Tab 1: Inicio (Home / Dashboard)
  │     ├── Continue Journey Hero
  │     ├── Metric Cards (Vocab, Hours, Streak, Level)
  │     ├── Daily Learning Activity Carousel
  │     ├── Weekly Progress Bar Chart
  │     └── Skill Proficiency Progress
  │
  ├── Tab 2: Aprender (Learn / Curriculum)
  │     ├── Level Selector (A1, A2, B1, B2)
  │     ├── Unit & Lesson Roadmaps
  │     └── Direct Activity Launchers:
  │           ├── Vocabulario (Flashcards & SRS)
  │           ├── Gramática (Structured Lessons)
  │           ├── Verbos (Conjugation Tables & Drills)
  │           └── Ejercicios (Multi-format Quizzes)
  │
  ├── Tab 3: Biblioteca (Library: Reading & Listening)
  │     ├── Lecturas (Editorial Reader & Tap-to-Translate)
  │     └── Audios (Player & Synced Transcripts)
  │
  ├── Tab 4: Progreso (Analytics & Review)
  │     ├── Detailed Performance Charts
  │     ├── FSRS Review Queue
  │     └── Skill Radar (Reading, Listening, Writing, Speaking)
  │
  └── Tab 5: Perfil (Profile & Data Portability)
        ├── User Stats & CEFR Profile
        ├── JSON Data Import & Export (Backup / Restore)
        └── Offline Content Manager
```

---

## 2. Screen Detail Specifications

### Screen 1: Onboarding Flow

#### 1.1 Welcome Screen (`/onboarding/welcome`)
- **Visual Tone:** Warm Ivory `#F6F0E7`, featuring hand-drawn illustration of a reader immersed in Spanish books with warm coffee and handwritten annotations (`Different stories, brighter days`).
- **Heading:** Serif 32pt `"Un nuevo idioma. Nuevas posibilidades."` (with subtle English subtitle: *"New language. New possibilities."*).
- **Description:** `"Discover Spanish through authentic literature, engaging audio, and structured mastery from A1 to B2."`
- **Actions:**
  - Primary Pill CTA: `"Comenzar el viaje →"` (Burnt Orange `#F06423`)
  - Secondary Text Button: `"Ya tengo una cuenta"` (Ink Black text)

#### 1.2 Learning Goals Screen (`/onboarding/goals`)
- **Options Grid:**
  - 📖 Literary & Cultural Exploration
  - ✈️ Travel & Living in Spain/Latin America
  - 💼 Career & Professional Growth
  - 🧠 Brain Training & Personal Challenge
- **Card Design:** Soft Cream card with warm border; selected state features Forest Green outline and peach tint.

#### 1.3 CEFR Level Assessment (`/onboarding/level`)
- **Choices:**
  - A1: Principiante (*Just starting out*)
  - A2: Elemental (*Basic conversations & past tense*)
  - B1: Intermedio (*Express thoughts, read short stories*)
  - B2: Intermedio Alto (*Fluent discussions & complex literature*)
  - Assessment Quiz trigger: *"¿No estás seguro? Haz una prueba corta (3 min)"*

#### 1.4 Daily Commitment (`/onboarding/time`)
- **Options:** `10 min/día` (Relajado), `20 min/día` (Constante - Recomendado), `30 min/día` (Intensivo).
- **Action:** `"Crear mi plan de estudio"` -> Transitions to Home Dashboard.

---

### Screen 2: Dashboard (`/tabs/index`)

#### 2.1 Header
- **Greeting:** `"¡Hola, Daizy! Listo para otro día de español?"` (Editorial serif headline).
- **Date & Streak:** Current date in muted grey, alongside a warm amber pill badge: `🔥 12 días de racha`.
- **Avatar:** User profile circle with notification bell.

#### 2.2 Metric Overview Cards (Reference 2 Grid)
- **Grid Layout:** 2x2 or horizontal carousel with rounded corners (`radius: 20px`).
  1. **Vocabulario:** `480 palabras` (Cream card, book icon)
  2. **Tiempo total:** `8h 45m` (Peach card, clock icon)
  3. **Nivel actual:** `A1 Principiante` (Sage card, graduation cap)
  4. **Lecciones:** `24 completadas` (Ivory card, checkmark list)

#### 2.3 "Continue Journey" Hero Card
- **Background:** Deep Forest Green `#153D32` with subtle paper texture.
- **Content:**
  - Badge: `A1 — Lección 08`
  - Title: `"Pidiendo comida en el restaurante"`
  - Description: `"Aprende a ordenar platos típicos, pedir la cuenta y expresar preferencias con cortesía."`
  - Duration: `⏱ 12 minutos`
  - Progress track: Burnt orange bar filled at 65%.
  - CTA Button: Ink Black / Burnt orange pill: `"Continuar →"`

#### 2.4 Daily Learning Activity Pathways
- Horizontal scrolling cards or grid:
  1. 📖 **Lectura:** *El café de la esquina* (5 min)
  2. 🎧 **Audio:** *Un día en Madrid* (3 min)
  3. 🗂️ **Vocabulario:** *15 palabras para repasar*
  4. 📐 **Gramática:** *Ser vs. Estar sin misterios*
  5. 🔄 **Verbos:** *Conjugación del presente regular*

#### 2.5 Progress Performance Visualization (Reference 2 Inspiration)
- **Weekly Bar Chart Card:**
  - Header: `"Rendimiento semanal"` with toggle `[Semanal | Mensual]`.
  - 7 vertical capsule columns (Lun, Mar, Mié, Jue, Vie, Sáb, Dom).
  - Fill indicates study minutes completed vs daily goal.
  - Active column highlighted with Burnt Orange `#F06423`.
  - Tooltip on active bar: `Jueves: 42 min • 3 lecciones`.

#### 2.6 Skill Proficiency Breakdown
- 4 progress indicators:
  - 📖 **Lectura (Reading):** 78% (A1 Avanzado)
  - 🎧 **Escucha (Listening):** 64% (A1 Medio)
  - ✍️ **Escritura (Writing):** 52% (A1 En progreso)
  - 🗣️ **Conversación (Speaking):** 45% (A1 Inicial)

---

### Screen 3: Vocabulary & Spaced Repetition (`/tabs/learn/vocabulary`)

#### 3.1 Flashcard Study Mode (FSRS Spaced Repetition)
- **Card Surface:** Large Soft Cream card with tactile shadow and warm border.
- **Front of Card:**
  - Spanish term in bold editorial serif 32pt (e.g., `la biblioteca`).
  - Grammatical gender & part of speech badge: `sustantivo femenino`.
  - Audio pronunciation trigger button.
  - Phonetic transcript: `[bi-bljo-ˈte-ka]`.
  - Tap cue: `"Toca para ver significado y ejemplo"`.
- **Back of Card:**
  - English translation: `"the library"`.
  - Definition in Spanish: `"Lugar donde se conservan libros para su lectura o consulta."`
  - Example sentence: `Ella pasa las tardes leyendo en la biblioteca municipal.`
  - English sentence translation.
  - 4 FSRS Rating Buttons:
    1. 🔴 **Otra vez (Again)** — Interval: < 10 min
    2. 🟠 **Difícil (Hard)** — Interval: 1 día
    3. 🟢 **Bien (Good)** — Interval: 3 días
    4. 🔵 **Fácil (Easy)** — Interval: 7 días

#### 3.2 Vocabulary Browser & Word Bank
- Search bar with category filters: *Alimentos, Viajes, Familia, Trabajo, Cultura*.
- CEFR level tags: A1, A2, B1, B2.
- Bookmark / Save icon for personal collections.

---

### Screen 4: Grammar Curriculum (`/tabs/learn/grammar`)

#### 4.1 Lesson View
- **Header:** Topic title (e.g., `"Ser vs. Estar: La esencia y el estado"`).
- **Rule Cards:**
  - Rule box with Forest Green left accent border.
  - Clear, accessible explanation avoiding convoluted linguistic jargon.
  - Interactive comparison tables:
    - *Ser* = Identidad, profesión, origen, características permanentes.
    - *Estar* = Ubicación, estados temporales, emociones.
- **Common Mistakes Callout:**
  - ⚠️ *"No digas: Estoy de Madrid. Di: Soy de Madrid."*
- **Practice Exercises:** Bite-sized interactive prompts embedded right in the lesson.

---

### Screen 5: Verb Conjugation (`/tabs/learn/verbs`)

#### 5.1 Conjugation Search & Explorer
- Instant search by infinitive (`hablar`, `comer`, `vivir`, `ser`, `tener`, `ir`).
- Classification badge: `Regular (-ar)` or `Irregular` with alert color.
- English definition: `hablar = to speak / to talk`.

#### 5.2 Tense Selector Tabs
- *Presente*, *Pretérito Perfecto*, *Imperfecto*, *Futuro*, *Condicional*, *Subjuntivo*.

#### 5.3 Pronoun Conjugation Table
- Elegant grid with alternating soft cream rows:
  - `yo hablo`
  - `tú hablas`
  - `él / ella / usted habla`
  - `nosotros hablamos`
  - `vosotros habláis`
  - `ellos / ellas / ustedes hablan`
- Audio playback for each pronoun form.
- Practice Conjugation Quiz button.

---

### Screen 6: Reading Engine (`/tabs/library/reading`)

#### 6.1 Library List
- Books, short stories, and cultural articles with public-domain / creative commons attribution.
- Covers styled with editorial book spine aesthetic.
- CEFR level badge, estimated reading time, and word count.

#### 6.2 Reader Mode (Reference 1 Inspiration)
- Distraction-free Warm Ivory `#F6F0E7` canvas.
- Editorial serif body text (Georgia / DM Serif Display), customizable font sizes (`A- / A+`).
- **Interactive Word Translation Popover:**
  - Tapping any word opens an elegant bottom sheet or popover:
    - Target word with accent marks.
    - Translation in context.
    - Audio pronunciation.
    - Action: `"Guardar en mi vocabulario"` (adds to FSRS review deck).
- Reading progress bar and chapter marker.
- End-of-chapter reading comprehension check.

---

### Screen 7: Listening Engine (`/tabs/library/listening`)

#### 7.1 Audio Player Screen
- Forest Green hero container or warm cream player card.
- Illustrated episode artwork (e.g., coffee shop dialogue, market sounds).
- Burnt Orange waveform / progress scrub track with current time / total time.
- Large tactile controls: Rewind 10s, Play/Pause, Forward 10s.
- Speed toggle: `0.75x`, `1.0x`, `1.25x`, `1.5x`.
- **Interactive Synced Transcript:**
  - Sentence-by-sentence highlights synced to audio playback.
  - Tap any sentence to loop or repeat that sentence.
  - Save vocabulary directly from the transcript.
  - Comprehension quiz following playback.

---

### Screen 8: Reusable Exercise Framework (`/tabs/learn/exercises`)

#### 8.1 Exercise Types Supported
1. **Multiple Choice:** Select correct translation or grammatical form from 4 cards.
2. **Fill in the Blanks:** Tap word bank chips to complete the sentence.
3. **Sentence Ordering:** Drag or tap scrambled Spanish words into correct syntax.
4. **Word Matching:** Pair Spanish words with their English equivalents.
5. **Listening Comprehension:** Audio clip followed by context questions.
6. **Error Correction:** Identify the incorrect word in a Spanish sentence.

#### 8.2 Feedback States
- Clear visual state changes:
  - Correct: Light Sage Green background with checkmark badge and affirmative comment: `"¡Excelente! Exactamente así."`
  - Incorrect: Light Terracotta background with explanation: `"Cuidado: 'estar' se usa para estados temporales."`
  - Continue button to advance smoothly.

---

### Screen 9: Progress & Analytics (`/tabs/progress`)

- Detailed weekly / monthly study time chart.
- Spaced repetition retention rate & upcoming reviews forecast (Today: 18 words, Tomorrow: 24 words).
- Skill balance radar / bars across the 4 CEFR disciplines.
- CEFR Level Milestone roadmap showing achieved and pending skills.

---

### Screen 10: Profile, Settings & Data Portability (`/tabs/profile`)

- Learner Profile with CEFR status and join date.
- Learning preferences (daily goal, notification reminders, audio accent Spain/Latin America).
- **JSON Data Portability:**
  - `"Exportar copia de seguridad (JSON)"` — Generates a versioned JSON package of user progress, learned words, and review history.
  - `"Restaurar desde archivo JSON"` — Validates schema and restores study data.
- Offline cache status: downloaded lessons and audio storage size.

