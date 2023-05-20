import { SettingsProvider } from "@/contexts/settings-context";
import { MyAppProps } from "@/pages/_app";

export const withSettings = (Component: any) => {
  const ComponentWithSettings = (props: MyAppProps) => {
    const { theme, preset } = props;

    return (
      <SettingsProvider theme={theme} preset={preset}>
        <Component {...props} />
      </SettingsProvider>
    );
  };

  ComponentWithSettings.displayName = "ComponentWithSettings";

  return ComponentWithSettings;
};
