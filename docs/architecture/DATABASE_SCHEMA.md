# DATABASE SCHEMA SPECIFICATION

## 1. Relational Entities (PostgreSQL / Supabase & SQLite)

### `users`
- `id`: UUID (Primary Key)
- `email`: VARCHAR(255) UNIQUE
- `name`: VARCHAR(100)
- `cefr_level`: VARCHAR(2) CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2'))
- `daily_goal_minutes`: INTEGER DEFAULT 20
- `current_streak`: INTEGER DEFAULT 0
- `best_streak`: INTEGER DEFAULT 0
- `total_learning_minutes`: INTEGER DEFAULT 0
- `created_at`: TIMESTAMPTZ DEFAULT NOW()

### `vocabulary_items`
- `id`: VARCHAR(50) (Primary Key)
- `word`: VARCHAR(100) NOT NULL
- `translation`: VARCHAR(255) NOT NULL
- `definition`: TEXT NOT NULL
- `part_of_speech`: VARCHAR(50) NOT NULL
- `gender`: VARCHAR(2)
- `plural`: VARCHAR(100)
- `phonetic`: VARCHAR(100) NOT NULL
- `example_sentence`: TEXT NOT NULL
- `example_translation`: TEXT NOT NULL
- `cefr_level`: VARCHAR(2) NOT NULL
- `topic`: VARCHAR(100) NOT NULL
- `source`: VARCHAR(100)
- `license`: VARCHAR(100)

### `user_vocabulary_cards` (FSRS Tracking)
- `id`: UUID (Primary Key)
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
- `word_id`: VARCHAR(50) REFERENCES vocabulary_items(id)
- `state`: VARCHAR(20) DEFAULT 'new'
- `reps`: INTEGER DEFAULT 0
- `lapses`: INTEGER DEFAULT 0
- `stability`: REAL DEFAULT 1.0
- `difficulty`: REAL DEFAULT 5.0
- `due`: TIMESTAMPTZ NOT NULL
- `last_reviewed`: TIMESTAMPTZ
- `is_favorite`: BOOLEAN DEFAULT FALSE

### `daily_activity_logs`
- `id`: UUID (Primary Key)
- `user_id`: UUID REFERENCES users(id)
- `date`: DATE NOT NULL
- `minutes`: INTEGER DEFAULT 0
- `lessons_completed`: INTEGER DEFAULT 0
- UNIQUE(user_id, date)

