import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fontFamily } from "../../../theme/fonts";

const PIN_LENGTH = 4;

type SetPinScreenProps = {
  onPinSet: (pin: string) => void;
  onBack?: () => void;
};

export default function SetPinScreen({ onPinSet, onBack }: SetPinScreenProps) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const pinValue = useMemo(() => digits.join(""), [digits]);
  const isComplete = useMemo(
    () => digits.every((digit) => digit.length === 1),
    [digits]
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      const sanitized = value.replace(/\D/g, "").slice(-1);
      const nextDigits = [...digits];
      nextDigits[index] = sanitized;
      setDigits(nextDigits);
      if (errorMessage) setErrorMessage(null);

      if (sanitized && index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, errorMessage]
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  const handleSubmit = useCallback(() => {
    if (!isComplete) {
      setErrorMessage("Please enter a 4-digit PIN");
      return;
    }

    onPinSet(pinValue);
  }, [isComplete, onPinSet, pinValue]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {!!onBack && (
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Text style={styles.backIcon}>{"<"}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.brand}>Namma Sulur</Text>
          </View>
          <View style={styles.langToggle}>
            <View style={[styles.langChip, styles.langChipActive]}>
              <Text style={[styles.langText, styles.langTextActive]}>ENG</Text>
            </View>
            <View style={styles.langChip}>
              <Text style={styles.langText}>தமிழ்</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Set Your Security PIN</Text>
        <Text style={styles.subtitle}>
          Create a 4-digit PIN to secure your account and log in quickly next time.
        </Text>

        <View style={styles.pinRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.pinCell}
              placeholder=""
              textAlign="center"
              autoFocus={index === 0}
              secureTextEntry
            />
          ))}
        </View>

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={[styles.button, !isComplete && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isComplete}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  backIcon: {
    color: "#111827",
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  brand: {
    color: "#C20B0B",
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
  langToggle: {
    flexDirection: "row",
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    padding: 2,
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  langChipActive: {
    backgroundColor: "#FFFFFF",
  },
  langText: {
    fontSize: 10,
    fontFamily: fontFamily.semiBold,
    color: "#6B7280",
  },
  langTextActive: {
    color: "#0E0E10",
  },
  title: {
    marginTop: 32,
    fontSize: 22,
    fontFamily: fontFamily.bold,
    color: "#0E0E10",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "#4E5D6C",
  },
  pinRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pinCell: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F4F4F4",
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    color: "#0E0E10",
  },
  errorText: {
    marginTop: 12,
    color: "#C20B0B",
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  button: {
    marginTop: 28,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B10B0B",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
});
