import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useEditorStore } from "@/stores/useEditorStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Palette,
  Type,
  MousePointer2,
  FormInput,
  Settings,
} from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { Textarea } from "../ui/textarea";

export const customizationPanelHandle = Dialog.createHandle();

const FONT_FAMILIES = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "JetBrains Mono, monospace", label: "JetBrains Mono" },
  { value: "Plus Jakarta Sans, sans-serif", label: "Plus Jakarta Sans" },
  { value: "Space Grotesk, sans-serif", label: "Space Grotesk" },
  { value: "Public Sans, sans-serif", label: "Public Sans" },
  { value: "system-ui, sans-serif", label: "System UI" },
  { value: "Georgia, serif", label: "Georgia" },
];

const FONT_SIZES = [
  { value: "12px" },
  { value: "14px" },
  { value: "16px" },
  { value: "18px" },
  { value: "24px" },
  { value: "28px" },
  { value: "32px" },
  { value: "64px" },
];

const BTN_SIZES = [
  { value: "sm", label: "Small" },
  { value: "default", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "icon", label: "Icon Only" },
];

const ColorPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (val: string | null) => void;
}) => {
  return (
    <div className="grid gap-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border border-input bg-transparent"
        />
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="Transparent"
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(null)}
          className="text-xs"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export const CustomizationPanel = () => {
  const {
    formBackgroundColor,
    setFormBackgroundColor,
    formFontFamliy,
    setFormFontFamliy,
    formFontSize,
    setFormFontSize,
    actionBtnSize,
    setActionBtnSize,
    actionBtnColor,
    setActionBtnColor,
    formTextColor,
    setFormTextColor,
    actionBtnTextColor,
    setActionBtnTextColor,
    inputBackgroundColor,
    setInputBackgroundColor,
    inputBorderColor,
    setInputBorderColor,
    actionBtnBorderColor,
    setActionBtnBorderColor,
    formColorScheme,
    setFormColorScheme,
    customThankyouMessage,
    setCustomThankyouMessage,
  } = useEditorStore();

  return (
    <Sheet handle={customizationPanelHandle}>
      <SheetTrigger
        handle={customizationPanelHandle}
        render={
          <Button variant="secondary" size="icon">
            <Settings />
          </Button>
        }
      />

      <SheetContent
        overlay="backdrop-blur-none bg-black/0 "
        side="right"
        className="w-80 overflow-y-auto p-2 py-4  "
      >
        <SheetHeader>
          <SheetTitle>Customize Form</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="colors" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors" className="gap-1">
              <Palette className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-1">
              <Type className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="buttons" className="gap-1">
              <MousePointer2 className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="form" className="gap-1">
              <FormInput className="h-3 w-3" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-4 space-y-4">
            <ColorPicker
              label="Form Background"
              value={formBackgroundColor}
              onChange={setFormBackgroundColor}
            />
            <ColorPicker
              label="Form Text"
              value={formTextColor}
              onChange={setFormTextColor}
            />
            <ColorPicker
              label="Input Background"
              value={inputBackgroundColor}
              onChange={setInputBackgroundColor}
            />
            <ColorPicker
              label="Input Border"
              value={inputBorderColor}
              onChange={setInputBorderColor}
            />
            <ColorPicker
              label="Button Background"
              value={actionBtnColor}
              onChange={setActionBtnColor}
            />
            <ColorPicker
              label="Button Text"
              value={actionBtnTextColor}
              onChange={setActionBtnTextColor}
            />
            <ColorPicker
              label="Button Border"
              value={actionBtnBorderColor}
              onChange={setActionBtnBorderColor}
            />
          </TabsContent>

          <TabsContent value="typography" className="mt-4 space-y-4">
            <div className="grid gap-2">
              <Label className="text-xs">Font Family</Label>
              <select
                value={formFontFamliy || ""}
                onChange={(e) => setFormFontFamliy(e.target.value || null)}
                className="flex h-9 w-full items-center justify-between  border border-input px-3 py-2 text-sm shadow-sm transition-colors"
                style={{
                  colorScheme: "light dark",
                  backgroundColor: "var(--background)",
                }}
              >
                <option value="">Default</option>
                {FONT_FAMILIES.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs">Font Size</Label>
              <select
                value={formFontSize || ""}
                onChange={(e) => {
                  setFormFontSize(e.target.value || null);
                }}
                className="flex h-9 w-full items-center justify-between  border border-input px-3 py-2 text-sm shadow-sm transition-colors"
                style={{
                  colorScheme: "light dark",
                  backgroundColor: "var(--background)",
                }}
              >
                <option value="">Default</option>
                {FONT_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.value}
                  </option>
                ))}
              </select>
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="mt-4 space-y-4">
            <div className="grid gap-2">
              <Label className="text-xs">Button Size</Label>
              <select
                value={actionBtnSize || ""}
                onChange={(e) =>
                  setActionBtnSize(
                    e.target.value as "icon" | "default" | "sm" | "lg" | null,
                  )
                }
                className="flex h-9 w-full items-center justify-between  border border-input px-3 py-2 text-sm shadow-sm transition-colors"
                style={{
                  colorScheme: "light dark",
                  backgroundColor: "var(--background)",
                }}
              >
                <option value="">Default</option>
                {BTN_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <ColorPicker
              label="Button Background"
              value={actionBtnColor}
              onChange={setActionBtnColor}
            />
            <ColorPicker
              label="Button Text"
              value={actionBtnTextColor}
              onChange={setActionBtnTextColor}
            />
            <ColorPicker
              label="Button Border"
              value={actionBtnBorderColor}
              onChange={setActionBtnBorderColor}
            />
          </TabsContent>

          <TabsContent value="form" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Color Scheme</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Light</span>
                <Switch
                  checked={formColorScheme === "dark"}
                  onCheckedChange={(c) =>
                    setFormColorScheme(c ? "dark" : "light")
                  }
                />
                <span className="text-xs text-muted-foreground">Dark</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs">Thank You Message</Label>
              <Textarea
                value={customThankyouMessage}
                onChange={(e) => setCustomThankyouMessage(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFormBackgroundColor(null);
                  setFormTextColor(null);
                  setInputBackgroundColor(null);
                  setInputBorderColor(null);
                  setActionBtnColor(null);
                  setActionBtnTextColor(null);
                  setActionBtnBorderColor(null);
                  setFormFontFamliy(null);
                  setFormFontSize(null);
                  setActionBtnSize(null);
                  setFormColorScheme("dark");
                  setCustomThankyouMessage(
                    "Thankyou your responses are submitted",
                  );
                }}
              >
                Reset All Defaults
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
