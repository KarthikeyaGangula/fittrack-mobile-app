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
    padding: 20,
    backgroundColor: "#FFFFFF",
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
    marginTop: 5,
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

  dashboardContent: {
    padding: 20,
    paddingBottom: 30,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },

  primaryButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  linkText: {
    color: "#2563EB",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },

  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: "#6B7280",
    fontSize: 15,
    textAlign: "center",
    marginTop: 25,
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

  macroText: {
    fontSize: 15,
    marginTop: 10,
  },

  itemCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 2,
  },

  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  itemText: {
    fontSize: 15,
    color: "#4B5563",
    marginTop: 5,
  },

  smallButton: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },

  smallButtonText: {
    color: "#1D4ED8",
    fontWeight: "bold",
  },

  deleteButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  deleteButtonText: {
    color: "#B91C1C",
    fontWeight: "bold",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  secondaryButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "bold",
  },

  waterProgress: {
    fontSize: 22,
    marginTop: 15,
    letterSpacing: 3,
  },

  motivationCard: {
    backgroundColor: "#FEF3C7",
    padding: 20,
    borderRadius: 14,
  },

  motivationText: {
    fontSize: 17,
    lineHeight: 25,
    color: "#92400E",
    fontWeight: "bold",
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
    fontSize: 12,
    lineHeight: 20,
  },

  activeTabText: {
    color: "#2563EB",
    fontWeight: "bold",
  },
exerciseHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
exerciseImage: {
  width: "100%",
  height: 220,
  borderRadius: 14,
  marginBottom: 20,
},
completedLabel: {
  color: "#16A34A",
  fontWeight: "bold",
},

setHeading: {
  fontSize: 16,
  fontWeight: "bold",
  marginTop: 15,
  marginBottom: 10,
},

setRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
  gap: 8,
},

setLabel: {
  width: 45,
  fontSize: 14,
  fontWeight: "bold",
},

setInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 8,
  padding: 10,
  backgroundColor: "#F9FAFB",
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

completedButton: {
  backgroundColor: "#DCFCE7",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
},

completedButtonText: {
  color: "#15803D",
  fontWeight: "bold",
},

});

export default styles;
