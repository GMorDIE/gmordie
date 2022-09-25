import { provideContext } from "./provideContext";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "react-use";

type Settings = {
  lightClient: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  lightClient: false,
};

const useSettingsProvider = () => {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "gmordie.settings",
    DEFAULT_SETTINGS
  );

  const { lightClient } = useMemo(
    () => settings ?? DEFAULT_SETTINGS,
    [settings]
  );

  const toggleLightClient = useCallback(() => {
    // dispatching with prev value doesn't work, use current settings object
    setSettings({
      ...settings,
      lightClient: !settings?.lightClient,
    });
    window.location.reload();
  }, [settings, setSettings]);

  const setLightClient = useCallback(
    (enable: boolean) => {
      if (settings?.lightClient !== enable) {
        setSettings({
          ...settings,
          lightClient: enable,
        });
        window.location.reload();
      }
    },
    [setSettings, settings]
  );

  return { lightClient, toggleLightClient, setLightClient };
};

export const [SettingsProvider, useSettings] =
  provideContext(useSettingsProvider);
