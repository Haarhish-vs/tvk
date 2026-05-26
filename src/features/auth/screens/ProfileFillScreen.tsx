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
import { updateProfile } from "../services/authApi";
import { ProfileUpdateResponseData } from "../types/authTypes";
import { fontFamily } from "../../../theme/fonts";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ProfileFillScreenProps = {
  accessToken: string;
  phone: string;
  onCompleted: (data: ProfileUpdateResponseData) => void;
  onBack?: () => void;
};

export default function ProfileFillScreen({
  accessToken,
  phone,
  onCompleted,
  onBack,
}: ProfileFillScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ward, setWard] = useState("");
  const [landmark, setLandmark] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wardValue = useMemo(() => ward.replace(/\D/g, ""), [ward]);
  const isEmailValid = useMemo(() => (!email ? true : emailRegex.test(email)), [email]);

  const isDisabled =
    isSubmitting ||
    !name.trim() ||
    !wardValue ||
    !landmark.trim() ||
    !location.trim() ||
    !isEmailValid;

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      setErrorMessage("Username is required");
      return;
    }

    if (!isEmailValid) {
      setErrorMessage("Enter a valid email address");
      return;
    }

    if (!wardValue) {
      setErrorMessage("Ward number is required");
      return;
    }

    if (!landmark.trim()) {
      setErrorMessage("Please add a nearby landmark");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Location is required");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await updateProfile(
        {
          name: name.trim(),
          email: email.trim() || undefined,
          ward: Number(wardValue),
          address: {
            area: landmark.trim(),
            city: location.trim(),
          },
        },
        accessToken
      );
      onCompleted(response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [accessToken, isEmailValid, landmark, location, name, onCompleted, wardValue, email]);

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

        <Text style={styles.title}>Welcome Back !</Text>
        <Text style={styles.sectionTitle}>Enter Your Details</Text>
        <Text style={styles.subtitle}>Your voice matters. Report issues and monitor resolutions easily.</Text>

        <View style={styles.inputGroup}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Username"
            placeholderTextColor="#9AA1A9"
            style={styles.input}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#9AA1A9"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={ward}
            onChangeText={setWard}
            placeholder="Ward number"
            placeholderTextColor="#9AA1A9"
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Near by landmark,buildings"
            placeholderTextColor="#9AA1A9"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor="#9AA1A9"
            style={styles.input}
          />
        </View>

        <View style={styles.phoneRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            value={phone}
            editable={false}
            style={[styles.input, styles.phoneInput]}
          />
        </View>

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
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
    marginTop: 28,
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: "#0E0E10",
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: "#0E0E10",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: "#4E5D6C",
  },
  inputGroup: {
    marginTop: 14,
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    height: 44,
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: "#0E0E10",
  },
  phoneRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
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
  errorText: {
    marginTop: 12,
    color: "#C20B0B",
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  button: {
    marginTop: 22,
    height: 50,
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
