import { createContext, useContext, useState } from "react";

const defaultSettings = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
};

const SettingsContext = createContext({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("appSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("appSettings", JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
