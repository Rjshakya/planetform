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

/**
 * Maps old persisted flat keys to new nested store structure.
 */
export const hydrateCustomization = (
  raw: Record<string, unknown>,
): Partial<ICustomizationStore> => {
  const out: Partial<ICustomizationStore> = {};

  // If already nested, return as-is
  if (raw.theme || raw.darkTheme || raw.typography || raw.layout) {
    return raw as Partial<ICustomizationStore>;
  }

  // Convert old flat keys to nested
  out.theme = {
    formBackgroundColor:
      (raw.formBackgroundColor as string | null | undefined) ??
      (raw.formBackgroundColor as string | null | undefined) ??
      null,
    formTextColor: (raw.formTextColor as string | null | undefined) ?? null,
    buttonColor:
      (raw.buttonColor as string | null | undefined) ??
      (raw.actionBtnColor as string | null | undefined) ??
      null,
    buttonTextColor:
      (raw.buttonTextColor as string | null | undefined) ??
      (raw.actionBtnTextColor as string | null | undefined) ??
      null,
    buttonBorderColor:
      (raw.buttonBorderColor as string | null | undefined) ??
      (raw.actionBtnBorderColor as string | null | undefined) ??
      null,
    checkboxColor: (raw.checkboxColor as string | null | undefined) ?? null,
    inputBackgroundColor:
      (raw.inputBackgroundColor as string | null | undefined) ?? null,
    inputFocusColor: (raw.inputFocusColor as string | null | undefined) ?? null,
    inputBoxBackgroundColor:
      (raw.inputBoxBackgroundColor as string | null | undefined) ?? null,
    inputBorderColor:
      (raw.inputBorderColor as string | null | undefined) ?? null,
  };

  out.darkTheme = {};

  out.typography = {
    formFontFamily: (raw.formFontFamily as string | null | undefined) ?? null,
    formFontSize: (raw.formFontSize as string | null | undefined) ?? null,
  };

  out.layout = {
    formWidth: (raw.formWidth as string | null | undefined) ?? null,
    inputBoxPadding: (raw.inputBoxPadding as string | null | undefined) ?? null,
    buttonPadding: (raw.buttonPadding as string | null | undefined) ?? null,
    radius: (raw.radius as string | null | undefined) ?? null,
    buttonWidth: (raw.buttonWidth as string | null | undefined) ?? null,
    buttonHeight: (raw.buttonHeight as string | null | undefined) ?? null,
  };

  if (raw.formColorScheme) {
    out.formColorScheme = raw.formColorScheme as "light" | "dark";
  }
  if (raw.customThankyouMessage) {
    out.customThankyouMessage = raw.customThankyouMessage as string;
  }

  return out;
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
