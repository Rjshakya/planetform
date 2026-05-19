import type {
  CustomizationStyles,
  ICustomizationStoreState,
} from "@/stores/customization.types";

/**
 * Converts customization store state into CSS custom properties.
 * All variables are prefixed with `form-`.
 * Also injects backward-compat shadcn vars (`--primary`, `--input`, `--ring`, `--form-label-text`).
 */
export const convertToStyles = (
  state: ICustomizationStoreState,
): CustomizationStyles => {
  const theme =
    state.formColorScheme === "dark" ? state.darkTheme : state.theme;

  const typography = state.typography;
  const layout = state.layout;

  const out: CustomizationStyles = {};

  if (theme.formBackgroundColor)
    out["--form-background"] = theme.formBackgroundColor as string;
  if (theme.formTextColor) out["--form-text"] = theme.formTextColor as string;

  if (typography.formFontFamily)
    out["--form-font-family"] = typography.formFontFamily as string;
  if (typography.formFontSize) {
    out["--form-font-size"] = typography.formFontSize as string;
    out["--form-label-text"] = typography.formFontSize as string; // backward compat
  }

  if (theme.buttonColor) {
    out["--form-button-bg"] = theme.buttonColor as string;
    // out["--primary"] = theme.buttonColor as string; // backward compat
  }
  if (theme.buttonTextColor)
    out["--form-button-text"] = theme.buttonTextColor as string;
  if (theme.buttonBorderColor)
    out["--form-button-border"] = theme.buttonBorderColor as string;

  if (layout.buttonWidth)
    out["--form-button-width"] = `${layout.buttonWidth}px`;
  if (layout.buttonHeight)
    out["--form-button-height"] = `${layout.buttonHeight}px`;
  if (layout.buttonPadding)
    out["--form-button-padding"] = layout.buttonPadding as string;

  if (theme.checkboxColor)
    out["--form-checkbox"] = theme.checkboxColor as string;

  if (theme.inputBackgroundColor) {
    out["--form-input-bg"] = theme.inputBackgroundColor as string;
    out["--input"] = theme.inputBackgroundColor as string; // backward compat
  }
  if (theme.inputBorderColor)
    out["--form-input-border"] = theme.inputBorderColor as string;
  if (theme.inputFocusColor) {
    out["--form-input-focus"] = theme.inputFocusColor as string;
    out["--ring"] = theme.inputFocusColor as string; // backward compat
  }
  if (theme.inputBoxBackgroundColor)
    out["--form-input-box-bg"] = theme.inputBoxBackgroundColor as string;
  if (layout.inputBoxPadding)
    out["--form-input-box-padding"] = layout.inputBoxPadding as string;

  if (layout.formWidth) out["--form-width"] = layout.formWidth as string;
  if (layout.radius) out["--form-radius"] = layout.radius as string;

  return out;
};
