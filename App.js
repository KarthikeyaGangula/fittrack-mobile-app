import React, { useState, useEffect } from "react";
import styles from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";

const initialWorkouts = [
  {
    id: 1,
    name: "Push-ups",
    completed: false,
    sets: [
      { weight: "0", reps: "12" },
      { weight: "0", reps: "12" },
      { weight: "0", reps: "12" },
    ],
  },
  {
    id: 2,
    name: "Squats",
    completed: false,
    sets: [
      { weight: "0", reps: "15" },
      { weight: "0", reps: "15" },
      { weight: "0", reps: "15" },
    ],
  },
  {
    id: 3,
    name: "Dumbbell Press",
    completed: false,
    sets: [
      { weight: "10", reps: "10" },
      { weight: "10", reps: "10" },
      { weight: "10", reps: "10" },
    ],
  },
];
const exerciseLibrary = [
  {
    id: "pushups",
    name: "Push-ups",
    category: "Chest",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800",
    instructions: [
      "Start in a high plank position.",
      "Keep your body straight.",
      "Lower your chest toward the floor.",
      "Push back up to the starting position.",
    ],
  },
  {
    id: "squats",
    name: "Bodyweight Squats",
    category: "Legs",
    image:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800",
    instructions: [
      "Stand with your feet shoulder-width apart.",
      "Bend your knees and push your hips backward.",
      "Lower your body while keeping your back straight.",
      "Return to the standing position.",
    ],
  },
  {
    id: "dumbbell-press",
    name: "Dumbbell Press",
    category: "Chest",
    image:
      "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800",
    instructions: [
      "Lie on a bench with a dumbbell in each hand.",
      "Hold the dumbbells above your chest.",
      "Lower them slowly toward your chest.",
      "Press them upward without locking your elbows.",
    ],
  },
  {
    id: "plank",
    name: "Plank",
    category: "Core",
    image:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800",
    instructions: [
      "Place your forearms on the floor.",
      "Extend your legs behind you.",
      "Keep your body in a straight line.",
      "Hold the position while breathing normally.",
    ],
  },
];
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [activeTab, setActiveTab] = useState("workout");
const [showAddExercise, setShowAddExercise] = useState(false);
const [newExerciseName, setNewExerciseName] = useState("");
const [newExerciseSets, setNewExerciseSets] = useState("3");  
const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
const [selectedExercise, setSelectedExercise] = useState(null);
const [librarySets, setLibrarySets] = useState([
  { weight: "0", reps: "0" },
  { weight: "0", reps: "0" },
  { weight: "0", reps: "0" },
]);
const [librarySetCount, setLibrarySetCount] = useState("3");
const [exerciseSearch, setExerciseSearch] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
  });

  const [water, setWater] = useState(3);

  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [workoutHistory, setWorkoutHistory] = useState({});

useEffect(() => {
  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("fittrack_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    }
  };

  loadUser();
}, []);

const getTodayKey = () => {
  return new Date().toISOString().split("T")[0];
};

useEffect(() => {
  const loadWorkoutData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(
        "fittrack_workouts"
      );

      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const history = parsedData.history || {};

        setWorkoutHistory(history);

        const todayKey = getTodayKey();

        if (history[todayKey]) {
          setWorkouts(history[todayKey]);
        }
      }
    } catch (error) {
      console.log("Error loading workout data:", error);
    }
  };

  loadWorkoutData();
}, []);

useEffect(() => {
  const saveWorkoutData = async () => {
    try {
      const todayKey = getTodayKey();

      const updatedHistory = {
        ...workoutHistory,
        [todayKey]: workouts,
      };

      await AsyncStorage.setItem(
        "fittrack_workouts",
        JSON.stringify({
          history: updatedHistory,
        })
      );
    } catch (error) {
      console.log("Error saving workout data:", error);
    }
  };

  if (workouts.length > 0) {
    saveWorkoutData();
  }
}, [workouts]);
const addLibraryExercise = (exercise, customSets = librarySets) => {
  const newExercise = {
    id: Date.now(),
    name: exercise.name,
    category: exercise.category,
    image: exercise.image,
    completed: false,
    sets: customSets.map((set) => ({ ...set })),
  };

  setWorkouts((currentWorkouts) => [
    ...currentWorkouts,
    newExercise,
  ]);

  setSelectedExercise(null);
  setShowExerciseLibrary(false);
};
const addNewExercise = () => {
  const exerciseName = newExerciseName.trim();
  const numberOfSets = Number(newExerciseSets);

  if (!exerciseName) {
    alert("Please enter an exercise name.");
    return;
  }

  if (
    !Number.isInteger(numberOfSets) ||
    numberOfSets < 1 ||
    numberOfSets > 10
  ) {
    alert("Please enter between 1 and 10 sets.");
    return;
  }

  const newExercise = {
    id: Date.now(),
    name: exerciseName,
    completed: false,
    sets: Array.from({ length: numberOfSets }, () => ({
      weight: "0",
      reps: "0",
    })),
  };

  setWorkouts((currentWorkouts) => [
    ...currentWorkouts,
    newExercise,
  ]);

  setNewExerciseName("");
  setNewExerciseSets("3");
  setShowAddExercise(false);
};      
  const [meals] = useState([
    {
      type: "Breakfast",
      name: "Oats and Banana",
      calories: 350,
      protein: 12,
      carbs: 55,
      fat: 8,
    },
    {
      type: "Lunch",
      name: "Rice and Chicken",
      calories: 550,
      protein: 35,
      carbs: 60,
      fat: 15,
    },
    {
      type: "Snack",
      name: "Protein Shake",
      calories: 180,
      protein: 25,
      carbs: 10,
      fat: 4,
    },
  ]);

  const updateUser = (field, value) => {
    setUser({ ...user, [field]: value });
  };
  const updateSet = (workoutId, setIndex, field, value) => {
  setWorkouts((currentWorkouts) =>
    currentWorkouts.map((workout) => {
      if (workout.id !== workoutId) {
        return workout;
      }

      const updatedSets = workout.sets.map((set, index) =>
        index === setIndex ? { ...set, [field]: value } : set
      );

      return {
        ...workout,
        sets: updatedSets,
      };
    })
  );
};

const addSet = (workoutId) => {
  setWorkouts((currentWorkouts) =>
    currentWorkouts.map((workout) => {
      if (workout.id !== workoutId) {
        return workout;
      }

      return {
        ...workout,
        sets: [
          ...workout.sets,
          { weight: "0", reps: "0" },
        ],
      };
    })
  );
};

const toggleWorkoutComplete = (workoutId) => {
  setWorkouts((currentWorkouts) =>
    currentWorkouts.map((workout) =>
      workout.id === workoutId
        ? { ...workout, completed: !workout.completed }
        : workout
    )
  );
};

const removeExercise = (workoutId) => {
  const workout = workouts.find((item) => item.id === workoutId);
  if (!workout) return;

  Alert.alert(
    "Delete Exercise",
    `Are you sure you want to remove ${workout.name} from today's workout?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setWorkouts((currentWorkouts) =>
            currentWorkouts.filter((item) => item.id !== workoutId)
          );
        },
      },
    ]
  );
};

  const renderWelcome = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.logo}>FitTrack</Text>

      <Text style={styles.title}>
        Your fitness journey starts here
      </Text>

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
        <Text style={styles.linkText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLogin = () => (
    <View style={styles.formContainer}>
      <Text style={styles.heading}>Welcome Back 👋</Text>

      <Text style={styles.subtitle}>
        Login to continue your journey
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={user.email}
        onChangeText={(value) => updateUser("email", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={user.password}
        onChangeText={(value) => updateUser("password", value)}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setScreen("home")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("register")}>
        <Text style={styles.linkText}>
          New user? Create an account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("welcome")}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRegister = () => (
    <View style={styles.formContainer}>
      <Text style={styles.heading}>Create Account</Text>

      <Text style={styles.subtitle}>
        Start your fitness journey today
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={user.email}
        onChangeText={(value) => updateUser("email", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
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
        <Text style={styles.linkText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen("welcome")}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfile = () => (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.heading}>Set Up Your Profile</Text>

      <Text style={styles.subtitle}>
        Tell us a little about yourself
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={user.name}
        onChangeText={(value) => updateUser("name", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={user.age}
        onChangeText={(value) => updateUser("age", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={user.gender}
        onChangeText={(value) => updateUser("gender", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Weight in kg"
        keyboardType="numeric"
        value={user.weight}
        onChangeText={(value) => updateUser("weight", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Height in cm"
        keyboardType="numeric"
        value={user.height}
        onChangeText={(value) => updateUser("height", value)}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={async () => {
          try {
            await AsyncStorage.setItem("fittrack_user", JSON.stringify(user));
          } catch (error) {
            console.log("Error saving profile:", error);
          }
          setScreen("home");
        }}
      >
        <Text style={styles.buttonText}>Complete Setup</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderWorkoutTab = () => {
  const completedCount = workouts.filter(
    (workout) => workout.completed
  ).length;


  return (
    <View>
      <Text style={styles.sectionTitle}>Today's Workout 🏋️</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>
          {completedCount} / {workouts.length}
        </Text>

        <Text style={styles.summaryLabel}>
          Exercises completed
        </Text>
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setShowExerciseLibrary(true)}
      >
        <Text style={styles.secondaryButtonText}>
          📚 Browse Exercise Library
        </Text>
      </TouchableOpacity>

<TouchableOpacity
  style={styles.primaryButton}
  onPress={() => setShowAddExercise(!showAddExercise)}
>
  <Text style={styles.buttonText}>+ Add Exercise</Text>
</TouchableOpacity>

{showAddExercise && (
  <View style={styles.itemCard}>
    <Text style={styles.itemTitle}>Add New Exercise</Text>

    <TextInput
      style={styles.input}
      placeholder="Exercise name"
      value={newExerciseName}
      onChangeText={setNewExerciseName}
    />

    <TextInput
      style={styles.input}
      placeholder="Number of sets"
      keyboardType="numeric"
      value={newExerciseSets}
      onChangeText={setNewExerciseSets}
    />

    <TouchableOpacity
      style={styles.primaryButton}
      onPress={addNewExercise}
    >
      <Text style={styles.buttonText}>Save Exercise</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.secondaryButton}
      onPress={() => setShowAddExercise(false)}
    >
      <Text style={styles.secondaryButtonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
)}
      {workouts.map((workout) => (
        <View style={styles.itemCard} key={workout.id}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.itemTitle}>{workout.name}</Text>

            {workout.completed && (
              <Text style={styles.completedLabel}>✓ Done</Text>
            )}
          </View>

          <Text style={styles.itemText}>
            Total sets: {workout.sets.length}
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeExercise(workout.id)}
          >
            <Text style={styles.deleteButtonText}>🗑️ Remove Exercise</Text>
          </TouchableOpacity>

          <Text style={styles.setHeading}>Set details</Text>

          {workout.sets.map((set, index) => (
            <View style={styles.setRow} key={index}>
              <Text style={styles.setLabel}>
                Set {index + 1}
              </Text>

              <TextInput
                style={styles.setInput}
                placeholder="Weight"
                keyboardType="numeric"
                value={set.weight}
                onChangeText={(value) =>
                  updateSet(
                    workout.id,
                    index,
                    "weight",
                    value
                  )
                }
              />

              <TextInput
                style={styles.setInput}
                placeholder="Reps"
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(value) =>
                  updateSet(
                    workout.id,
                    index,
                    "reps",
                    value
                  )
                }
              />
            </View>
          ))}
          
          <TouchableOpacity
            style={styles.addSetButton}
            onPress={() => addSet(workout.id)}
          >
            <Text style={styles.addSetText}>+ Add Set</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              workout.completed
                ? styles.completedButton
                : styles.smallButton
            }
            onPress={() => toggleWorkoutComplete(workout.id)}
          >
            <Text
              style={
                workout.completed
                  ? styles.completedButtonText
                  : styles.smallButtonText
              }
            >
              {workout.completed
                ? "Mark as Incomplete"
                : "Complete Exercise"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};
const renderExerciseLibrary = () => {
  const filteredExercises = exerciseLibrary.filter((exercise) =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  if (selectedExercise) {
    return (
      <ScrollView contentContainerStyle={styles.dashboardContent}>
        <TouchableOpacity
          onPress={() => setSelectedExercise(null)}
        >
          <Text style={styles.backText}>← Back to Library</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>
          {selectedExercise.name}
        </Text>

        <Image
          source={{ uri: selectedExercise.image }}
          style={styles.exerciseImage}
        />

        <Text style={styles.itemTitle}>Number of Sets</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter number of sets"
          keyboardType="numeric"
          value={librarySetCount}
          onChangeText={(value) => {
            const count = Math.max(1, Math.min(20, Number(value) || 1));
            setLibrarySetCount(value);
            setLibrarySets(
              Array.from({ length: count }, () => ({
                weight: "0",
                reps: "0",
              }))
            );
          }}
        />

        <Text style={styles.itemText}>
          {`This exercise will be added with ${librarySets.length} set(s). You can enter weight and reps later from the Home screen.`}
        </Text>

        <Text style={styles.itemTitle}>Instructions</Text>

        {selectedExercise.instructions.map((instruction, index) => (
          <Text style={styles.itemText} key={index}>
            {index + 1}. {instruction}
          </Text>
        ))}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => addLibraryExercise(selectedExercise, librarySets)}
        >
          <Text style={styles.buttonText}>Add to Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.dashboardContent}>
      <TouchableOpacity
        onPress={() => {
          setSelectedExercise(null);
          setExerciseSearch("");
          setScreen("home");
        }}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Exercise Library 📚</Text>

      <TextInput
        style={styles.input}
        placeholder="Search exercises..."
        value={exerciseSearch}
        onChangeText={setExerciseSearch}
      />

      {filteredExercises.map((exercise) => (
        <TouchableOpacity
          style={styles.itemCard}
          key={exercise.id}
          onPress={() => {
            setSelectedExercise(exercise);
            setLibrarySetCount("3");
            setLibrarySets([
              { weight: "0", reps: "0" },
              { weight: "0", reps: "0" },
              { weight: "0", reps: "0" },
            ]);
          }}
        >
          <Image
            source={{ uri: exercise.image }}
            style={styles.exerciseImage}
          />
          <Text style={styles.itemTitle}>{exercise.name}</Text>
          <Text style={styles.itemText}>{exercise.category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

  const renderFoodTab = () => {
    const totalCalories = meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    const totalProtein = meals.reduce(
      (total, meal) => total + meal.protein,
      0
    );

    return (
      <View>
        <Text style={styles.sectionTitle}>Today's Nutrition 🍎</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalCalories}</Text>
          <Text style={styles.summaryLabel}>Calories consumed</Text>
          <Text style={styles.macroText}>
            Protein: {totalProtein} g
          </Text>
        </View>

        {meals.map((meal, index) => (
          <View style={styles.itemCard} key={index}>
            <Text style={styles.itemTitle}>
              {meal.type}: {meal.name}
            </Text>

            <Text style={styles.itemText}>
              Calories: {meal.calories} kcal
            </Text>

            <Text style={styles.itemText}>
              Protein: {meal.protein} g | Carbs: {meal.carbs} g
            </Text>

            <Text style={styles.itemText}>
              Fat: {meal.fat} g
            </Text>
          </View>
        ))}

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.buttonText}>+ Add Meal</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWaterTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Water Intake 💧</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>{water} / 8</Text>
        <Text style={styles.summaryLabel}>Glasses consumed today</Text>

        <Text style={styles.waterProgress}>
          {"💧".repeat(water)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          if (water < 8) {
            setWater(water + 1);
          }
        }}
      >
        <Text style={styles.buttonText}>+ Add Glass</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setWater(0)}
      >
        <Text style={styles.secondaryButtonText}>Reset Water Intake</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProgressTab = () => (
    <View>
      <Text style={styles.sectionTitle}>Your Progress 📈</Text>

      <View style={styles.itemCard}>
        <Text style={styles.itemTitle}>Profile Information</Text>
        <Text style={styles.itemText}>
          Name: {user.name || "Not provided"}
        </Text>
        <Text style={styles.itemText}>
          Weight: {user.weight || "--"} kg
        </Text>
        <Text style={styles.itemText}>
          Height: {user.height || "--"} cm
        </Text>
      </View>

      <View style={styles.itemCard}>
        <Text style={styles.itemTitle}>Weekly Summary</Text>
        <Text style={styles.itemText}>Workouts completed: 4</Text>
        <Text style={styles.itemText}>Calories tracked: 6,850 kcal</Text>
        <Text style={styles.itemText}>Average water intake: 6 glasses</Text>
      </View>

      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>
          🔥 Keep going! Small steps every day create big results.
        </Text>
      </View>
    </View>
  );
const renderWorkoutHistory = () => {
  const historyDates = Object.keys(workoutHistory).sort().reverse();

  return (
    <View>
      <Text style={styles.sectionTitle}>Workout History 📅</Text>

      {historyDates.length === 0 ? (
        <View style={styles.itemCard}>
          <Text style={styles.itemText}>
            No workout history available yet.
          </Text>
        </View>
      ) : (
        historyDates.map((date) => {
          const dayWorkouts = workoutHistory[date] || [];

          const completed = dayWorkouts.filter(
            (workout) => workout.completed
          ).length;

          return (
            <View style={styles.itemCard} key={date}>
              <Text style={styles.itemTitle}>{date}</Text>

              <Text style={styles.itemText}>
                Completed exercises: {completed} / {dayWorkouts.length}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
};
  const renderHome = () => (
  <View style={styles.homeContainer}>
    <View style={styles.header}>
      <View>
        <Text style={styles.logoSmall}>FitTrack</Text>
        <Text style={styles.greeting}>
          Hello, {user.name || "Fitness Enthusiast"} 👋
        </Text>
      </View>

      <TouchableOpacity onPress={() => setScreen("welcome")}>
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
          {activeTab === "history" && renderWorkoutHistory()}
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


