# TECHNICAL SPECIFICATION

## 1. Technologies & Dependencies
- **Core Platform:** React Native 0.88.1, Expo ~58.0.24, TypeScript ~6.0.3.
- **Rendering & Vector Graphics:** `react-native-svg` 15.16.0 for vector illustrations and charts.
- **Iconography:** Custom Unicode line art and `lucide-react-native` icons.
- **Persistence & Cloud:** Expo SQLite for local offline storage; `@supabase/supabase-js` 2.47.10 for cloud data sync.
- **Testing:** Jest ~30.5.2, ts-jest ^29.4.15.

## 2. State & Data Flow
- UI components communicate strictly through `LearningService`.
- Spaced repetition calculations are executed through `FSRSEngine.scheduleNextReview()`.
- Data portability handles JSON serializations via `exportBackupJSON()` and `importBackupJSON()`.
- Platform fonts fallback safely between iOS (`Georgia`) and Android (`serif`).

