import { useState, type CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

interface HeroFormValues {
  name: string;
  email: string;
  purpose: string;
  message: string;
}

const purposes = [
  { value: "product", label: "Product feedback" },
  { value: "agency", label: "Agency / client work" },
  { value: "personal", label: "Personal project" },
  { value: "other", label: "Other" },
];

const transparentBackgroundStyle: CSSProperties = {
  "--form-background": "transparent",
} as CSSProperties;

export const HeroFormShowcase = () => {
  const [isSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    defaultValues: {
      name: "",
      email: "",
      purpose: "",
      message: "",
    },
  });

  const navigate = useNavigate();

  const selectedPurpose = watch("purpose");

  const onSubmit = () => {
    navigate("/auth");
  };

  if (isSubmitted) {
    return (
      <div className="main-form flex flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-[var(--form-button-bg,var(--default-form-button-bg))] text-[var(--form-button-text,var(--default-form-button-text))] size-12 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">Thanks for trying Planetform!</h3>
        <p className="text-sm opacity-80">This is how your respondents will feel.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="main-form w-full"
      style={transparentBackgroundStyle}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Get early access</h2>
        <p className="mt-1 text-sm opacity-80">See how easy it is to collect responses.</p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="hero-name" className="form-input-label">
            Name
          </Label>
          <Input
            id="hero-name"
            placeholder="Jane Doe"
            className={cn("form-input-style min-h-10", errors.name && "border-destructive")}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hero-email" className="form-input-label">
            Email
          </Label>
          <Input
            id="hero-email"
            type="email"
            placeholder="jane@example.com"
            className={cn("form-input-style min-h-10", errors.email && "border-destructive")}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <span className="form-input-label">What are you building?</span>
          <div className="grid gap-2">
            {purposes.map((purpose) => {
              const isSelected = selectedPurpose === purpose.value;
              return (
                <label
                  key={purpose.value}
                  htmlFor={`hero-purpose-${purpose.value}`}
                  className={cn(
                    "mcq-multiple-choice-option flex cursor-pointer items-center gap-3 p-3",
                    isSelected && "border-[var(--form-checkbox,var(--default-form-checkbox))]",
                  )}
                >
                  <input
                    id={`hero-purpose-${purpose.value}`}
                    type="radio"
                    value={purpose.value}
                    className="sr-only"
                    {...register("purpose", { required: "Please select one" })}
                  />
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                      isSelected
                        ? "border-[var(--form-checkbox,var(--default-form-checkbox))] bg-[var(--form-checkbox,var(--default-form-checkbox))]"
                        : "border-[var(--form-input-border,var(--default-form-input-border))]",
                    )}
                  >
                    {isSelected && (
                      <span className="size-1.5 rounded-full bg-[var(--form-button-text,var(--default-form-button-text))]" />
                    )}
                  </span>
                  <span className="text-sm font-medium">{purpose.label}</span>
                </label>
              );
            })}
          </div>
          {errors.purpose && <p className="text-destructive text-xs">{errors.purpose.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hero-message" className="form-input-label">
            Message
          </Label>
          <Textarea
            id="hero-message"
            placeholder="Tell us more..."
            rows={3}
            className={cn("form-input-style", errors.message && "border-destructive")}
            {...register("message")}
          />
        </div>

        <Button size={"lg"} disabled={isSubmitting} className="py-5 w-full">
          Submit
        </Button>
      </div>
    </form>
  );
};
