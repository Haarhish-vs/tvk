import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function AppRoot() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TVK</Text>
      <Text style={styles.subtitle}>AppRoot placeholder</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0B1F33",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#4E5D6C",
  },
});
