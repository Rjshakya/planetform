import { create } from "zustand";
import type {
  ICustomizationStore,
  IFormTheme,
  IFormTypography,
  IFormLayout,
} from "./customization.types";

// Default values matching CSS default variables
const defaultLightTheme: IFormTheme = {
  formBackgroundColor: "#ffffff",
  formTextColor: "#171717",
  buttonColor: "#171717",
  buttonTextColor: "#ffffff",
  buttonBorderColor: "transparent",
  checkboxColor: "#171717",
  inputBackgroundColor: "#f5f5f5",
  inputBorderColor: "#e5e5e5",
  inputFocusColor: "#171717",
  inputBoxBackgroundColor: "transparent",
};

const defaultDarkTheme: IFormTheme = {
  formBackgroundColor: "#0a0a0a",
  formTextColor: "#fafafa",
  buttonColor: "#fafafa",
  buttonTextColor: "#171717",
  buttonBorderColor: "transparent",
  checkboxColor: "#fafafa",
  inputBackgroundColor: "#262626",
  inputBorderColor: "#404040",
  inputFocusColor: "#fafafa",
  inputBoxBackgroundColor: "transparent",
};

const defaultTypography: IFormTypography = {
  formFontFamily: "Geist",
  formFontSize: "16px",
};

const defaultLayout: IFormLayout = {
  formWidth: "100%",
  inputBoxPadding: "0px",
  buttonPadding: "8px 16px",
  radius: "8px",
};

export const useCustomizationStore = create<ICustomizationStore>(
  (set, get) => ({
    // Theme
    theme: { ...defaultLightTheme },
    darkTheme: { ...defaultDarkTheme },

    // Typography
    typography: { ...defaultTypography },

    // Layout
    layout: { ...defaultLayout },

    // Misc
    formColorScheme: "dark",
    customThankyouMessage: "Thankyou your responses are submitted",

    setTheme: (theme) => {
      if (get().formColorScheme === "dark") {
        return set((state) => ({
          ...state,
          darkTheme: { ...state.darkTheme, ...theme },
        }));
      }
      return set((state) => ({
        ...state,
        theme: { ...state.theme, ...theme },
      }));
    },
    setTypography: (typography) =>
      set((state) => ({
        ...state,
        typography: { ...state.typography, ...typography },
      })),
    setLayout: (layout) =>
      set((state) => ({ ...state, layout: { ...state.layout, ...layout } })),
    setFormColorScheme: (scheme) => set({ formColorScheme: scheme }),
    setCustomThankyouMessage: (msg) => set({ customThankyouMessage: msg }),

    reset: () =>
      set({
        theme: { ...defaultLightTheme },
        darkTheme: { ...defaultDarkTheme },
        layout: { ...defaultLayout },
        typography: { ...defaultTypography },
        formColorScheme: "dark",
        customThankyouMessage: "Thankyou your responses are submitted",
      }),
  }),
);
