export interface IFormTheme {
  formBackgroundColor?: string | null;
  formTextColor?: string | null;
  buttonColor?: string | null;
  buttonTextColor?: string | null;
  checkboxColor?: string | null;
  inputBackgroundColor?: string | null;
  inputFocusColor?: string | null;
  inputBoxBackgroundColor?: string | null;
  inputBorderColor?: string | null;
  buttonBorderColor?: string | null;
}

export interface IFormDarkTheme {
  formBackgroundColor?: string | null;
  formTextColor?: string | null;
  buttonColor?: string | null;
  buttonTextColor?: string | null;
  checkboxColor?: string | null;
  inputBackgroundColor?: string | null;
  inputFocusColor?: string | null;
  inputBoxBackgroundColor?: string | null;
  inputBorderColor?: string | null;
  buttonBorderColor?: string | null;
}

export interface IFormTypography {
  formFontFamily?: string | null;
  formFontSize?: string | null;
}

export interface IFormLayout {
  formWidth?: string | null;
  inputBoxPadding?: string | null;
  buttonPadding?: string | null;
  radius?: string | null;
  buttonWidth?: string | null;
  buttonHeight?: string | null;
}

export type CustomizationStyles = {
  "--form-background"?: string;
  "--form-text"?: string;
  "--form-button-bg"?: string;
  "--primary"?: string;
  "--form-button-text"?: string;
  "--form-button-border"?: string;
  "--form-button-width"?: string;
  "--form-button-height"?: string;
  "--form-button-padding"?: string;
  "--form-checkbox"?: string;
  "--form-input-bg"?: string;
  "--input"?: string;
  "--form-input-border"?: string;
  "--form-input-focus"?: string;
  "--ring"?: string;
  "--form-input-box-bg"?: string;
  "--form-input-box-padding"?: string;
  "--form-font-family"?: string;
  "--form-font-size"?: string;
  "--form-label-text"?: string;
  "--form-width"?: string;
  "--form-radius"?: string;
};

export interface ICustomizationStore {
  theme: IFormTheme;
  darkTheme: IFormDarkTheme;
  typography: IFormTypography;
  layout: IFormLayout;
  formColorScheme: "light" | "dark";
  customThankyouMessage: string;

  setTheme: (theme: Partial<IFormTheme>) => void;
  setTypography: (typography: Partial<IFormTypography>) => void;
  setLayout: (layout: Partial<IFormLayout>) => void;
  setFormColorScheme: (scheme: "light" | "dark") => void;
  setCustomThankyouMessage: (msg: string) => void;
  reset: () => void;
}

export type ICustomizationStoreState = {
  theme: IFormTheme;
  darkTheme: IFormDarkTheme;
  typography: IFormTypography;
  layout: IFormLayout;
  formColorScheme: "light" | "dark";
  customThankyouMessage: string;
};
