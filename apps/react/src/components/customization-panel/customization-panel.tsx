import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Settings } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { FontPicker } from "../font-picker";
import { googleFontsApiKey } from "@/lib/env";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRef } from "react";

const FONT_SIZES = [
  { value: "12px", label: "12px" },
  { value: "14px", label: "14px" },
  { value: "16px", label: "16px" },
  { value: "18px", label: "18px" },
  { value: "24px", label: "24px" },
  { value: "28px", label: "28px" },
  { value: "32px", label: "32px" },
  { value: "64px", label: "64px" },
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
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className=" grid gap-2 sm:flex sm:items-center sm:justify-between">
      <Label className="text-xs font-medium w-full">{label}</Label>
      <div className="flex items-center gap-2 px-2">
        <div className=" relative">
          <Button
            onClick={() => {
              if (!inputRef.current) return;
              inputRef.current.click();
            }}
            style={{ background: `${value || "#ffffff"}` }}
            className={"rounded-sm size-5 mt-1.5"}
            size={"icon"}
          ></Button>
          <Input
            ref={inputRef}
            type="color"
            value={value || "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </div>
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="Default"
          className="h-6 border-none bg-background dark:bg-background "
        />
      </div>
    </div>
  );
};

export const CustomizationPanel = () => {
  const {
    formBackgroundColor,
    setFormBackgroundColor,
    formFontFamily,
    setformFontFamily,
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
    buttonHeight,
    buttonWidth,
    setButtonHeight,
    setButtonWidth,
  } = useCustomizationStore();

  return (
    <Sheet>
      <SheetTrigger
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
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="colors" className="">
              <span>
                <svg
                  role="image"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <g clip-path="url(#clip0_4418_4679)">
                    <path
                      opacity="0.4"
                      d="M22 16.5V19.5C22 21 21 22 19.5 22H6C6.41 22 6.83 21.94 7.22 21.81C7.33 21.77 7.43999 21.73 7.54999 21.68C7.89999 21.54 8.24001 21.34 8.54001 21.08C8.63001 21.01 8.73001 20.92 8.82001 20.83L8.85999 20.79L15.66 14H19.5C21 14 22 15 22 16.5Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      opacity="0.6"
                      d="M18.3699 11.2909L15.6599 14.0009L8.85986 20.7909C9.55986 20.0709 9.99988 19.0809 9.99988 18.0009V8.34094L12.7099 5.63094C13.7699 4.57094 15.1899 4.57094 16.2499 5.63094L18.3699 7.75094C19.4299 8.81094 19.4299 10.2309 18.3699 11.2909Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M7.5 2H4.5C3 2 2 3 2 4.5V18C2 18.27 2.02999 18.54 2.07999 18.8C2.10999 18.93 2.13999 19.06 2.17999 19.19C2.22999 19.34 2.28 19.49 2.34 19.63C2.35 19.64 2.35001 19.65 2.35001 19.65C2.36001 19.65 2.36001 19.65 2.35001 19.66C2.49001 19.94 2.65 20.21 2.84 20.46C2.95 20.59 3.06001 20.71 3.17001 20.83C3.28001 20.95 3.4 21.05 3.53 21.15L3.54001 21.16C3.79001 21.35 4.06 21.51 4.34 21.65C4.35 21.64 4.35001 21.64 4.35001 21.65C4.50001 21.72 4.65 21.77 4.81 21.82C4.94 21.86 5.07001 21.89 5.20001 21.92C5.46001 21.97 5.73 22 6 22C6.41 22 6.83 21.94 7.22 21.81C7.33 21.77 7.43999 21.73 7.54999 21.68C7.89999 21.54 8.24001 21.34 8.54001 21.08C8.63001 21.01 8.73001 20.92 8.82001 20.83L8.85999 20.79C9.55999 20.07 10 19.08 10 18V4.5C10 3 9 2 7.5 2ZM6 19.5C5.17 19.5 4.5 18.83 4.5 18C4.5 17.17 5.17 16.5 6 16.5C6.83 16.5 7.5 17.17 7.5 18C7.5 18.83 6.83 19.5 6 19.5Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4679">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="">
              <span>
                <svg
                  role="image"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <g clipPath="url(#clip0_4418_4261)">
                    <path
                      opacity="0.4"
                      d="M22 7.81V16.19C22 19.83 19.83 22 16.19 22H7.81C7.61 22 7.41 21.99 7.22 21.98C5.99 21.9 4.95 21.55 4.13 20.95C3.71 20.66 3.34 20.29 3.05 19.87C2.36 18.92 2 17.68 2 16.19V7.81C2 4.37 3.94 2.24 7.22 2.03C7.41 2.01 7.61 2 7.81 2H16.19C17.68 2 18.92 2.36 19.87 3.05C20.29 3.34 20.66 3.71 20.95 4.13C21.64 5.08 22 6.32 22 7.81Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M16.67 5.63965H7.33C6.18 5.63965 5.25 6.56965 5.25 7.71965V8.89965C5.25 9.30965 5.59 9.64965 6 9.64965C6.41 9.64965 6.75 9.30965 6.75 8.89965V7.71965C6.75 7.39965 7.01 7.13965 7.33 7.13965H11.25V16.8596H9.47C9.06 16.8596 8.72 17.1996 8.72 17.6096C8.72 18.0196 9.06 18.3596 9.47 18.3596H14.54C14.95 18.3596 15.29 18.0196 15.29 17.6096C15.29 17.1996 14.95 16.8596 14.54 16.8596H12.76V7.13965H16.68C17 7.13965 17.26 7.39965 17.26 7.71965V8.89965C17.26 9.30965 17.6 9.64965 18.01 9.64965C18.42 9.64965 18.76 9.30965 18.76 8.89965V7.71965C18.75 6.57965 17.82 5.63965 16.67 5.63965Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4261">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </TabsTrigger>
            <TabsTrigger value="buttons" className="">
              <span>
                <svg
                  role="image"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <g clipPath="url(#clip0_4418_4910)">
                    <path
                      opacity="0.4"
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M16.1502 12.8299L14.4202 13.4099C13.9402 13.5699 13.5702 13.9399 13.4102 14.4199L12.8302 16.1499C12.3402 17.6399 10.2402 17.6099 9.78018 16.1199L7.83019 9.83988C7.45019 8.58988 8.60019 7.43989 9.83019 7.81989L16.1202 9.76987C17.6102 10.2399 17.6302 12.3399 16.1502 12.8299Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4910">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </TabsTrigger>
            <TabsTrigger value="form" className="">
              <span>
                <svg
                  role="image"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <g clip-path="url(#clip0_4418_4835)">
                    <path
                      opacity="0.4"
                      d="M16.24 3.65039H7.76004C5.29004 3.65039 3.29004 5.66039 3.29004 8.12039V17.5304C3.29004 19.9904 5.30004 22.0004 7.76004 22.0004H16.23C18.7 22.0004 20.7 19.9904 20.7 17.5304V8.12039C20.71 5.65039 18.7 3.65039 16.24 3.65039Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M14.3498 2H9.64977C8.60977 2 7.75977 2.84 7.75977 3.88V4.82C7.75977 5.86 8.59977 6.7 9.63977 6.7H14.3498C15.3898 6.7 16.2298 5.86 16.2298 4.82V3.88C16.2398 2.84 15.3898 2 14.3498 2Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4835">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-4 space-y-4">
            <ColorPicker
              label="Background"
              value={formBackgroundColor}
              onChange={setFormBackgroundColor}
            />
            <ColorPicker
              label="Text "
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

          <TabsContent value="typography" className="mt-4 space-y-4 px-1">
            <div className="grid gap-2">
              <Label className="text-xs">Font Family</Label>
              <FontPicker
                apiKey={googleFontsApiKey}
                value={formFontFamily || ""}
                onChange={(e) => setformFontFamily(e || null)}
              />
            </div>

            <div className="flex items-center justify-between gap-2 ">
              <Label className="text-xs">Font Size</Label>

              <Select
                value={formFontSize || "18px"}
                onValueChange={(v) => setFormFontSize(v || null)}
                items={FONT_SIZES}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sizes</SelectLabel>
                    {FONT_SIZES.map((m) => {
                      return (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs w-full">Button Width</Label>
              <Input
                type="number"
                value={buttonWidth || 0}
                onChange={(e) => setButtonWidth(e.currentTarget.value)}
                className="w-20"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs w-full">Button Height</Label>
              <Input
                type="number"
                value={buttonHeight || 0}
                onChange={(e) => setButtonHeight(e.currentTarget.value)}
                className="w-20"
              />
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
                value={customThankyouMessage || ""}
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
                  setformFontFamily(null);
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
