# SYSTEM ARCHITECTURE: SPANISHLEARN

## 1. High-Level Architecture Overview

SpanishLearn is an offline-first mobile application built on Expo (React Native + TypeScript), using SQLite for local persistence, Supabase (PostgreSQL + RLS + Auth) for cloud sync, and JSON schemas for data portability.

```
+-------------------------------------------------------------+
|                      React Native UI Layer                  |
|  - Design System Tokens (Warm Ivory, Forest Green, Orange)  |
|  - Editorial Typography (Serif Display + Clean Sans)        |
|  - Screens: Onboarding, Dashboard, Vocab, Grammar, Verbs,    |
|             Reading, Listening, Exercises, Progress, Profile |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                  State & Learning Engine Layer              |
|  - LearningEngine: Progress, CEFR level assessment          |
|  - FSRSEngine: Spaced repetition intervals & scheduling     |
|  - ExerciseEngine: Multi-type evaluation & scoring           |
|  - ReaderEngine: Word tokenization & translation lookup     |
|  - AudioPlayerEngine: Playback speed, synced transcript     |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     Data Abstraction Layer                  |
|  - Repositories: VocabularyRepo, LessonRepo, ProgressRepo,  |
|                  ReadingRepo, VerbRepo                      |
|  - Data Portability: JSON Import/Export & Schema Validator   |
+-------------------------------------------------------------+
               /                              \
              v                                v
+-----------------------------+  +----------------------------+
|  Local SQLite Persistence   |  |     Supabase Cloud API     |
|  - Offline-first cache      |  |  - PostgreSQL Database     |
|  - User progress & reviews  |  |  - Auth & Row Level Sec    |
|  - Downloaded content       |  |  - Content Cloud Delivery  |
+-----------------------------+  +----------------------------+
```

## 2. Key Subsystems

### 2.1 Learning & Spaced Repetition Engine (FSRS)
- Evaluates user ratings: `Again (1)`, `Hard (2)`, `Good (3)`, `Easy (4)`.
- Updates stability, difficulty, review intervals, and scheduled review dates.
- Deterministic and unit-tested algorithms stored in persistent tables.

### 2.2 Content Abstraction & Ingestion
- Preloaded CEFR-aligned learning fixtures (A1-B2) for:
  - 100+ Core vocabulary terms with definitions, pronunciations, parts of speech, and example sentences.
  - Progressive grammar units (A1 Articles/Gender, Ser vs. Estar, Present Regular Verbs, Gustar, Direct Objects).
  - Searchable verb database with full conjugation tables across major tenses.
  - Authentic public-domain reading articles (e.g., *El café de la esquina*, *Rinconete y Cortadillo*, *Leyendas de Bécquer*).
  - Audio lessons with sentence-aligned transcripts.
- Strict license metadata tracking for open-source sources (Tatoeba, Project Gutenberg, Wiktionary).

### 2.3 JSON Data Portability
- Backup format version `1.0.0` with JSON Schema validation.
- Allows exporting complete learning state (user progress, vocabulary, favorites, FSRS review cards) and importing backups without data loss.

