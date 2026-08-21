import { createContext, useContext, useState } from "react";
import type { ApiResponse, NotificationPreferences, User } from "../Types/Types";
import { useAuthContext } from "./AuthContext";

interface SettingsContextType {
  updateProfile: (firstName: string, lastName: string) => Promise<User | null>;
  loadingUpdateProfile: boolean;

  updatePassword: (
    currentPassword: string,
    newPassword1: string,
    newPassword2: string
  ) => Promise<boolean>;
  loadingUpdatePassword: boolean;

  preferences: NotificationPreferences | null;
  loadingPreferences: boolean;
  getNotificationPreferences: () => Promise<void>;

  updateNotificationPreferences: (changes: Partial<NotificationPreferences>) => Promise<void>;
  loadingUpdatePreferences: boolean;

  deleteAccount: (password: string) => Promise<boolean>;
  loadingDeleteAccount: boolean;

  errorMsg: string | null;
  successMsg: string | null;
  clearMessages: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {

  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loadingPreferences, setLoadingPreferences] = useState<boolean>(false);
  const [loadingUpdatePreferences, setLoadingUpdatePreferences] = useState<boolean>(false);

  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState<boolean>(false);
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState<boolean>(false);
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const {getUser} = useAuthContext();

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };


  const updateProfile = async (firstName: string, lastName: string) => {
    try {
      setLoadingUpdateProfile(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/settings/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
        credentials: "include",
      });

      const data: ApiResponse<{ user: User }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in updating profile");
        setSuccessMsg(null);
        return null;
      }

      setSuccessMsg("Profile updated successfully");
      setErrorMsg(null);
      await getUser();

    } catch (err) {
      console.error(err);
      setErrorMsg("Error in updating profile");
      return null;
    } finally {
      setLoadingUpdateProfile(false);
    }
  };


  const updatePassword = async (
    currentPassword: string,
    newPassword1: string,
    newPassword2: string
  ) => {
    try {
      setLoadingUpdatePassword(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/settings/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword1, newPassword2 }),
        credentials: "include",
      });

      const data: ApiResponse<null> = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error in updating password");
        setSuccessMsg(null);
        return false;
      }

      setSuccessMsg("Password updated successfully");
      setErrorMsg(null);
      return true;

    } catch (err) {
      console.error(err);
      setErrorMsg("Error in updating password");
      return false;
    } finally {
      setLoadingUpdatePassword(false);
    }
  };


  const getNotificationPreferences = async () => {
    try {
      setLoadingPreferences(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/settings/notifications`, {
        method: "GET",
        credentials: "include",
      });

      const data: ApiResponse<{ preferences: NotificationPreferences }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching notification preferences");
        throw new Error(data.message);
      }

      setPreferences(data.data.preferences);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPreferences(false);
    }
  };


  const updateNotificationPreferences = async (changes: Partial<NotificationPreferences>) => {
    // Update optimiste — meilleure UX pour des toggles
    const previous = preferences;
    setPreferences(prev => (prev ? { ...prev, ...changes } : prev));

    try {
      setLoadingUpdatePreferences(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/settings/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
        credentials: "include",
      });

      const data: ApiResponse<{ preferences: NotificationPreferences }> = await res.json();

      if (!res.ok || !data.data) {
        setPreferences(previous);
        setErrorMsg(data.message || "Error in updating notification preferences");
        throw new Error(data.message);
      }

      setPreferences(data.data.preferences);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdatePreferences(false);
    }
  };


  const deleteAccount = async (password: string) => {
    try {
      setLoadingDeleteAccount(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/settings/account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      const data: ApiResponse<null> = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error in deleting account");
        return false;
      }

      setErrorMsg(null);
      return true;

    } catch (err) {
      console.error(err);
      setErrorMsg("Error in deleting account");
      return false;
    } finally {
      setLoadingDeleteAccount(false);
    }
  };


  return (
    <SettingsContext.Provider
      value={{
        updateProfile, loadingUpdateProfile,
        updatePassword, loadingUpdatePassword,
        preferences, loadingPreferences, getNotificationPreferences,
        updateNotificationPreferences, loadingUpdatePreferences,
        deleteAccount, loadingDeleteAccount,
        errorMsg, successMsg, clearMessages,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};


export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("Please use the useSettingsContext hook inside a SettingsProvider");
  }
  return context;
};