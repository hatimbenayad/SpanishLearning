# API & DATA LAYER DESIGN

## 1. Abstraction Boundaries (PRD Rule #6 & #7)
- UI components and screens never import or call `@supabase/supabase-js` or `expo-sqlite` directly.
- All persistence and sync passes through the dedicated service layer:
  - `AuthService`: Manages Supabase Auth sessions (email/password, magic link, sign out) and offline guest state.
  - `SupabaseService`: Encapsulates `@supabase/supabase-js` client configuration and remote PostgreSQL table operations.
  - `DatabaseService`: Encapsulates local `expo-sqlite` persistence, schema migrations, and the offline mutation outbox.
  - `SyncEngine`: Orchestrates push/pull synchronization and deterministic conflict resolution.

## 2. Supabase Authentication Endpoints
- `signUpWithEmail(email, password, name)`: Registers user in `auth.users` and initializes `user_profiles` / `user_progress`.
- `signInWithEmail(email, password)`: Authenticates and hydrates active JWT session.
- `sendMagicLink(email)`: Sends passwordless OTP link via Supabase Auth.
- `signOut()`: Clears remote session while preserving local offline SQLite data unless explicitly cleared.

## 3. Remote REST / PostgREST Tables
| Table | Methods | Scope |
|---|---|---|
| `user_profiles` | `SELECT`, `UPSERT` | Own user (`auth.uid() = id`) |
| `user_progress` | `SELECT`, `UPSERT` | Own user (`auth.uid() = user_id`) |
| `user_vocabulary_cards` | `SELECT`, `UPSERT` | Own user (`auth.uid() = user_id`) |
| `daily_activity_logs` | `SELECT`, `UPSERT` | Own user (`auth.uid() = user_id`) |
| `review_history` | `SELECT`, `INSERT` | Own user (`auth.uid() = user_id`) |
| `vocabulary_items` | `SELECT` | Public curriculum |
| `reading_materials` | `SELECT` | Public curriculum |
