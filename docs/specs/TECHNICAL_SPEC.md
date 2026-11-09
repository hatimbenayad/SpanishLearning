# TECHNICAL SPECIFICATION

## 1. Technologies & Dependencies
- **Core Platform:** React Native 0.76.7, Expo ~52.0.32, TypeScript 5.3.3.
- **Rendering & Vector Graphics:** `react-native-svg` 15.8.0 for vector illustrations and charts.
- **Iconography:** Custom Unicode line art and `lucide-react-native` icons.
- **Persistence & Cloud:** Expo SQLite for local offline storage; `@supabase/supabase-js` 2.47.10 for cloud data sync.
- **Testing:** Jest 29.7.0, ts-jest 29.2.5.

## 2. State & Data Flow
- UI components communicate strictly through `LearningService`.
- Spaced repetition calculations are executed through `FSRSEngine.scheduleNextReview()`.
- Data portability handles JSON serializations via `exportBackupJSON()` and `importBackupJSON()`.
- Platform fonts fallback safely between iOS (`Georgia`) and Android (`serif`).
