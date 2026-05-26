import { Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import OnboardingScreen from "../features/auth/screens/OnboardingScreen";
import ConfirmPinScreen from "../features/auth/screens/ConfirmPinScreen";
import OtpVerificationScreen from "../features/auth/screens/OtpVerificationScreen";
import PhoneNumberScreen from "../features/auth/screens/PhoneNumberScreen";
import PinLoginScreen from "../features/auth/screens/PinLoginScreen";
import ProfileFillScreen from "../features/auth/screens/ProfileFillScreen";
import SetPinScreen from "../features/auth/screens/SetPinScreen";
import SplashScreen from "../features/auth/screens/SplashScreen";
import CitizenDashboardScreen from "../screens/CitizenDashboardScreen";
import MlaDashboardScreen from "../screens/MlaDashboardScreen";
import ServiceOfficerDashboardScreen from "../screens/ServiceOfficerDashboardScreen";
import WardCouncillorDashboardScreen from "../screens/WardCouncillorDashboardScreen";
import {
  clearAuthSession,
  getAuthSession,
  getOnboardingCompleted,
  setAuthSession,
  setOnboardingCompleted,
} from "../features/auth/utils/authStorage";
import { poppinsFonts } from "../theme/fonts";

type AuthStep =
  | "splash"
  | "onboarding"
  | "phone"
  | "otp"
  | "setPin"
  | "confirmPin"
  | "profile"
  | "pinLogin"
  | "dashboard";

export default function AppRoot() {
  const [step, setStep] = useState<AuthStep>("splash");
  const [phone, setPhone] = useState<string | null>(null);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [pinDraft, setPinDraft] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const bootstrap = async () => {
      try {
        await Font.loadAsync(poppinsFonts);
      } catch {
        // Ignore font loading failures to avoid blocking startup.
      }

      const [session, onboardingCompleted] = await Promise.all([
        getAuthSession(),
        getOnboardingCompleted(),
      ]);

      if (!isMounted) return;

      if (session?.phone) {
        setPhone(session.phone);
      }
      if (session?.accessToken) {
        setAccessToken(session.accessToken);
      }
      if (session?.role) {
        setRole(session.role);
      }

      if (onboardingCompleted) {
        if (session?.phone && session?.role && session?.refreshToken && session?.pinSet) {
          setStep("pinLogin");
          return;
        }
        setStep("phone");
        return;
      }

      if (session?.phone && session?.accessToken) {
        setStep("profile");
        return;
      }

      setStep("onboarding");
    };

    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOnboardingContinue = useCallback(() => {
    setStep("phone");
  }, []);

  const handleLogout = useCallback(async () => {
    await clearAuthSession();
    setPhone(null);
    setRegistrationToken(null);
    setPinDraft(null);
    setAccessToken(null);
    setRole(null);
    setStep("phone");
  }, []);

  if (step === "splash") {
    return <SplashScreen />;
  }

  if (step === "onboarding") {
    return <OnboardingScreen onContinue={handleOnboardingContinue} />;
  }

  if (step === "otp" && phone) {
    return (
      <OtpVerificationScreen
        phone={phone}
        onVerified={(data) => {
          setRegistrationToken(data.registrationToken);
          setStep("setPin");
        }}
        onBack={() => setStep("phone")}
      />
    );
  }

  if (step === "setPin" && registrationToken) {
    return (
      <SetPinScreen
        onPinSet={(pin) => {
          setPinDraft(pin);
          setStep("confirmPin");
        }}
        onBack={() => setStep("otp")}
      />
    );
  }

  if (step === "confirmPin" && registrationToken && pinDraft) {
    return (
      <ConfirmPinScreen
        registrationToken={registrationToken}
        pin={pinDraft}
        onCompleted={(data) => {
          setAccessToken(data.accessToken);
          setRole(data.user.role || null);
          if (phone) {
            void setAuthSession({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              phone: phone,
              role: data.user.role,
              pinSet: true,
            });
          }
          setStep("profile");
        }}
        onBack={() => setStep("setPin")}
      />
    );
  }

  if (step === "profile" && accessToken && phone) {
    return (
      <ProfileFillScreen
        accessToken={accessToken}
        phone={phone}
        onCompleted={() => {
          void setOnboardingCompleted(true);
          setStep("dashboard");
        }}
        onBack={() => setStep("confirmPin")}
      />
    );
  }

  if (step === "pinLogin" && phone) {
    return (
      <PinLoginScreen
        phone={phone}
        onLoggedIn={(data) => {
          setAccessToken(data.accessToken);
          setRole(data.user.role || null);
          void setAuthSession({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            phone: phone,
            role: data.user.role,
            pinSet: true,
          });
          setStep("dashboard");
        }}
      />
    );
  }

  if (step === "dashboard") {
    if (role === "service_officer") {
      return <ServiceOfficerDashboardScreen phone={phone} onLogout={handleLogout} />;
    }
    if (role === "ward_councillor") {
      return <WardCouncillorDashboardScreen phone={phone} onLogout={handleLogout} />;
    }
    if (role === "mla") {
      return <MlaDashboardScreen phone={phone} onLogout={handleLogout} />;
    }
    return <CitizenDashboardScreen phone={phone} onLogout={handleLogout} />;
  }

  return (
    <PhoneNumberScreen
      onOtpSent={(value) => {
        setPhone(value);
        setStep("otp");
      }}
      onExistingUser={(phone) => {
        setPhone(phone);
        setStep("pinLogin");
      }}
    />
  );
}
