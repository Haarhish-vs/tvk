import { useCallback, useMemo, useState } from "react";
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
import { ApiError } from "../../../api/client/request";
import { sendRegistrationOtp } from "../services/authApi";
import { SendOtpResponseData } from "../types/authTypes";
import { normalizeIndianPhone, validateIndianPhone } from "../validations/phone";
import { fontFamily } from "../../../theme/fonts";

type PhoneNumberScreenProps = {
  onOtpSent: (phone: string, data: SendOtpResponseData) => void;
  onExistingUser?: (phone: string) => void;
};

export default function PhoneNumberScreen({
  onOtpSent,
  onExistingUser,
}: PhoneNumberScreenProps) {
  const [phoneInput, setPhoneInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedPhone = useMemo(
    () => normalizeIndianPhone(phoneInput),
    [phoneInput]
  );

  const validationError = useMemo(
    () => validateIndianPhone(phoneInput),
    [phoneInput]
  );

  const isDisabled = isSubmitting || Boolean(validationError);

  const handleChange = useCallback((value: string) => {
    setPhoneInput(value);
    if (errorMessage) setErrorMessage(null);
  }, [errorMessage]);

  const handleSendOtp = useCallback(async () => {
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await sendRegistrationOtp({ phone: normalizedPhone });
      onOtpSent(normalizedPhone, response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorCode === "PHONE_EXISTS") {
          onExistingUser?.(normalizedPhone);
          return;
        }
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [normalizedPhone, onExistingUser, onOtpSent, validationError]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headerRow}>
          <Text style={styles.brand}>Namma Sulur</Text>
        </View>

        <Text style={styles.title}>Welcome Back !</Text>
        <Text style={styles.subtitle}>Mobile Verification</Text>

        <View style={styles.inputRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            value={phoneInput}
            onChangeText={handleChange}
            placeholder="Enter mobile number"
            keyboardType="number-pad"
            maxLength={13}
            style={styles.input}
            placeholderTextColor="#9AA1A9"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleSendOtp}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
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
  brand: {
    color: "#C20B0B",
    fontSize: 16,
    fontFamily: fontFamily.bold,
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
  inputRow: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  countryCode: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#E1E4E8",
  },
  countryCodeText: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: "#0E0E10",
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: fontFamily.medium,
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
