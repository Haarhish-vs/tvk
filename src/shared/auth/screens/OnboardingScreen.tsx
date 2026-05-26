import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

type OnboardingScreenProps = {
  onContinue: () => void;
};

export default function OnboardingScreen({ onContinue }: OnboardingScreenProps) {
  const { height, width } = useWindowDimensions();
  const source = Image.resolveAssetSource(require("../../../../assets/Onboardsc.png"));
  const containerWidth = width;
  const containerHeight = height;
  const scale = Math.min(containerWidth / source.width, containerHeight / source.height);
  const imageWidth = Math.round(source.width * scale);
  const imageHeight = Math.round(source.height * scale);
  const imageLeft = Math.round((containerWidth - imageWidth) / 2);
  const imageTop = Math.round((containerHeight - imageHeight) / 2);

  const buttonWidth = Math.round(imageWidth * 0.76);
  const buttonHeight = Math.round(imageHeight * 0.1);
  const buttonLeft = imageLeft + Math.round((imageWidth - buttonWidth) / 2);
  const buttonTop = imageTop + Math.round(imageHeight * 0.73);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageWrap}>
        <Image
          source={require("../../../../assets/Onboardsc.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Pressable
          style={[
            styles.buttonHitArea,
            {
              width: buttonWidth,
              height: buttonHeight,
              left: buttonLeft,
              top: buttonTop,
            },
          ]}
          onPress={onContinue}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Raise your voice"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F1E9",
  },
  imageWrap: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonHitArea: {
    position: "absolute",
    borderRadius: 16,
  },
});
