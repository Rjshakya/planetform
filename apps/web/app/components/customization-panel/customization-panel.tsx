import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useCustomizationStore } from "@/stores/useCustomizationStore";
import {
  Sheet,
  SheetContent,
  SheetFooter,
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

import { useRef, useState } from "react";
import { useTheme } from "../common/theme-provider";
import { motion } from "motion/react";

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

const ColorPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (val: string | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-2 sm:flex sm:items-center sm:justify-between">
      <Label className="text-xs font-medium w-full">{label}</Label>
      <div className="flex items-center gap-2 px-2">
        <div className="relative">
          <Button
            onClick={() => {
              if (!inputRef.current) return;
              inputRef.current.click();
            }}
            style={{ background: `${value || "#ffffff"}` }}
            className="rounded-sm size-5 mt-1.5 border border-ring"
            size="icon"
          />
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
          className="h-6 border-none bg-background dark:bg-background"
        />
      </div>
    </div>
  );
};

export const CustomizationPanel = () => {
  const {
    theme,
    darkTheme,
    typography,
    layout,
    formColorScheme,
    setFormColorScheme,
    customThankyouMessage,
    setCustomThankyouMessage,
    setTheme,
    setTypography,
    setLayout,
    reset,
  } = useCustomizationStore();

  const activeTheme = formColorScheme === "dark" ? darkTheme : theme;

  const { setTheme: setAppTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("theme");

  return (
    <Sheet modal={false}>
      <SheetTrigger
        render={
          <Button variant="secondary" size="icon">
            <Settings />
          </Button>
        }
      />

      <SheetContent
        overlay="backdrop-blur-none bg-black/0"
        side="right"
        className="w-80 overflow-y-auto p-2 py-4"
      >
        <SheetHeader>
          <SheetTitle>Customize Form</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full group-data-horizontal/tabs:h-9 rounded-2xl flex relative">
            <TabsTrigger
              value="theme"
              className="border-none w-full relative data-active:bg-transparent dark:data-active:bg-transparent"
            >
              {activeTab === "theme" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-input rounded-2xl"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">Theme</span>
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="border-none w-full relative data-active:bg-transparent dark:data-active:bg-transparent"
            >
              {activeTab === "layout" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-input rounded-2xl"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">Layout</span>
            </TabsTrigger>
            <TabsTrigger
              value="typography"
              className="border-none w-full relative data-active:bg-transparent dark:data-active:bg-transparent"
            >
              {activeTab === "typography" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-input rounded-2xl"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">Typography</span>
            </TabsTrigger>

            <TabsTrigger
              value="general"
              className="border-none w-full relative data-active:bg-transparent dark:data-active:bg-transparent"
            >
              {activeTab === "general" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-input rounded-2xl"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">General</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              <ColorPicker
                label="Background"
                value={activeTheme.formBackgroundColor}
                onChange={(v) => setTheme({ formBackgroundColor: v })}
              />
              <ColorPicker
                label="Text"
                value={activeTheme.formTextColor}
                onChange={(v) => setTheme({ formTextColor: v })}
              />
              <ColorPicker
                label="Button Background"
                value={activeTheme.buttonColor}
                onChange={(v) => setTheme({ buttonColor: v })}
              />
              <ColorPicker
                label="Button Text"
                value={activeTheme.buttonTextColor}
                onChange={(v) => setTheme({ buttonTextColor: v })}
              />
              <ColorPicker
                label="Button Border"
                value={activeTheme.buttonBorderColor}
                onChange={(v) => setTheme({ buttonBorderColor: v })}
              />
              <ColorPicker
                label="Checkbox"
                value={activeTheme.checkboxColor}
                onChange={(v) => setTheme({ checkboxColor: v })}
              />
              <ColorPicker
                label="Input Background"
                value={activeTheme.inputBackgroundColor}
                onChange={(v) => setTheme({ inputBackgroundColor: v })}
              />
              <ColorPicker
                label="Input Border"
                value={activeTheme.inputBorderColor}
                onChange={(v) => setTheme({ inputBorderColor: v })}
              />
              <ColorPicker
                label="Input Focus"
                value={activeTheme.inputFocusColor}
                onChange={(v) => setTheme({ inputFocusColor: v })}
              />
              <ColorPicker
                label="Input Box Background"
                value={activeTheme.inputBoxBackgroundColor}
                onChange={(v) => setTheme({ inputBoxBackgroundColor: v })}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="layout" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs w-full">Form Width</Label>
                <Input
                  type="text"
                  value={layout.formWidth || ""}
                  onChange={(e) =>
                    setLayout({ formWidth: e.currentTarget.value || null })
                  }
                  placeholder="e.g. 600px"
                  className="w-28"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs w-full">Input Box Padding</Label>
                <Input
                  type="text"
                  value={layout.inputBoxPadding || ""}
                  onChange={(e) =>
                    setLayout({
                      inputBoxPadding: e.currentTarget.value || null,
                    })
                  }
                  placeholder="e.g. 12px"
                  className="w-28"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs w-full">Button Padding</Label>
                <Input
                  type="text"
                  value={layout.buttonPadding || ""}
                  onChange={(e) =>
                    setLayout({
                      buttonPadding: e.currentTarget.value || null,
                    })
                  }
                  placeholder="e.g. 8px 16px"
                  className="w-28"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs w-full">Radius</Label>
                <Input
                  type="text"
                  value={layout.radius || ""}
                  onChange={(e) =>
                    setLayout({ radius: e.currentTarget.value || null })
                  }
                  placeholder="e.g. 8px"
                  className="w-28"
                />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="typography" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="grid gap-2">
                <Label className="text-xs">Font Family</Label>
                <FontPicker
                  apiKey={googleFontsApiKey}
                  value={typography.formFontFamily || ""}
                  onChange={(e: string) =>
                    setTypography({ formFontFamily: e || null })
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">Font Size</Label>
                <Select
                  value={typography.formFontSize || "18px"}
                  onValueChange={(v) => setTypography({ formFontSize: v })}
                  items={FONT_SIZES}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sizes</SelectLabel>
                      {FONT_SIZES.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="general" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="grid gap-2">
                <Label className="text-xs">Thank You Message</Label>
                <Textarea
                  className="text-muted-foreground"
                  value={customThankyouMessage || ""}
                  onChange={(e) => setCustomThankyouMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Color Scheme</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Light</span>
                  <Switch
                    checked={formColorScheme === "dark"}
                    onCheckedChange={(c) => {
                      setFormColorScheme(c ? "dark" : "light");
                      setAppTheme(c ? "dark" : "light");
                    }}
                  />
                  <span className="text-xs text-muted-foreground">Dark</span>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <SheetFooter>
          <div className="pt-6 flex justify-end items-end">
            <Button
              variant="destructive"
              onClick={() => {
                reset();
                setAppTheme("dark");
              }}
            >
              Reset All Defaults
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
