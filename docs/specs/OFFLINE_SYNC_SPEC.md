# OFFLINE PERSISTENCE & SYNCHRONIZATION SPECIFICATION

## 1. Purpose
Implements **PRD Section 13** (*Database and Storage*) and **GitHub Issue #2**. SpanishLearn operates **offline-first**: every learning action (FSRS card reviews, completed lessons, words saved from reading, daily minutes) is written immediately to local SQLite persistence and queued for asynchronous cloud synchronization with Supabase when online.

---

## 2. Local SQLite Architecture (`DatabaseService`)

### 2.1 Local Tables (`SQLITE_MIGRATIONS`)
1. `schema_migrations`: Tracks applied local DDL versions.
2. `local_vocabulary`: Offline cache of CEFR A1–B2 vocabulary and reader-saved words.
3. `local_fsrs_cards`: Deterministic spaced repetition parameters (`state`, `reps`, `lapses`, `stability`, `difficulty`, `due`, `last_review`, `updated_at`).
4. `local_user_progress`: Profile metrics, `completed_lesson_ids`, `saved_word_ids`, `weekly_activity`, `skill_proficiency`, and `updated_at`.
5. `pending_mutations`: Outbox table recording uncommitted changes (`id`, `table_name`, `operation`, `record_id`, `payload`, `timestamp`, `retry_count`).

### 2.2 Mutation Coalescing
When the same `(table_name, record_id)` is modified multiple times while offline, the queue coalesces or updates the pending mutation payload with the latest state and timestamp to prevent redundant network requests on reconnect.

---

## 3. Synchronization & Conflict Resolution (`SyncEngine`)

### 3.1 Sync Lifecycle
1. **Guard Check:** Verify `isOnline === true`, `SupabaseService.isConfigured() === true`, and authenticated user session (`AuthService.getCurrentUser()`).
2. **Push Phase:** Iterate pending mutations from `pending_mutations`, compare against remote server state via conflict resolver, upsert into Supabase PostgreSQL, and clear acknowledged mutations locally.
3. **Pull Phase:** Query remote `user_progress` and `user_vocabulary_cards` modified since `lastSyncedAt`, resolve any conflicts, and hydrate local SQLite cache.

### 3.2 Conflict Resolution Policy (PRD §13)
*"Avoid silently overwriting newer user progress."*
- **FSRS Vocabulary Cards:** Compare `lastReview` / `updatedAt` timestamps. Newer timestamp wins; if equal, preserve higher `reps` count.
- **User Progress:** Merge **monotonically** instead of destructive overwrite:
  - `completedLessonIds`: Set union of local and remote completed lesson IDs.
  - `savedWordIds`: Set union of local and remote saved word IDs.
  - `totalLearningMinutes`: `Math.max(local, remote)` (or merged delta).
  - `bestStreak`: `Math.max(local, remote)`.
  - `cefrLevel`, `dailyGoalMinutes`: Latest `updatedAt` wins.

---

## 4. Security & Row Level Security (RLS)
- Curriculum tables (`vocabulary_items`, `grammar_lessons`, `verbs`, `reading_materials`, `exercises`, `content_sources`) allow authenticated and anonymous read-only access (`SELECT`).
- User-scoped tables (`user_profiles`, `user_progress`, `user_vocabulary_cards`, `review_history`, `daily_activity_logs`, `learning_sessions`) strictly enforce `auth.uid() = user_id` (or `auth.uid() = id`) across `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
