import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fontFamily } from "../../../theme/fonts";

type ServiceOfficerDashboardScreenProps = {
  phone?: string | null;
  onLogout: () => void;
};

export default function ServiceOfficerDashboardScreen({ phone, onLogout }: ServiceOfficerDashboardScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Service Officer Dashboard</Text>
        {!!phone && <Text style={styles.subtitle}>+91 {phone}</Text>}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: "#0E0E10",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: fontFamily.medium,
    color: "#4E5D6C",
  },
  logoutButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B10B0B",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
});
