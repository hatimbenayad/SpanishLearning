# MASTER DEVELOPMENT PROMPT — SPANISH LEARNING APPLICATION

You are acting as a senior software architect, mobile application engineer, UX/UI designer, language-learning researcher, database engineer, and QA engineer.

Your task is to design and develop a complete Spanish-learning mobile application for iOS and Android.

You must use AI-DLC (AI-Driven Development Lifecycle) and Spec-Driven Development (SDD) throughout the project.

Do not treat this as a simple flashcard application. The objective is to create a comprehensive, structured Spanish-learning platform that takes users from CEFR A1 to B2.

# 1. TECH STACK

Use the following technologies:

Frontend:
- React Native.
- TypeScript.
- Expo.
- Expo Router.
- A reusable component architecture.

Backend:
- Supabase.
- PostgreSQL.
- Supabase Authentication.
- Supabase Row Level Security.
- Supabase Storage when required.

Local persistence:
- Expo SQLite.
- Offline-first learning functionality.
- Synchronization with Supabase.

Data portability:
- JSON import/export.
- Versioned JSON schemas.
- Backup and restoration functionality.

Do not introduce unnecessary technologies or dependencies.

# 2. DEVELOPMENT METHODOLOGY

Follow AI-DLC + SDD.

The project must be specification-first.

Before writing substantial application code, create:

/docs
  /product
    PRD.md
    USER_JOURNEYS.md
    ACCEPTANCE_CRITERIA.md

  /specs
    FUNCTIONAL_SPEC.md
    TECHNICAL_SPEC.md
    CONTENT_SPEC.md
    OFFLINE_SYNC_SPEC.md
    JSON_SCHEMA_SPEC.md

  /architecture
    SYSTEM_ARCHITECTURE.md
    DATABASE_SCHEMA.md
    API_DESIGN.md
    NAVIGATION_STRUCTURE.md

  /design
    DESIGN_SYSTEM.md
    COMPONENT_SPEC.md
    SCREEN_SPEC.md

  /implementation
    IMPLEMENTATION_PLAN.md
    TASK_BREAKDOWN.md
    TEST_STRATEGY.md

  /decisions
    ADR-001.md

Use Architecture Decision Records whenever an important architectural decision is made.

Every implementation task must reference the specification it implements.

If a requirement changes, update its specification before changing the implementation.

Do not invent features outside the defined product scope.

# 3. PRODUCT OBJECTIVE

Create a Spanish-learning application covering:

- A1 — Beginner.
- A2 — Elementary.
- B1 — Intermediate.
- B2 — Upper Intermediate.

The application must support multiple learning methodologies:

1. Reading comprehension.
2. Listening comprehension.
3. Vocabulary acquisition.
4. Grammar learning.
5. Verb conjugation.
6. Interactive exercises.
7. Sentence construction.
8. Writing practice.
9. Speaking practice.
10. Spaced repetition.

Use CEFR descriptors as the foundation of the curriculum.

The default content should prioritize Spanish from Spain while allowing other Spanish varieties to be represented and identified.

# 4. LEARNING ENGINE

Design a reusable learning engine.

Every learning activity must have:

- A unique ID.
- A title.
- A description.
- A CEFR level.
- A learning category.
- Learning objectives.
- Estimated completion time.
- Content.
- Associated exercises.
- Progress state.

Implement a unified progress system.

Track:
- Lessons completed.
- Exercises completed.
- Correct answers.
- Incorrect answers.
- Vocabulary learned.
- Review history.
- Time spent learning.
- Skill-specific progress.

Do not rely exclusively on completion percentages. Assess actual performance.

# 5. VOCABULARY SYSTEM

Build a vocabulary module with:

- Word.
- Translation.
- Definition.
- Part of speech.
- Grammatical gender.
- Plural.
- Pronunciation.
- Example sentences.
- CEFR level.
- Topic.
- Source.
- License.

Support:
- Flashcards.
- Word matching.
- Multiple choice.
- Sentence completion.
- Translation.
- Contextual vocabulary exercises.
- User-created word collections.

Implement spaced repetition using FSRS or a suitable documented alternative.

Review scheduling must be deterministic, testable, and stored persistently.

# 6. GRAMMAR SYSTEM

Create a complete grammar curriculum from A1 to B2.

Every grammar lesson should contain:

- Explanation.
- Rules.
- Examples.
- Contextual usage.
- Common mistakes.
- Exercises.
- Assessment.

Grammar must be progressive.

Do not introduce advanced structures in beginner lessons without an educational reason.

# 7. VERB CONJUGATION SYSTEM

Build a searchable Spanish verb database.

Support:
- Infinitive.
- English translation.
- Regular/irregular classification.
- Verb groups.
- Conjugation tables.
- Tense selection.
- Example sentences.
- Interactive exercises.

Include relevant tenses progressively across A1–B2.

Validate conjugation data against reliable linguistic references.

# 8. READING ENGINE

Create a reading interface.

Requirements:
- CEFR-based filtering.
- Text rendering.
- Adjustable font size.
- Paragraph navigation.
- Word selection.
- Translation popover.
- Save word to vocabulary.
- Highlighting.
- Comprehension questions.
- Reading progress.
- Offline availability for downloaded content.

Content should come from approved public-domain or openly licensed sources.

# 9. LISTENING ENGINE

Create a dedicated audio player.

Requirements:
- Play/pause.
- Playback speed.
- Rewind and forward.
- Repeat audio.
- Transcript.
- Hide transcript.
- Sentence-level playback.
- Save unfamiliar vocabulary.
- Comprehension exercises.

Support downloadable audio where licensing permits.

Make the player functional on both iOS and Android.

# 10. EXERCISE ENGINE

Create a reusable exercise framework.

Exercise types:

- Multiple choice.
- Fill in the blanks.
- Sentence ordering.
- Word matching.
- Translation.
- Verb conjugation.
- Listening comprehension.
- Reading comprehension.
- Error correction.
- Sentence construction.

Each exercise should support:
- Instructions.
- Question.
- Answer.
- Accepted alternatives where applicable.
- Explanation.
- Difficulty.
- Score.
- Completion status.

Do not hardcode exercises directly into screens.

Exercise content should be data-driven.

# 11. WRITING AND SPEAKING

Writing:
- Provide structured writing prompts.
- Let users compose responses.
- Allow users to save their work.
- Support correction and feedback through an optional evaluation service.

Speaking:
- Allow audio recording.
- Allow playback.
- Provide speaking prompts.
- Provide model answers.
- Support optional speech recognition.

Avoid making AI services mandatory for the basic learning experience.

# 12. OPEN-SOURCE CONTENT ACQUISITION

Research and integrate suitable openly licensed resources.

Prioritize:

- Tatoeba for sentence pairs.
- LibriVox for public-domain audiobooks.
- Project Gutenberg for public-domain books.
- Proyecto Claudia Lars for public-domain literature.
- Wiktionary for vocabulary and linguistic metadata.
- Council of Europe CEFR descriptors for curriculum mapping.

Do not assume that free content is automatically redistributable.

For every imported asset, preserve:

- Original source.
- Original author or contributor.
- License.
- Attribution.
- Download URL.
- Content version.
- Import date.

Audio licenses must be checked independently from text licenses.

Build an ingestion pipeline that can:
1. Import content.
2. Validate its structure.
3. Check required licensing metadata.
4. Assign or propose CEFR levels.
5. Flag uncertain difficulty classifications.
6. Remove duplicates.
7. Store the content in the appropriate format.

Never fabricate source attribution or licensing information.

Do not classify an entire book as A1 merely because its first chapter is easy.

# 13. DATABASE AND STORAGE

Supabase is the primary cloud database.

Create a properly normalized PostgreSQL schema.

Include:
- User profiles.
- Learning content.
- CEFR levels.
- Lessons.
- Vocabulary.
- Grammar.
- Verbs.
- Exercises.
- Reading materials.
- Listening materials.
- User progress.
- Review cards.
- Review history.
- Learning sessions.
- Content sources.
- License information.

Implement:
- Foreign keys.
- Appropriate indexes.
- Constraints.
- Database migrations.
- Row Level Security.
- Secure authentication.

Local SQLite should support:
- Downloaded content.
- Offline lessons.
- Local progress.
- Vocabulary.
- Review schedules.
- Pending synchronization changes.

Define a clear synchronization strategy.

Avoid silently overwriting newer user progress.

# 14. JSON IMPORT AND EXPORT

JSON must be supported as a portable content and data format.

Implement:

A. Content import:
- Vocabulary packs.
- Lessons.
- Grammar content.
- Exercises.
- Reading materials.
- Listening metadata.

B. User data export:
- Vocabulary.
- Learning progress.
- Personal collections.
- Review history.
- Preferences.

C. Backup and restoration:
- Export a versioned backup.
- Validate imported data.
- Handle duplicate records.
- Handle incompatible schema versions.
- Provide clear error messages.

Create formal JSON schemas.

Do not confuse JSON serialization with database persistence.

# 15. UI/UX DESIGN

The application should feel like a polished modern language-learning product.

Design requirements:

- Minimalist.
- Premium appearance.
- Intuitive.
- Accessible.
- Mobile-first.
- Consistent across iOS and Android.

Avoid excessive gamification and clutter.

Use reusable design tokens:
- Colors.
- Typography.
- Spacing.
- Borders.
- Shadows.
- Radii.
- Component states.

Build reusable components.

Screens must include:
- Loading states.
- Empty states.
- Error states.
- Success states.
- Offline states.

Create a consistent navigation structure.

# 16. TESTING

Implement:

Unit tests:
- Learning progress calculations.
- Exercise evaluation.
- Verb conjugation.
- Spaced repetition.
- JSON validation.
- Data synchronization.

Integration tests:
- Supabase authentication.
- Database operations.
- Offline persistence.
- Import/export.
- Content ingestion.

UI tests:
- Navigation.
- Lesson completion.
- Exercise interactions.
- Vocabulary saving.
- Audio player.

Validate the application on both iOS and Android.

# 17. IMPLEMENTATION PHASES

Do not attempt to build everything in one uncontrolled implementation.

Phase 1 — Discovery and specifications:
- Review product requirements.
- Research resources.
- Define user journeys.
- Create technical specifications.
- Create acceptance criteria.

Phase 2 — Architecture:
- Design database.
- Design local persistence.
- Define synchronization.
- Define JSON schemas.
- Create UI design system.
- Define navigation.

Phase 3 — Foundation:
- Initialize Expo project.
- Configure TypeScript.
- Configure Supabase.
- Implement authentication.
- Implement local database.
- Implement design system.

Phase 4 — Core learning:
- Dashboard.
- CEFR curriculum.
- Vocabulary.
- Grammar.
- Verb conjugation.
- Exercise engine.

Phase 5 — Content:
- Reading library.
- Listening library.
- Content ingestion.
- License metadata.
- Offline downloads.

Phase 6 — Progress and persistence:
- Learning progress.
- Spaced repetition.
- SQLite persistence.
- Supabase synchronization.
- JSON import/export.

Phase 7 — Advanced learning:
- Writing practice.
- Speaking practice.
- Optional AI feedback.

Phase 8 — Validation:
- Run tests.
- Fix bugs.
- Validate accessibility.
- Test offline behavior.
- Test both platforms.
- Review against specifications.

# 18. IMPORTANT DEVELOPMENT RULES

1. Never skip the specification stage.
2. Never build placeholder functionality and claim it is complete.
3. Do not fabricate learning content sources.
4. Do not hardcode the curriculum into individual screens.
5. Keep learning content separate from application logic.
6. Keep Supabase access behind a dedicated data layer.
7. Keep local persistence independent of UI components.
8. Implement proper error handling.
9. Keep TypeScript strict.
10. Avoid unnecessary dependencies.
11. Make the application usable without an internet connection for previously downloaded material.
12. Keep the architecture maintainable and extensible.
13. Test every major feature before moving to the next phase.

# 19. FIRST ACTION

Do not immediately start coding.

Begin by:

1. Inspecting the existing repository, if one exists.
2. Reviewing the product requirements.
3. Identifying missing technical decisions.
4. Researching the educational resources.
5. Creating the documentation structure.
6. Producing the complete functional and technical specifications.
7. Producing the implementation plan.

Present the architecture and implementation plan before starting the main development work.

Once the specifications are complete, implement the project incrementally, validating every phase against its acceptance criteria.

The final objective is a fully functional, maintainable, cross-platform Spanish-learning application that supports A1 through B2.

Prioritize educational quality, correctness, usability, and maintainability over the quantity of features.