import { Image, SafeAreaView, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require("../../../../assets/Splashsc.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#B10B0B",
  },
  container: {
    flex: 1,
    backgroundColor: "#B10B0B",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
