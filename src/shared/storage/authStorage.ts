import * as SecureStore from "expo-secure-store";

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  phone: string;
  role?: string;
  pinSet?: boolean;
};

const STORAGE_KEYS = {
  session: "auth.session",
  onboarding: "auth.onboardingCompleted",
};

export const getAuthSession = async (): Promise<AuthSession | null> => {
  const stored = await SecureStore.getItemAsync(STORAGE_KEYS.session);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthSession;
  } catch {
    return null;
  }
};

export const setAuthSession = async (session: AuthSession): Promise<void> => {
  await SecureStore.setItemAsync(STORAGE_KEYS.session, JSON.stringify(session));
};

export const clearAuthSession = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.session);
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  const stored = await SecureStore.getItemAsync(STORAGE_KEYS.onboarding);
  return stored === "true";
};

export const setOnboardingCompleted = async (value: boolean): Promise<void> => {
  await SecureStore.setItemAsync(STORAGE_KEYS.onboarding, value ? "true" : "false");
};
