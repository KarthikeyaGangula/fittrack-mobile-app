/**
 * FitTrack - Complete local-first fitness tracker
 * ------------------------------------------------
 * This version is intended to be the stable application baseline for testing
 * before we introduce a database, authentication service, cloud sync, etc.
 *
 * DATA STORAGE
 * - AsyncStorage is used for local persistence only.
 * - User profile, today's workout, workout history, food and water are stored
 *   separately so each module can evolve independently later.
 *
 * MAIN FEATURES
 * - Welcome / Register / Login / Profile
 * - Exercise Library
 * - Select exercise -> number of sets -> Add to Workout
 * - Manual exercise creation
 * - Edit weight and reps
 * - Mark individual sets complete
 * - Complete exercises
 * - Remove exercises
 * - Finish today's workout
 * - Workout history with immutable snapshots
 * - Food catalogue with meal categories and automatic nutrition calculation
 * - Daily water tracking
 * - Calendar-based workout history
 * - Calculated progress dashboard
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./Styles";

// -----------------------------------------------------------------------------
// AsyncStorage keys
// -----------------------------------------------------------------------------
const STORAGE = {
  USER: "fittrack_user",
  WORKOUT: "fittrack_today_workout",
  HISTORY: "fittrack_workout_history",
  FOOD: "fittrack_food",
  WATER: "fittrack_water",
  WEIGHT: "fittrack_body_weight",
};

// -----------------------------------------------------------------------------
// Default user object
// -----------------------------------------------------------------------------
const EMPTY_USER = {
  email: "",
  password: "",
  name: "",
  age: "",
  gender: "",
  weight: "",
  height: "",
};

// -----------------------------------------------------------------------------
// Default exercises shown in the Exercise Library.
// The library is local for now. Later this can come from a database/API.
// -----------------------------------------------------------------------------
const EXERCISE_LIBRARY = [
  {
    id: "push-ups",
    name: "Push-ups",
    category: "Chest",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    instructions: [
      "Start in a high plank with hands slightly wider than shoulders.",
      "Keep your body straight from head to heels.",
      "Lower your chest toward the floor.",
      "Push back up while keeping your core tight.",
    ],
  },
  {
    id: "squats",
    name: "Bodyweight Squats",
    category: "Legs",
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=80",
    instructions: [
      "Stand with feet approximately shoulder-width apart.",
      "Push your hips back and bend your knees.",
      "Keep your chest up and knees aligned with your feet.",
      "Drive through your feet to return to standing.",
    ],
  },
  {
    id: "dumbbell-press",
    name: "Dumbbell Press",
    category: "Chest",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    instructions: [
      "Lie on a bench with a dumbbell in each hand.",
      "Start with the weights near chest level.",
      "Press both dumbbells upward.",
      "Lower them under control and repeat.",
    ],
  },
  {
    id: "plank",
    name: "Plank",
    category: "Core",
    image:
      "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=900&q=80",
    instructions: [
      "Place forearms on the floor with elbows below shoulders.",
      "Extend your legs and keep your body straight.",
      "Brace your core and avoid dropping your hips.",
      "Hold for the desired duration.",
    ],
  },
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    category: "Chest",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
    instructions: ["Lie on a bench with feet stable on the floor.", "Grip the bar slightly wider than shoulder width.", "Lower the bar with control toward the chest.", "Press the bar back up without locking out aggressively."],
  },
  {
    id: "incline-press",
    name: "Incline Dumbbell Press",
    category: "Chest",
    image: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=900&q=80",
    instructions: ["Set the bench to a comfortable incline.", "Start dumbbells at chest level.", "Press upward and slightly inward.", "Lower slowly and repeat."],
  },
  {
    id: "shoulder-press",
    name: "Dumbbell Shoulder Press",
    category: "Shoulders",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
    instructions: ["Sit or stand with dumbbells at shoulder height.", "Brace your core.", "Press the weights overhead.", "Lower under control."],
  },
  {
    id: "lateral-raise",
    name: "Lateral Raises",
    category: "Shoulders",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    instructions: ["Hold light dumbbells at your sides.", "Raise your arms outward to shoulder height.", "Keep a slight bend in the elbows.", "Lower slowly."],
  },
  {
    id: "bicep-curl",
    name: "Bicep Curls",
    category: "Arms",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
    instructions: ["Keep elbows close to your body.", "Curl the dumbbells upward.", "Squeeze the biceps at the top.", "Lower with control."],
  },
  {
    id: "hammer-curl",
    name: "Hammer Curls",
    category: "Arms",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    instructions: ["Keep palms facing inward.", "Curl both dumbbells toward the shoulders.", "Keep the upper arms still.", "Lower under control."],
  },
  {
    id: "tricep-extension",
    name: "Dumbbell Tricep Extension",
    category: "Arms",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
    instructions: ["Hold one dumbbell overhead.", "Bend the elbows to lower the weight behind the head.", "Keep elbows pointing forward.", "Extend the elbows to return."],
  },
  {
    id: "deadlift",
    name: "Deadlift",
    category: "Back / Legs",
    image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=900&q=80",
    instructions: ["Stand with feet under the bar.", "Hinge at the hips and keep the back neutral.", "Drive through the floor to stand tall.", "Lower the weight with control."],
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "Hamstrings",
    image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=900&q=80",
    instructions: ["Hold the weight in front of your thighs.", "Push the hips back while keeping the knees slightly bent.", "Lower until you feel a hamstring stretch.", "Drive hips forward to stand."],
  },
  {
    id: "glute-bridge",
    name: "Glute Bridge",
    category: "Glutes",
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699ded?auto=format&fit=crop&w=900&q=80",
    instructions: ["Lie on your back with knees bent.", "Place feet flat on the floor.", "Drive hips upward while squeezing the glutes.", "Lower slowly."],
  },
  {
    id: "calf-raise",
    name: "Standing Calf Raises",
    category: "Calves",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=80",
    instructions: ["Stand tall with feet hip-width apart.", "Raise your heels as high as comfortable.", "Pause at the top.", "Lower slowly."],
  },
  {
    id: "step-ups",
    name: "Step-ups",
    category: "Legs",
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699ded?auto=format&fit=crop&w=900&q=80",
    instructions: ["Place one foot on a stable platform.", "Drive through that foot to step up.", "Stand tall on the platform.", "Step down carefully and switch sides."],
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    category: "Core / Cardio",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    instructions: ["Start in a high plank.", "Drive one knee toward the chest.", "Switch legs in a controlled rhythm.", "Keep the hips as stable as possible."],
  },
  {
    id: "crunches",
    name: "Crunches",
    category: "Core",
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=900&q=80",
    instructions: ["Lie on your back with knees bent.", "Place hands lightly behind the head.", "Lift the shoulders using the abdominal muscles.", "Lower slowly without pulling on the neck."],
  },
  {
    id: "leg-raise",
    name: "Leg Raises",
    category: "Core",
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=900&q=80",
    instructions: ["Lie flat on your back.", "Keep legs together and straight.", "Raise the legs under control.", "Lower without arching the lower back excessively."],
  },
  {
    id: "burpees",
    name: "Burpees",
    category: "Full Body",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    instructions: ["Start standing.", "Squat down and place hands on the floor.", "Step or jump feet back to a plank.", "Return to standing and jump if appropriate."],
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    category: "Cardio",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=900&q=80",
    instructions: ["Stand with feet together.", "Jump feet apart while raising arms.", "Return to the starting position.", "Maintain a steady rhythm."],
  },
];

// -----------------------------------------------------------------------------
// Local food catalogue for the first testing phase.
// Nutrition values are approximate reference values. The future database phase
// should replace this catalogue with a verified nutrition data source.
// -----------------------------------------------------------------------------
const FOOD_CATALOG = [
  { id: "idli", name: "Idli", unit: "pieces", calories: 58, protein: 2.0, carbs: 12.0, fat: 0.2, gramsPerPiece: 40 },
  { id: "dosa", name: "Plain Dosa", unit: "pieces", calories: 168, protein: 3.9, carbs: 29.0, fat: 4.0, gramsPerPiece: 80 },
  { id: "masala-dosa", name: "Masala Dosa", unit: "pieces", calories: 250, protein: 5.0, carbs: 40.0, fat: 8.0, gramsPerPiece: 150 },
  { id: "chapati", name: "Chapati / Roti", unit: "pieces", calories: 120, protein: 3.5, carbs: 18.0, fat: 3.0, gramsPerPiece: 40 },
  { id: "rice", name: "Cooked Rice", unit: "grams", calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3 },
  { id: "brown-rice", name: "Cooked Brown Rice", unit: "grams", calories: 123, protein: 2.7, carbs: 25.6, fat: 1.0 },
  { id: "chicken", name: "Chicken Breast, Cooked", unit: "grams", calories: 165, protein: 31.0, carbs: 0, fat: 3.6 },
  { id: "egg", name: "Boiled Egg", unit: "pieces", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, gramsPerPiece: 50 },
  { id: "paneer", name: "Paneer", unit: "grams", calories: 265, protein: 18.3, carbs: 6.1, fat: 20.8 },
  { id: "curd", name: "Curd / Yogurt", unit: "grams", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 },
  { id: "milk", name: "Milk", unit: "ml", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { id: "oats", name: "Oats, Dry", unit: "grams", calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  { id: "banana", name: "Banana", unit: "pieces", calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4, gramsPerPiece: 118 },
  { id: "apple", name: "Apple", unit: "pieces", calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, gramsPerPiece: 182 },
  { id: "dal", name: "Cooked Dal", unit: "grams", calories: 116, protein: 9.0, carbs: 20.1, fat: 0.4 },
  { id: "chickpeas", name: "Cooked Chickpeas", unit: "grams", calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6 },
  { id: "peanuts", name: "Peanuts", unit: "grams", calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2 },
  { id: "almonds", name: "Almonds", unit: "grams", calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9 },
  { id: "potato", name: "Boiled Potato", unit: "grams", calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 },
  { id: "sweet-potato", name: "Sweet Potato", unit: "grams", calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 },
  { id: "roti", name: "Whole Wheat Roti", unit: "pieces", calories: 120, protein: 3.5, carbs: 18.0, fat: 3.0, gramsPerPiece: 40 },
  { id: "sambar", name: "Sambar", unit: "grams", calories: 70, protein: 3.5, carbs: 10.0, fat: 2.0 },
  { id: "coconut-chutney", name: "Coconut Chutney", unit: "grams", calories: 240, protein: 3.0, carbs: 8.0, fat: 22.0 },
  { id: "peanut-chutney", name: "Peanut Chutney", unit: "grams", calories: 290, protein: 10.0, carbs: 12.0, fat: 23.0 },
  { id: "tomato-chutney", name: "Tomato Chutney", unit: "grams", calories: 90, protein: 1.5, carbs: 12.0, fat: 4.0 },
  { id: "vegetable-curry", name: "Mixed Vegetable Curry", unit: "grams", calories: 110, protein: 3.0, carbs: 12.0, fat: 5.5 },
  { id: "chicken-curry", name: "Chicken Curry", unit: "grams", calories: 180, protein: 20.0, carbs: 5.0, fat: 9.0 },
  { id: "fish-curry", name: "Fish Curry", unit: "grams", calories: 150, protein: 18.0, carbs: 5.0, fat: 6.0 },
  { id: "vegetable-pulao", name: "Vegetable Pulao", unit: "grams", calories: 170, protein: 3.5, carbs: 27.0, fat: 5.0 },
  { id: "biryani", name: "Chicken Biryani", unit: "grams", calories: 200, protein: 10.0, carbs: 25.0, fat: 7.0 },
  { id: "upma", name: "Upma", unit: "grams", calories: 150, protein: 4.0, carbs: 24.0, fat: 4.5 },
  { id: "poha", name: "Poha", unit: "grams", calories: 180, protein: 3.5, carbs: 32.0, fat: 4.0 },
  { id: "pongal", name: "Ven Pongal", unit: "grams", calories: 180, protein: 4.5, carbs: 27.0, fat: 6.0 },
  { id: "vegetable-soup", name: "Vegetable Soup", unit: "ml", calories: 45, protein: 2.0, carbs: 7.0, fat: 1.0 },
  { id: "coffee-milk", name: "Coffee with Milk", unit: "ml", calories: 55, protein: 2.5, carbs: 7.0, fat: 2.0 },
  { id: "tea-milk", name: "Tea with Milk", unit: "ml", calories: 50, protein: 2.0, carbs: 7.0, fat: 1.8 },
  { id: "orange", name: "Orange", unit: "pieces", calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, gramsPerPiece: 130 },
  { id: "mango", name: "Mango", unit: "grams", calories: 60, protein: 0.8, carbs: 15.0, fat: 0.4 },
  { id: "guava", name: "Guava", unit: "grams", calories: 68, protein: 2.6, carbs: 14.3, fat: 1.0 },
  { id: "dates", name: "Dates", unit: "pieces", calories: 20, protein: 0.2, carbs: 5.3, fat: 0.0, gramsPerPiece: 8 },
];

const MEAL_TYPES = ["Breakfast", "Mid-Morning Snack", "Lunch", "Evening Snack", "Dinner"];

// -----------------------------------------------------------------------------
// Small utility functions
// -----------------------------------------------------------------------------

/** Returns a stable YYYY-MM-DD key for the current local day. */
const getTodayKey = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Creates a readable date such as "23 Sep 2026". */
const formatDate = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/** Creates one new empty set. */
const createEmptySet = () => ({
  weight: "",
  reps: "",
  completed: false,
});

/** Creates an exercise object with the requested number of sets. */
const createWorkoutExercise = (exercise, setCount) => ({
  id: `${exercise.id || "custom"}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`,
  name: exercise.name,
  category: exercise.category || "Custom",
  image: exercise.image || null,
  completed: false,
  sets: Array.from({ length: setCount }, createEmptySet),
});

/** Converts any numeric food value safely to a number. */
const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// -----------------------------------------------------------------------------
// Main application component
// -----------------------------------------------------------------------------
export default function App() {
  // ---------------------------------------------------------------------------
  // Navigation / screen state
  // ---------------------------------------------------------------------------
  const [screen, setScreen] = useState("welcome");
  const [activeTab, setActiveTab] = useState("workout");

  // ---------------------------------------------------------------------------
  // User profile
  // ---------------------------------------------------------------------------
  const [user, setUser] = useState(EMPTY_USER);

  // ---------------------------------------------------------------------------
  // Workout state
  // ---------------------------------------------------------------------------
  const [workouts, setWorkouts] = useState([]);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState({});

  // ---------------------------------------------------------------------------
  // Exercise Library state
  // ---------------------------------------------------------------------------
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [librarySetCount, setLibrarySetCount] = useState("3");

  // ---------------------------------------------------------------------------
  // Manual exercise state
  // ---------------------------------------------------------------------------
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseSets, setNewExerciseSets] = useState("3");

  // ---------------------------------------------------------------------------
  // Food state
  // ---------------------------------------------------------------------------
  const [meals, setMeals] = useState([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealType, setMealType] = useState("Meal");
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [mealCarbs, setMealCarbs] = useState("");
  const [mealFat, setMealFat] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState(FOOD_CATALOG[0].id);
  const [foodQuantityUnit, setFoodQuantityUnit] = useState(FOOD_CATALOG[0].unit);
  const [foodQuantity, setFoodQuantity] = useState("1");
  const [showMealTypeOptions, setShowMealTypeOptions] = useState(false);
  const [showFoodOptions, setShowFoodOptions] = useState(false);
  const [showQuantityUnitOptions, setShowQuantityUnitOptions] = useState(false);
  const [mealDraftItems, setMealDraftItems] = useState([]);

  // ---------------------------------------------------------------------------
  // Calendar / history state
  // ---------------------------------------------------------------------------
  const [historyMonth, setHistoryMonth] = useState(new Date());
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(getTodayKey());

  // ---------------------------------------------------------------------------
  // Water state
  // Water is stored by date, allowing the app to reset naturally each day.
  // ---------------------------------------------------------------------------
  const [waterByDate, setWaterByDate] = useState({});

  // Daily body-weight log. Keyed by YYYY-MM-DD so the graph can show trends.
  const [bodyWeightByDate, setBodyWeightByDate] = useState({});
  const [bodyWeightInput, setBodyWeightInput] = useState("");
  const todayKey = getTodayKey();
  const water = waterByDate[todayKey] || 0;
  const waterTarget = 8;

  // ---------------------------------------------------------------------------
  // Initial data loading
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [
          savedUser,
          savedWorkout,
          savedHistory,
          savedFood,
          savedWater,
          savedWeight,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE.USER),
          AsyncStorage.getItem(STORAGE.WORKOUT),
          AsyncStorage.getItem(STORAGE.HISTORY),
          AsyncStorage.getItem(STORAGE.FOOD),
          AsyncStorage.getItem(STORAGE.WATER),
          AsyncStorage.getItem(STORAGE.WEIGHT),
        ]);

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        if (savedWorkout) {
          const workoutData = JSON.parse(savedWorkout);

          // Ignore an old workout from a previous day.
          if (workoutData.date === getTodayKey()) {
            setWorkouts(workoutData.workouts || []);
            setWorkoutFinished(Boolean(workoutData.finished));
          }
        }

        if (savedHistory) {
          setWorkoutHistory(JSON.parse(savedHistory));
        }

        if (savedFood) {
          setMeals(JSON.parse(savedFood));
        }

        if (savedWater) {
          setWaterByDate(JSON.parse(savedWater));
        }

        if (savedWeight) {
          setBodyWeightByDate(JSON.parse(savedWeight));
          setBodyWeightInput(String(JSON.parse(savedWeight)[getTodayKey()] || ""));
        }
      } catch (error) {
        console.log("FitTrack load error:", error);
      }
    };

    loadAllData();
  }, []);

  // ---------------------------------------------------------------------------
  // Persistence effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    AsyncStorage.setItem(STORAGE.USER, JSON.stringify(user)).catch((error) =>
      console.log("User save error:", error)
    );
  }, [user]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE.WORKOUT,
      JSON.stringify({
        date: getTodayKey(),
        workouts,
        finished: workoutFinished,
      })
    ).catch((error) => console.log("Workout save error:", error));
  }, [workouts, workoutFinished]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE.HISTORY,
      JSON.stringify(workoutHistory)
    ).catch((error) => console.log("History save error:", error));
  }, [workoutHistory]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE.FOOD, JSON.stringify(meals)).catch((error) =>
      console.log("Food save error:", error)
    );
  }, [meals]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE.WATER,
      JSON.stringify(waterByDate)
    ).catch((error) => console.log("Water save error:", error));
  }, [waterByDate]);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE.WEIGHT,
      JSON.stringify(bodyWeightByDate)
    ).catch((error) => console.log("Weight save error:", error));
  }, [bodyWeightByDate]);

  // ---------------------------------------------------------------------------
  // Profile helpers
  // ---------------------------------------------------------------------------

  const updateUser = (field, value) => {
    setUser((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const completeProfile = () => {
    if (!user.name.trim()) {
      Alert.alert("Profile", "Please enter your name.");
      return;
    }

    setScreen("home");
  };

  const login = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE.USER);

      if (!saved) {
        Alert.alert(
          "No account found",
          "Please create your FitTrack account first."
        );
        return;
      }

      const savedUser = JSON.parse(saved);

      if (
        user.email.trim().toLowerCase() !==
          String(savedUser.email || "").trim().toLowerCase() ||
        user.password !== savedUser.password
      ) {
        Alert.alert("Login failed", "Email or password is incorrect.");
        return;
      }

      setUser(savedUser);
      setScreen("home");
    } catch (error) {
      Alert.alert("Login error", "Unable to load your local profile.");
    }
  };

  const logout = () => {
    setShowExerciseLibrary(false);
    setSelectedExercise(null);
    setScreen("welcome");
  };

  // ---------------------------------------------------------------------------
  // Workout helpers
  // ---------------------------------------------------------------------------

  /**
   * Any change to today's workout makes the current session active again.
   * This prevents a user from changing a completed workout and accidentally
   * leaving it marked as finished.
   */
  const reopenWorkout = () => {
    setWorkoutFinished(false);
  };

  const updateSet = (workoutId, setIndex, field, value) => {
    reopenWorkout();

    setWorkouts((current) =>
      current.map((workout) => {
        if (workout.id !== workoutId) return workout;

        const updatedSets = workout.sets.map((set, index) =>
          index === setIndex
            ? {
                ...set,
                [field]: value,
                // Editing a completed set reopens that set.
                ...(field !== "completed" ? { completed: false } : {}),
              }
            : set
        );

        return {
          ...workout,
          sets: updatedSets,
          completed: updatedSets.every((set) => set.completed),
        };
      })
    );
  };

  const toggleSetCompleted = (workoutId, setIndex) => {
    reopenWorkout();

    setWorkouts((current) =>
      current.map((workout) => {
        if (workout.id !== workoutId) return workout;

        const updatedSets = workout.sets.map((set, index) =>
          index === setIndex
            ? { ...set, completed: !set.completed }
            : set
        );

        return {
          ...workout,
          sets: updatedSets,
          completed: updatedSets.length > 0 &&
            updatedSets.every((set) => set.completed),
        };
      })
    );
  };

  const addSet = (workoutId) => {
    reopenWorkout();

    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              completed: false,
              sets: [...workout.sets, createEmptySet()],
            }
          : workout
      )
    );
  };

  const completeExercise = (workoutId) => {
    reopenWorkout();

    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              completed: true,
              sets: workout.sets.map((set) => ({
                ...set,
                completed: true,
              })),
            }
          : workout
      )
    );
  };

  const toggleExerciseIncomplete = (workoutId) => {
    reopenWorkout();

    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              completed: false,
              sets: workout.sets.map((set) => ({
                ...set,
                completed: false,
              })),
            }
          : workout
      )
    );
  };

  const removeExercise = (workoutId) => {
    const exercise = workouts.find((item) => item.id === workoutId);
    if (!exercise) return;

    Alert.alert(
      "Remove Exercise",
      `Remove ${exercise.name} from today's workout?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            reopenWorkout();
            setWorkouts((current) =>
              current.filter((item) => item.id !== workoutId)
            );
          },
        },
      ]
    );
  };

  const addExerciseToWorkout = (exercise, setCount) => {
    const count = Number(setCount);

    if (!Number.isInteger(count) || count < 1 || count > 20) {
      Alert.alert("Sets", "Please enter between 1 and 20 sets.");
      return;
    }

    const newWorkout = createWorkoutExercise(exercise, count);

    reopenWorkout();
    setWorkouts((current) => [...current, newWorkout]);

    setSelectedExercise(null);
    setLibrarySetCount("3");
    setShowExerciseLibrary(false);
    setActiveTab("workout");
  };

  const addManualExercise = () => {
    const name = newExerciseName.trim();
    const count = Number(newExerciseSets);

    if (!name) {
      Alert.alert("Exercise", "Please enter an exercise name.");
      return;
    }

    if (!Number.isInteger(count) || count < 1 || count > 20) {
      Alert.alert("Sets", "Please enter between 1 and 20 sets.");
      return;
    }

    addExerciseToWorkout(
      {
        id: `custom-${Date.now()}`,
        name,
        category: "Custom",
        image: null,
      },
      count
    );

    setNewExerciseName("");
    setNewExerciseSets("3");
    setShowAddExercise(false);
  };

  /**
   * Finishing a workout creates an immutable snapshot.
   * Future edits to today's workout won't alter the historical record.
   */
  const finishWorkout = () => {
    if (workouts.length === 0) {
      Alert.alert("Workout", "Add at least one exercise first.");
      return;
    }

    const incomplete = workouts.filter((workout) => !workout.completed);

    if (incomplete.length > 0) {
      Alert.alert(
        "Workout not complete",
        `Complete all exercises first. ${incomplete.length} exercise(s) are still incomplete.`
      );
      return;
    }

    const date = getTodayKey();

    const snapshot = JSON.parse(JSON.stringify(workouts));

    setWorkoutHistory((current) => ({
      ...current,
      [date]: {
        date,
        completedAt: new Date().toISOString(),
        exercises: snapshot,
      },
    }));

    setWorkoutFinished(true);

    Alert.alert("Workout Complete", "Today's workout has been saved to History.");
  };

  // ---------------------------------------------------------------------------
  // Derived dashboard data / remaining action helpers
  // ---------------------------------------------------------------------------

  const todaysMeals = meals.filter((meal) => meal.date === getTodayKey());

  const nutritionTotals = todaysMeals.reduce(
    (total, meal) => ({
      calories: total.calories + numberValue(meal.calories),
      protein: total.protein + numberValue(meal.protein),
      carbs: total.carbs + numberValue(meal.carbs),
      fat: total.fat + numberValue(meal.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const completedWorkoutSessions = Object.values(workoutHistory).filter(Boolean);
  const progress = {
    completedWorkouts: completedWorkoutSessions.length,
    completedExercises: completedWorkoutSessions.reduce(
      (sum, session) => sum + (session.exercises || []).filter((exercise) => exercise.completed).length,
      0
    ),
    completedSets: completedWorkoutSessions.reduce(
      (sum, session) =>
        sum + (session.exercises || []).reduce(
          (exerciseSum, exercise) => exerciseSum + (exercise.sets || []).filter((set) => set.completed).length,
          0
        ),
      0
    ),
    totalWater: Object.values(waterByDate).reduce((sum, value) => sum + numberValue(value), 0),
    todayWorkoutExercises: workouts.length,
    todayCompletedExercises: workouts.filter((exercise) => exercise.completed).length,
    todayMeals: todaysMeals.length,
  };

  const weightEntries = Object.keys(bodyWeightByDate)
    .filter((date) => numberValue(bodyWeightByDate[date]) > 0)
    .sort()
    .map((date) => ({ date, weight: numberValue(bodyWeightByDate[date]) }));
  const recentWeightEntries = weightEntries.slice(-14);
  const weightValues = recentWeightEntries.map((entry) => entry.weight);
  const weightMin = weightValues.length ? Math.min(...weightValues) : 0;
  const weightMax = weightValues.length ? Math.max(...weightValues) : 1;
  const weightRange = Math.max(weightMax - weightMin, 0.5);

  const saveTodayBodyWeight = () => {
    const weight = numberValue(bodyWeightInput);
    if (weight <= 0 || weight > 500) {
      Alert.alert("Body Weight", "Please enter a valid weight in kg.");
      return;
    }

    setBodyWeightByDate((current) => ({
      ...current,
      [getTodayKey()]: weight,
    }));
    Alert.alert("Body Weight Saved", `${weight.toFixed(1)} kg logged for today.`);
  };

  const deleteMeal = (mealId) => {
    Alert.alert("Delete Meal", "Remove this meal from today's log?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setMeals((current) => current.filter((meal) => meal.id !== mealId)),
      },
    ]);
  };

  const addWater = (amount = 1) => {
    setWaterByDate((current) => ({
      ...current,
      [getTodayKey()]: Math.max(0, numberValue(current[getTodayKey()]) + amount),
    }));
  };

  const resetTodayWater = () => {
    setWaterByDate((current) => ({
      ...current,
      [getTodayKey()]: 0,
    }));
  };

  // ---------------------------------------------------------------------------
  // Render: Workout tab
  // ---------------------------------------------------------------------------
  const renderWorkoutTab = () => {
    const completedCount = workouts.filter((workout) => workout.completed).length;

    return (
      <View>
        <Text style={styles.sectionTitle}>Today's Workout 🏋️</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{completedCount} / {workouts.length}</Text>
          <Text style={styles.summaryLabel}>Exercises Completed</Text>
        </View>

        {workoutFinished && (
          <View style={styles.successCard}>
            <Text style={styles.successText}>✓ Today's workout is saved to History.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowExerciseLibrary(true)}>
          <Text style={styles.secondaryButtonText}>📚 Browse Exercise Library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setShowAddExercise((current) => !current)}>
          <Text style={styles.buttonText}>+ Add Custom Exercise</Text>
        </TouchableOpacity>

        {showAddExercise && (
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Add Custom Exercise</Text>
            <Text style={styles.inputLabel}>Exercise Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Cable Row" placeholderTextColor="#6B7280" value={newExerciseName} onChangeText={setNewExerciseName} />
            <Text style={styles.inputLabel}>Number of Sets</Text>
            <TextInput style={styles.input} placeholder="3" placeholderTextColor="#6B7280" keyboardType="numeric" value={newExerciseSets} onChangeText={setNewExerciseSets} />
            <TouchableOpacity style={styles.primaryButton} onPress={addManualExercise}>
              <Text style={styles.buttonText}>Add Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowAddExercise(false)}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {workouts.length === 0 ? (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>No exercises added yet</Text>
            <Text style={styles.itemText}>Browse the Exercise Library or add a custom exercise to start today's workout.</Text>
          </View>
        ) : (
          workouts.map((workout) => (
            <View style={styles.itemCard} key={workout.id}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseTitleText}>
                  <Text style={styles.itemTitle}>{workout.name}</Text>
                  <Text style={styles.itemText}>{workout.category || "Custom"}</Text>
                </View>
                {workout.completed && <Text style={styles.completedLabel}>✓ Completed</Text>}
              </View>

              <View style={styles.setFieldHeaderRow}>
                <Text style={styles.setFieldHeaderSpacer}>Set</Text>
                <Text style={styles.setFieldHeaderLabel}>Weight (kg)</Text>
                <Text style={styles.setFieldHeaderLabel}>Reps</Text>
                <Text style={styles.setFieldHeaderSpacer}>Done</Text>
              </View>

              {(workout.sets || []).map((set, index) => (
                <View style={styles.setRow} key={`${workout.id}-set-${index}`}>
                  <Text style={styles.setLabel}>Set {index + 1}</Text>
                  <TextInput style={styles.setInput} placeholder="Weight" placeholderTextColor="#6B7280" keyboardType="decimal-pad" value={String(set.weight ?? "")} onChangeText={(value) => updateSet(workout.id, index, "weight", value)} />
                  <TextInput style={styles.setInput} placeholder="Reps" placeholderTextColor="#6B7280" keyboardType="numeric" value={String(set.reps ?? "")} onChangeText={(value) => updateSet(workout.id, index, "reps", value)} />
                  <TouchableOpacity style={[styles.setCompleteButton, set.completed && styles.setCompleteButtonActive]} onPress={() => toggleSetCompleted(workout.id, index)}>
                    <Text style={styles.setCompleteButtonText}>{set.completed ? "✓" : "○"}</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.smallButton} onPress={() => addSet(workout.id)}>
                  <Text style={styles.smallButtonText}>+ Add Set</Text>
                </TouchableOpacity>
                {workout.completed ? (
                  <TouchableOpacity style={styles.smallButton} onPress={() => toggleExerciseIncomplete(workout.id)}>
                    <Text style={styles.smallButtonText}>Mark Incomplete</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.smallButton} onPress={() => completeExercise(workout.id)}>
                    <Text style={styles.smallButtonText}>Complete Exercise</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.smallButton} onPress={() => removeExercise(workout.id)}>
                  <Text style={styles.smallButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {workouts.length > 0 && (
          <TouchableOpacity style={styles.primaryButton} onPress={finishWorkout}>
            <Text style={styles.buttonText}>{workoutFinished ? "Workout Saved ✓" : "Finish Today's Workout"}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // ---------------------------------------------------------------------------
  // Render: Exercise library
  // ---------------------------------------------------------------------------
  const renderExerciseLibrary = () => {
    const filteredExercises = EXERCISE_LIBRARY.filter((exercise) =>
      `${exercise.name} ${exercise.category}`.toLowerCase().includes(exerciseSearch.trim().toLowerCase())
    );

    if (selectedExercise) {
      return (
        <View>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setSelectedExercise(null)}>
            <Text style={styles.secondaryButtonText}>← Back to Exercise Library</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>{selectedExercise.name}</Text>
          {selectedExercise.image && <Image source={{ uri: selectedExercise.image }} style={styles.libraryDetailImage} />}
          <Text style={styles.itemText}>Category: {selectedExercise.category}</Text>
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>Instructions</Text>
            {selectedExercise.instructions.map((instruction, index) => <Text style={styles.itemText} key={index}>{index + 1}. {instruction}</Text>)}
          </View>
          <Text style={styles.inputLabel}>Number of Sets</Text>
          <TextInput style={styles.input} placeholder="3" placeholderTextColor="#6B7280" keyboardType="numeric" value={librarySetCount} onChangeText={setLibrarySetCount} />
          <TouchableOpacity style={styles.primaryButton} onPress={() => addExerciseToWorkout(selectedExercise, librarySetCount)}>
            <Text style={styles.buttonText}>Add to Today's Workout</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Exercise Library 📚</Text>
          <TouchableOpacity onPress={() => { setShowExerciseLibrary(false); setSelectedExercise(null); }}><Text style={styles.deleteText}>Close</Text></TouchableOpacity>
        </View>
        <TextInput style={styles.input} placeholder="Search exercises..." placeholderTextColor="#6B7280" value={exerciseSearch} onChangeText={setExerciseSearch} />
        {filteredExercises.map((exercise) => (
          <TouchableOpacity style={styles.libraryCard} key={exercise.id} onPress={() => setSelectedExercise(exercise)}>
            {exercise.image && <Image source={{ uri: exercise.image }} style={styles.libraryImage} />}
            <View style={styles.libraryCardContent}>
              <Text style={styles.itemTitle}>{exercise.name}</Text>
              <Text style={styles.itemText}>{exercise.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ---------------------------------------------------------------------------
  // Render: Water tab
  // ---------------------------------------------------------------------------
  const renderWaterTab = () => {
    const percentage = Math.min(100, Math.round((water / waterTarget) * 100));
    return (
      <View>
        <Text style={styles.sectionTitle}>Water Intake 💧</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{water} / {waterTarget}</Text>
          <Text style={styles.summaryLabel}>Glasses today</Text>
          <Text style={styles.itemText}>{percentage}% of daily target</Text>
        </View>
        <View style={styles.waterProgressTrack}>
          <View style={[styles.waterProgressFill, { width: `${percentage}%` }]} />
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={() => addWater(1)}>
          <Text style={styles.buttonText}>+ Add 1 Glass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => addWater(2)}>
          <Text style={styles.secondaryButtonText}>+ Add 2 Glasses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetTodayWater}>
          <Text style={styles.secondaryButtonText}>Reset Today's Water</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ---------------------------------------------------------------------------
  // Food helpers
  // ---------------------------------------------------------------------------

  const calculateFoodNutrition = (food, unit, quantity) => {
    const qty = numberValue(quantity);
    if (!food || qty <= 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    if (unit === "pieces") {
      return {
        calories: food.calories * qty,
        protein: food.protein * qty,
        carbs: food.carbs * qty,
        fat: food.fat * qty,
      };
    }

    const per100 =
      food.unit === "pieces"
        ? {
            calories: (food.calories / food.gramsPerPiece) * 100,
            protein: (food.protein / food.gramsPerPiece) * 100,
            carbs: (food.carbs / food.gramsPerPiece) * 100,
            fat: (food.fat / food.gramsPerPiece) * 100,
          }
        : food;

    return {
      calories: (per100.calories * qty) / 100,
      protein: (per100.protein * qty) / 100,
      carbs: (per100.carbs * qty) / 100,
      fat: (per100.fat * qty) / 100,
    };
  };

  const selectedFood = FOOD_CATALOG.find((food) => food.id === selectedFoodId) || FOOD_CATALOG[0];
  const foodPreview = calculateFoodNutrition(selectedFood, foodQuantityUnit, foodQuantity);

  const addFoodItemToMeal = () => {
    const food = FOOD_CATALOG.find((item) => item.id === selectedFoodId);
    const quantity = numberValue(foodQuantity);

    if (!food) {
      Alert.alert("Food", "Please select a food item.");
      return;
    }
    if (quantity <= 0) {
      Alert.alert("Quantity", "Please enter a quantity greater than 0.");
      return;
    }

    const nutrition = calculateFoodNutrition(food, foodQuantityUnit, quantity);
    setMealDraftItems((current) => [
      ...current,
      {
        id: `food-item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        foodId: food.id,
        name: food.name,
        quantity,
        quantityUnit: foodQuantityUnit,
        ...nutrition,
      },
    ]);

    setSelectedFoodId(FOOD_CATALOG[0].id);
    setFoodQuantityUnit(FOOD_CATALOG[0].unit);
    setFoodQuantity("1");
    setShowFoodOptions(false);
    setShowQuantityUnitOptions(false);
  };

  const removeDraftFoodItem = (itemId) => {
    setMealDraftItems((current) => current.filter((item) => item.id !== itemId));
  };

  const saveMeal = () => {
    if (!mealDraftItems.length) {
      Alert.alert("Food", "Add at least one food item to this meal.");
      return;
    }

    const totals = mealDraftItems.reduce(
      (total, item) => ({
        calories: total.calories + numberValue(item.calories),
        protein: total.protein + numberValue(item.protein),
        carbs: total.carbs + numberValue(item.carbs),
        fat: total.fat + numberValue(item.fat),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    setMeals((current) => [
      ...current,
      {
        id: `meal-${Date.now()}`,
        date: getTodayKey(),
        type: mealType.trim() || "Meal",
        items: mealDraftItems,
        ...totals,
      },
    ]);

    cancelMealDraft();
    setMealType("Breakfast");
  };

  const cancelMealDraft = () => {
    setMealDraftItems([]);
    setShowAddMeal(false);
    setShowMealTypeOptions(false);
    setShowFoodOptions(false);
    setShowQuantityUnitOptions(false);
  };

  const getCalendarDays = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i += 1) days.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      days.push({
        day,
        key: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      });
    }
    return days;
  };

  const changeHistoryMonth = (amount) => {
    setHistoryMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  };

  // ---------------------------------------------------------------------------
  // Render: Food tab
  // -----------------------------------------------------------------------------
  const renderFoodTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Today's Food 🍎</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>{Math.round(nutritionTotals.calories)}</Text>
        <Text style={styles.summaryLabel}>Calories consumed today</Text>
        <View style={styles.macroGrid}>
          <View style={styles.macroBox}><Text style={styles.macroValue}>{Math.round(nutritionTotals.protein)}g</Text><Text style={styles.macroLabel}>Protein</Text></View>
          <View style={styles.macroBox}><Text style={styles.macroValue}>{Math.round(nutritionTotals.carbs)}g</Text><Text style={styles.macroLabel}>Carbs</Text></View>
          <View style={styles.macroBox}><Text style={styles.macroValue}>{Math.round(nutritionTotals.fat)}g</Text><Text style={styles.macroLabel}>Fat</Text></View>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => setShowAddMeal((current) => !current)}>
        <Text style={styles.buttonText}>+ Add Food / Meal</Text>
      </TouchableOpacity>

      {showAddMeal && (
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Build a Meal</Text>
          <Text style={styles.itemText}>Add multiple foods to one meal. Example: Idli + Sambar + Coconut Chutney.</Text>

          <Text style={styles.inputLabel}>Meal Type</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowMealTypeOptions((current) => !current)}>
            <Text style={styles.dropdownButtonText}>{mealType}</Text><Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {showMealTypeOptions && (
            <View style={styles.dropdownList}>
              {MEAL_TYPES.map((type) => (
                <TouchableOpacity key={type} style={styles.dropdownOption} onPress={() => { setMealType(type); setShowMealTypeOptions(false); }}>
                  <Text style={styles.dropdownOptionText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.inputLabel}>Food Name</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowFoodOptions((current) => !current)}>
            <Text style={styles.dropdownButtonText}>{selectedFood.name}</Text><Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {showFoodOptions && (
            <View style={styles.dropdownListTall}>
              {FOOD_CATALOG.map((food) => (
                <TouchableOpacity key={food.id} style={styles.dropdownOption} onPress={() => {
                  setSelectedFoodId(food.id);
                  setFoodQuantityUnit(food.unit);
                  setFoodQuantity(food.unit === "pieces" ? "1" : "100");
                  setShowFoodOptions(false);
                }}>
                  <Text style={styles.dropdownOptionText}>{food.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.inputLabel}>Quantity Unit</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowQuantityUnitOptions((current) => !current)}>
            <Text style={styles.dropdownButtonText}>{foodQuantityUnit === "pieces" ? "Pieces" : foodQuantityUnit === "ml" ? "Millilitres (ml)" : "Grams (g)"}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {showQuantityUnitOptions && (
            <View style={styles.dropdownList}>
              {selectedFood.unit === "pieces" && (
                <TouchableOpacity style={styles.dropdownOption} onPress={() => { setFoodQuantityUnit("pieces"); setShowQuantityUnitOptions(false); }}>
                  <Text style={styles.dropdownOptionText}>Pieces</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.dropdownOption} onPress={() => {
                setFoodQuantityUnit(selectedFood.unit === "ml" ? "ml" : "grams");
                setFoodQuantity(selectedFood.unit === "pieces" ? "100" : foodQuantity);
                setShowQuantityUnitOptions(false);
              }}>
                <Text style={styles.dropdownOptionText}>{selectedFood.unit === "ml" ? "Millilitres (ml)" : "Grams (g)"}</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.inputLabel}>Quantity</Text>
          <TextInput style={styles.input} placeholder={foodQuantityUnit === "pieces" ? "Enter number of pieces" : "Enter quantity"} placeholderTextColor="#6B7280" keyboardType="numeric" value={foodQuantity} onChangeText={setFoodQuantity} />

          <View style={styles.foodPreviewCard}>
            <Text style={styles.cardTitle}>This Food Nutrition</Text>
            <Text style={styles.itemText}>Calories: {Math.round(foodPreview.calories)} kcal</Text>
            <Text style={styles.itemText}>Protein: {foodPreview.protein.toFixed(1)} g · Carbs: {foodPreview.carbs.toFixed(1)} g · Fat: {foodPreview.fat.toFixed(1)} g</Text>
          </View>

          <TouchableOpacity style={styles.secondaryButton} onPress={addFoodItemToMeal}>
            <Text style={styles.secondaryButtonText}>+ Add This Food to Meal</Text>
          </TouchableOpacity>

          {mealDraftItems.length > 0 && (
            <View style={styles.mealDraftCard}>
              <Text style={styles.cardTitle}>Foods in {mealType}</Text>
              {mealDraftItems.map((item) => (
                <View style={styles.mealDraftRow} key={item.id}>
                  <View style={styles.exerciseTitleText}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemText}>{item.quantity} {item.quantityUnit} · {Math.round(item.calories)} kcal</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeDraftFoodItem(item.id)}>
                    <Text style={styles.deleteText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={saveMeal}>
            <Text style={styles.buttonText}>Save Complete Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={cancelMealDraft}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {todaysMeals.length === 0 ? (
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>No food logged today</Text>
          <Text style={styles.itemText}>Build a meal and add as many food items as needed.</Text>
        </View>
      ) : (
        todaysMeals.map((meal) => (
          <View style={styles.itemCard} key={meal.id}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.exerciseTitleText}>
                <Text style={styles.itemTitle}>{meal.type}</Text>
                {(meal.items || [{ name: meal.name, quantity: meal.quantity, quantityUnit: meal.quantityUnit, calories: meal.calories }]).map((item, index) => (
                  <Text style={styles.itemText} key={`${meal.id}-item-${index}`}>• {item.name} — {item.quantity} {item.quantityUnit}</Text>
                ))}
                <Text style={styles.itemText}>Total: {Math.round(meal.calories)} kcal · Protein {numberValue(meal.protein).toFixed(1)}g · Carbs {numberValue(meal.carbs).toFixed(1)}g · Fat {numberValue(meal.fat).toFixed(1)}g</Text>
              </View>
              <TouchableOpacity onPress={() => deleteMeal(meal.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );

  // -----------------------------------------------------------------------------
  const renderHistoryTab = () => {
    const selectedSession = workoutHistory[selectedHistoryDate];
    const calendarDays = getCalendarDays(historyMonth);
    const monthTitle = historyMonth.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });

    return (
      <View>
        <Text style={styles.sectionTitle}>Workout History 📅</Text>

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity style={styles.calendarNavButton} onPress={() => changeHistoryMonth(-1)}>
              <Text style={styles.calendarNavText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.calendarMonthTitle}>{monthTitle}</Text>
            <TouchableOpacity style={styles.calendarNavButton} onPress={() => changeHistoryMonth(1)}>
              <Text style={styles.calendarNavText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarWeekRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text style={styles.calendarWeekText} key={day}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((date, index) => {
              if (!date) return <View style={styles.calendarDayEmpty} key={`empty-${index}`} />;

              const hasWorkout = Boolean(workoutHistory[date.key]);
              const isSelected = selectedHistoryDate === date.key;
              const isToday = date.key === getTodayKey();

              return (
                <TouchableOpacity
                  key={date.key}
                  style={[
                    styles.calendarDay,
                    hasWorkout && styles.calendarDayWithWorkout,
                    isSelected && styles.calendarDaySelected,
                  ]}
                  onPress={() => setSelectedHistoryDate(date.key)}
                >
                  <Text style={[
                    styles.calendarDayText,
                    hasWorkout && styles.calendarWorkoutDayText,
                    isSelected && styles.calendarSelectedText,
                  ]}>{date.day}</Text>
                  {hasWorkout && <View style={styles.calendarDot} />}
                  {isToday && <Text style={styles.calendarTodayLabel}>Today</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.selectedDateCard}>
          <Text style={styles.cardTitle}>{formatDate(selectedHistoryDate)}</Text>
          {selectedSession ? (
            <Text style={styles.itemText}>
              Workout completed: {formatDate(selectedHistoryDate)}
            </Text>
          ) : (
            <Text style={styles.itemText}>No completed workout recorded for this date.</Text>
          )}
        </View>

        {selectedSession ? (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>Workout Details</Text>
            <Text style={styles.itemText}>
              Exercises: {(selectedSession.exercises || []).length}
            </Text>

            {(selectedSession.exercises || []).map((exercise) => (
              <View style={styles.historyExercise} key={exercise.id}>
                <Text style={styles.historyExerciseTitle}>✓ {exercise.name}</Text>
                {(exercise.sets || []).map((set, index) => (
                  <Text style={styles.itemText} key={`${exercise.id}-history-${index}`}>
                    Set {index + 1}: {set.weight || 0} kg × {set.reps || 0} reps
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setSelectedHistoryDate(getTodayKey());
            setHistoryMonth(new Date());
          }}
        >
          <Text style={styles.secondaryButtonText}>Jump to Today</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ---------------------------------------------------------------------------
  // Render: Progress tab
  // ---------------------------------------------------------------------------
  const renderProgressTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Your Progress 📈</Text>

      <View style={styles.progressGrid}>
        <View style={styles.progressCard}><Text style={styles.progressNumber}>{progress.completedWorkouts}</Text><Text style={styles.progressLabel}>Workouts</Text></View>
        <View style={styles.progressCard}><Text style={styles.progressNumber}>{progress.completedExercises}</Text><Text style={styles.progressLabel}>Exercises</Text></View>
        <View style={styles.progressCard}><Text style={styles.progressNumber}>{progress.completedSets}</Text><Text style={styles.progressLabel}>Sets</Text></View>
        <View style={styles.progressCard}><Text style={styles.progressNumber}>{progress.totalWater}</Text><Text style={styles.progressLabel}>Glasses logged</Text></View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>Daily Body Weight ⚖️</Text>
        <Text style={styles.itemText}>Log your weight each day to build a personal trend graph.</Text>
        <Text style={styles.inputLabel}>Today's Weight (kg)</Text>
        <TextInput style={styles.input} placeholder="e.g. 72.5" placeholderTextColor="#6B7280" keyboardType="decimal-pad" value={bodyWeightInput} onChangeText={setBodyWeightInput} />
        <TouchableOpacity style={styles.primaryButton} onPress={saveTodayBodyWeight}>
          <Text style={styles.buttonText}>Save Today's Weight</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weightChartCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.cardTitle}>Body Weight Trend</Text>
            <Text style={styles.itemText}>Last {recentWeightEntries.length} logged days</Text>
          </View>
          {weightEntries.length > 0 && <Text style={styles.weightChartValue}>{weightEntries[weightEntries.length - 1].weight.toFixed(1)} kg</Text>}
        </View>
        {recentWeightEntries.length === 0 ? (
          <Text style={styles.itemText}>No weight entries yet. Add today's weight above to start your graph.</Text>
        ) : (
          <View style={styles.weightChart}>
            {recentWeightEntries.map((entry) => {
              const barHeight = 30 + ((entry.weight - weightMin) / weightRange) * 120;
              return (
                <View style={styles.weightChartColumn} key={entry.date}>
                  <Text style={styles.weightChartBarLabel}>{entry.weight.toFixed(1)}</Text>
                  <View style={styles.weightChartTrack}>
                    <View style={[styles.weightChartBar, { height: barHeight }]} />
                  </View>
                  <Text style={styles.weightChartDate}>{entry.date.slice(5)}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.itemCard}>
        <Text style={styles.itemTitle}>Today's Summary</Text>
        <Text style={styles.itemText}>Workout exercises: {progress.todayWorkoutExercises}</Text>
        <Text style={styles.itemText}>Completed exercises: {progress.todayCompletedExercises}</Text>
        <Text style={styles.itemText}>Meals logged: {progress.todayMeals}</Text>
        <Text style={styles.itemText}>Calories logged today: {Math.round(nutritionTotals.calories)} kcal</Text>
        <Text style={styles.itemText}>Water today: {water} / {waterTarget} glasses</Text>
      </View>

      <View style={styles.itemCard}>
        <Text style={styles.itemTitle}>Profile</Text>
        <Text style={styles.itemText}>Name: {user.name || "Not provided"}</Text>
        <Text style={styles.itemText}>Weight: {user.weight || "--"} kg</Text>
        <Text style={styles.itemText}>Height: {user.height || "--"} cm</Text>
      </View>

      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>🔥 Keep going! Consistency is the foundation of progress.</Text>
      </View>
    </View>
  );

  // ---------------------------------------------------------------------------
  // Render: Welcome / Authentication / Profile
  // ---------------------------------------------------------------------------
  const renderWelcome = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.logo}>FitTrack</Text>
      <Text style={styles.title}>Your fitness journey starts here</Text>
      <Text style={styles.subtitle}>
        Track your workouts, nutrition, and progress in one place.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setScreen("register")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLogin = () => (
    <View style={styles.formContainer}>
      <Text style={styles.heading}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue your journey</Text>

      <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#6B7280"
        keyboardType="email-address"
        autoCapitalize="none"
        value={user.email}
        onChangeText={(value) => updateUser("email", value)}
      />

      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={user.password}
        onChangeText={(value) => updateUser("password", value)}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("register")}>
        <Text style={styles.linkText}>New user? Create an account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("welcome")}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRegister = () => (
    <View style={styles.formContainer}>
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subtitle}>Start your fitness journey today</Text>

      <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#6B7280"
        keyboardType="email-address"
        autoCapitalize="none"
        value={user.email}
        onChangeText={(value) => updateUser("email", value)}
      />

      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Create a password"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={user.password}
        onChangeText={(value) => updateUser("password", value)}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setScreen("profile")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("welcome")}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfile = () => (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.heading}>Set Up Your Profile</Text>
      <Text style={styles.subtitle}>Tell us a little about yourself</Text>

      <Text style={styles.inputLabel}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#6B7280"
        value={user.name}
        onChangeText={(value) => updateUser("name", value)}
      />

      <Text style={styles.inputLabel}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        placeholderTextColor="#6B7280"
        keyboardType="numeric"
        value={user.age}
        onChangeText={(value) => updateUser("age", value)}
      />

      <Text style={styles.inputLabel}>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter gender"
        placeholderTextColor="#6B7280"
        value={user.gender}
        onChangeText={(value) => updateUser("gender", value)}
      />

      <Text style={styles.inputLabel}>Current Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 72.5"
        placeholderTextColor="#6B7280"
        keyboardType="decimal-pad"
        value={user.weight}
        onChangeText={(value) => updateUser("weight", value)}
      />

      <Text style={styles.inputLabel}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 175"
        placeholderTextColor="#6B7280"
        keyboardType="decimal-pad"
        value={user.height}
        onChangeText={(value) => updateUser("height", value)}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={completeProfile}>
        <Text style={styles.buttonText}>Complete Setup</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ---------------------------------------------------------------------------
  // Render: Home / Dashboard
  // -----------------------------------------------------------------------------
  const renderHome = () => (
    <View style={styles.homeContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logoSmall}>FitTrack</Text>
          <Text style={styles.greeting}>
            Hello, {user.name || "Fitness Enthusiast"} 👋
          </Text>
        </View>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        {showExerciseLibrary ? (
          renderExerciseLibrary()
        ) : (
          <>
            {activeTab === "workout" && renderWorkoutTab()}
            {activeTab === "food" && renderFoodTab()}
            {activeTab === "water" && renderWaterTab()}
            {activeTab === "progress" && renderProgressTab()}
            {activeTab === "history" && renderHistoryTab()}
          </>
        )}
      </ScrollView>

      {!showExerciseLibrary && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("workout")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "workout" && styles.activeTabText,
              ]}
            >
              {"🏋️\n"}Workout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("food")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "food" && styles.activeTabText,
              ]}
            >
              {"🍎\n"}Food
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("water")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "water" && styles.activeTabText,
              ]}
            >
              {"💧\n"}Water
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("progress")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "progress" && styles.activeTabText,
              ]}
            >
              {"📈\n"}Progress
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "history" && styles.activeTabText,
              ]}
            >
              {"📅\n"}History
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // ---------------------------------------------------------------------------
  // Main screen switch
  // -----------------------------------------------------------------------------
  const renderScreen = () => {
    switch (screen) {
      case "login":
        return renderLogin();
      case "register":
        return renderRegister();
      case "profile":
        return renderProfile();
      case "home":
        return renderHome();
      default:
        return renderWelcome();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {renderScreen()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
