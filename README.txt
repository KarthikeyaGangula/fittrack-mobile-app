# FitTrack - Final Local Test Build

This is the complete local-first FitTrack baseline.

## Included

- Welcome / registration / login / profile
- Workout tracking
- Exercise Library
- Exercise search and images
- Select exercise -> number of sets -> Add to Workout
- Manual exercise creation
- Weight and reps entry
- Individual set completion
- Exercise completion
- Add Set
- Remove Exercise
- Finish Today's Workout
- Immutable workout history snapshots
- Food logging
- Calories / protein / carbs / fat totals
- Delete meals
- Water tracking
- Daily water target
- Progress dashboard calculated from actual local data
- AsyncStorage persistence
- Separate `App.js` and `Styles.js`

## Setup

Place these two files in the same folder as your existing Expo `App.js`:

- App.js
- Styles.js

Make sure AsyncStorage is installed:

```bash
npx expo install @react-native-async-storage/async-storage
```

Then start:

```bash
npx expo start --tunnel -c
```

## Testing checklist

### Workout
1. Add an exercise from the library.
2. Select 3 sets.
3. Enter weight/reps.
4. Complete each set.
5. Complete the exercise.
6. Finish today's workout.
7. Open History and verify the snapshot.

### Manual exercise
1. Return to Workout.
2. Add Exercise Manually.
3. Enter exercise name and set count.
4. Verify generated sets.

### Food
1. Open Food.
2. Add breakfast/lunch/etc.
3. Enter calories and macros.
4. Verify totals.
5. Delete a meal and verify totals change.

### Water
1. Open Water.
2. Add/remove glasses.
3. Reset.
4. Restart the app and verify persistence.

### Progress
Verify workout, exercise, set, food and water numbers update from real data.

## Architecture

This version intentionally uses AsyncStorage rather than a database.

After testing, the next phase can replace the storage layer with a real backend/database without redesigning the user-facing features.
