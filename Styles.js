/**
 * FitTrack - Centralized React Native styles
 *
 * Keeping styles in a separate file makes App.js easier to read and maintain.
 * Later, individual screens can also be moved into separate component files.
 */

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  container: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  homeContainer: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 20,
  },

  logoSmall: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
  },

  greeting: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "bold",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  dashboardContent: {
    padding: 20,
    paddingBottom: 40,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 7,
    marginTop: 3,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#111827",
    marginBottom: 14,
  },

  dropdownButton: {
    minHeight: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  dropdownButtonText: {
    color: "#111827",
    fontSize: 16,
    flex: 1,
  },

  dropdownArrow: {
    color: "#2563EB",
    fontSize: 14,
    marginLeft: 10,
  },

  dropdownList: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginBottom: 14,
    overflow: "hidden",
  },

  dropdownListTall: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginBottom: 14,
    maxHeight: 260,
    overflow: "hidden",
  },

  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  dropdownOptionText: {
    color: "#111827",
    fontSize: 15,
  },

  foodPreviewCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 15,
    marginTop: 6,
    marginBottom: 10,
  },

  nutritionNote: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    lineHeight: 17,
  },

  primaryButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
  },

  secondaryButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "bold",
  },

  linkText: {
    color: "#2563EB",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },

  backText: {
    color: "#6B7280",
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
  },

  backTextLeft: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 16,
  },

  summaryCard: {
    backgroundColor: "#DBEAFE",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  summaryNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1D4ED8",
  },

  summaryLabel: {
    fontSize: 16,
    color: "#374151",
    marginTop: 5,
  },

  macroGrid: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 18,
  },

  macroBox: {
    alignItems: "center",
    flex: 1,
  },

  macroValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1D4ED8",
  },

  macroLabel: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 3,
  },

  formCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  itemCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  itemText: {
    fontSize: 15,
    color: "#4B5563",
    marginTop: 5,
    lineHeight: 21,
  },

  exerciseTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  exerciseTitleText: {
    flex: 1,
  },

  smallExerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },

  exerciseImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 18,
  },

  exerciseImageSmall: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },

  completedLabel: {
    color: "#16A34A",
    fontWeight: "bold",
    marginLeft: 8,
  },

  setHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },

  setFieldHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  setFieldHeaderSpacer: {
    width: 78,
  },

  setFieldHeaderLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },

  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  setCheck: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  setCheckCompleted: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },

  setCheckText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  setLabel: {
    width: 42,
    fontSize: 13,
    fontWeight: "bold",
  },

  setInput: {
    flex: 1,
    minWidth: 60,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFFFFF",
    color: "#111827",
    marginLeft: 5,
    marginRight: 5,
  },

  addSetButton: {
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },

  addSetText: {
    color: "#2563EB",
    fontWeight: "bold",
  },

  smallButton: {
    alignSelf: "stretch",
    backgroundColor: "#DBEAFE",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },

  smallButtonText: {
    color: "#1D4ED8",
    fontWeight: "bold",
  },

  completedButton: {
    backgroundColor: "#DCFCE7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },

  completedButtonText: {
    color: "#15803D",
    fontWeight: "bold",
  },

  deleteButton: {
    padding: 12,
    alignItems: "center",
    marginTop: 4,
  },

  deleteButtonText: {
    color: "#DC2626",
    fontWeight: "bold",
  },

  deleteText: {
    color: "#DC2626",
    fontWeight: "bold",
  },

  finishButton: {
    backgroundColor: "#16A34A",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  finishButtonDone: {
    backgroundColor: "#15803D",
  },

  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  waterProgress: {
    fontSize: 22,
    marginTop: 15,
    letterSpacing: 3,
  },

  progressGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  progressCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },

  progressNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563EB",
  },

  progressLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  motivationCard: {
    backgroundColor: "#FEF3C7",
    padding: 20,
    borderRadius: 14,
    marginTop: 5,
  },

  motivationText: {
    fontSize: 17,
    lineHeight: 25,
    color: "#92400E",
    fontWeight: "bold",
  },

  historyExercise: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 12,
    paddingTop: 10,
  },

  historyExerciseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#15803D",
  },

  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  calendarMonthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  calendarNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  calendarNavText: {
    fontSize: 28,
    color: "#2563EB",
    lineHeight: 30,
  },

  calendarWeekRow: {
    flexDirection: "row",
    marginBottom: 5,
  },

  calendarWeekText: {
    flex: 1,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  calendarDay: {
    width: "14.2857%",
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9,
    marginVertical: 2,
  },

  calendarDayEmpty: {
    width: "14.2857%",
    minHeight: 48,
  },

  calendarDayWithWorkout: {
    backgroundColor: "#DCFCE7",
  },

  calendarDaySelected: {
    backgroundColor: "#2563EB",
  },

  calendarDayText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },

  calendarWorkoutDayText: {
    color: "#15803D",
  },

  calendarSelectedText: {
    color: "#FFFFFF",
  },

  calendarDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#16A34A",
    marginTop: 2,
  },

  calendarTodayLabel: {
    position: "absolute",
    bottom: 1,
    fontSize: 7,
    color: "#6B7280",
  },

  selectedDateCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 14,
  },

  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 8,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },

  tabText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 19,
  },

  activeTabText: {
    color: "#2563EB",
    fontWeight: "bold",
  },
  mealDraftCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    marginBottom: 10,
  },

  mealDraftRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  weightChartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    elevation: 2,
  },

  weightChartValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
  },

  weightChart: {
    height: 205,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
  },

  weightChartColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 18,
  },

  weightChartBarLabel: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 3,
  },

  weightChartTrack: {
    height: 155,
    width: 13,
    justifyContent: "flex-end",
    backgroundColor: "#EFF6FF",
    borderRadius: 7,
    overflow: "hidden",
  },

  weightChartBar: {
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 7,
    minHeight: 6,
  },

  weightChartDate: {
    fontSize: 8,
    color: "#6B7280",
    marginTop: 5,
    transform: [{ rotate: "-45deg" }],
  },

  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  setFieldHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  setFieldHeaderSpacer: {
    flex: 0.8,
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },

  setFieldHeaderLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },

  setCompleteButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  setCompleteButtonActive: {
    backgroundColor: "#DCFCE7",
    borderColor: "#16A34A",
  },

  setCompleteButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#166534",
  },

  successCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  successText: {
    color: "#166534",
    fontWeight: "700",
  },

  libraryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  libraryImage: {
    width: 95,
    height: 95,
  },

  libraryCardContent: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },

  libraryDetailImage: {
    width: "100%",
    height: 210,
    borderRadius: 14,
    marginBottom: 12,
  },

  waterProgressTrack: {
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 16,
  },

  waterProgressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 7,
  },

});

export default styles;
