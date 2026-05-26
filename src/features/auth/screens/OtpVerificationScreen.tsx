import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { sendRegistrationOtp, verifyRegistrationOtp } from "../services/authApi";
import { VerifyOtpResponseData } from "../types/authTypes";
import { validateOtp } from "../validations/otp";
import { fontFamily } from "../../../theme/fonts";

const OTP_LENGTH = 6;
const RESEND_INTERVAL_SEC = 60;

type OtpVerificationScreenProps = {
  phone: string;
  onVerified: (data: VerifyOtpResponseData) => void;
  onBack?: () => void;
};

export default function OtpVerificationScreen({
  phone,
  onVerified,
  onBack,
}: OtpVerificationScreenProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(RESEND_INTERVAL_SEC);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const otpValue = useMemo(() => digits.join(""), [digits]);
  const validationError = useMemo(() => validateOtp(otpValue), [otpValue]);
  const isDisabled = isSubmitting || Boolean(validationError);
  const resendDisabled = isResending || resendSeconds > 0;

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timeoutId = setTimeout(() => {
      setResendSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [resendSeconds]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const sanitized = value.replace(/\D/g, "").slice(-1);
      const nextDigits = [...digits];
      nextDigits[index] = sanitized;
      setDigits(nextDigits);
      if (errorMessage) setErrorMessage(null);

      if (sanitized && index < OTP_LENGTH - 1) {
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

  const handleVerify = useCallback(async () => {
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await verifyRegistrationOtp({ phone, otp: otpValue });
      onVerified(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [onVerified, otpValue, phone, validationError]);

  const handleResend = useCallback(async () => {
    if (resendDisabled) return;
    setIsResending(true);
    setErrorMessage(null);

    try {
      await sendRegistrationOtp({ phone });
      setResendSeconds(RESEND_INTERVAL_SEC);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  }, [phone, resendDisabled]);

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(resendSeconds / 60);
    const seconds = resendSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [resendSeconds]);

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

        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>We sent a verification code to {phone}</Text>

        <View style={styles.otpRow}>
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
              style={styles.otpCell}
              placeholder="-"
              placeholderTextColor="#C7CCD1"
              textAlign="center"
              autoFocus={index === 0}
              textContentType="oneTimeCode"
            />
          ))}
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendHint}>Didn't receive OTP ?</Text>
          <TouchableOpacity onPress={handleResend} disabled={resendDisabled}>
            <Text style={[styles.resendText, resendDisabled && styles.resendTextDisabled]}>
              {resendDisabled ? `Resend OTP in ${formattedTimer}` : "Resend OTP"}
            </Text>
          </TouchableOpacity>
        </View>

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleVerify}
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
  otpRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resendRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resendHint: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: "#9AA1A9",
  },
  resendText: {
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    color: "#B10B0B",
  },
  resendTextDisabled: {
    color: "#9AA1A9",
  },
  otpCell: {
    width: 46,
    height: 52,
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
