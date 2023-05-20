import { createContext, useContext, useState } from "react";
import type { FC, ReactNode } from "react";
import { deleteCookie, setCookie } from "cookies-next";
import { Preset } from "theme/colors";

export type Theme = "light" | "dark";

interface SettingsProviderProps {
  children: ReactNode;
  theme?: Theme;
  preset?: Preset;
}

interface Settings {
  theme: Theme;
  preset: Preset;
}

interface SettingsContextI {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  restoreInitialSettings: () => void;
}

const defaultSettings: Settings = {
  theme: "dark",
  preset: "green",
};

const SettingsContext = createContext<SettingsContextI>({
  settings: defaultSettings,
  updateSettings: () => {},
  restoreInitialSettings: () => {},
});

export const SettingsProvider: FC<SettingsProviderProps> = (props) => {
  const { children, theme: themeProp, preset: presetProp } = props;
  const initialSettings: Settings = {
    theme: themeProp || defaultSettings.theme,
    preset: presetProp || defaultSettings.preset,
  };
  const [settings, setSettings] = useState<Settings>(initialSettings);

  // const restoreSettings = () => {
  //   const theme = themeProp || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  //   const preset = presetProp || initialSettings.preset

  //   setSettings({ theme, preset })
  // }

  const restoreDefaultSettings = (): void => {
    setSettings(initialSettings);
    deleteCookie("theme");
    deleteCookie("preset");
  };

  const updateSettings = (newSettings: Settings): void => {
    const { theme, preset } = newSettings;
    setCookie("theme", theme);
    setCookie("preset", preset);
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  // useEffect(() => { restoreSettings() }, [])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        restoreInitialSettings: restoreDefaultSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  return context;
};
