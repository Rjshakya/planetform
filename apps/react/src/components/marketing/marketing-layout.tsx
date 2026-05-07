import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarketingSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "foreground" | "muted";
  border?: boolean;
  minHeight?: boolean;
}

export const MarketingSection = ({
  children,
  className,
  id,
  background = "default",
  border = false,
  minHeight = false,
}: MarketingSectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-54 md:py-64",
        background === "foreground" && "bg-foreground",
        background === "muted" && "bg-muted",
        border && "border",
        minHeight && "min-h-dvh",
        className,
      )}
    >
      {children}
    </section>
  );
};

interface MarketingContainerProps {
  children: ReactNode;
  className?: string;
}

export const MarketingContainer = ({
  children,
  className,
}: MarketingContainerProps) => {
  return (
    <div className={cn("px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto", className)}>
      {children}
    </div>
  );
};

interface MarketingHeaderProps {
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  align?: "left" | "center";
}

export const MarketingHeader = ({
  badge,
  title,
  description,
  className,
  align = "left",
}: MarketingHeaderProps) => {
  return (
    <div
      className={cn(
        "space-y-6 mb-12 md:mb-16",
        align === "center" && "text-center",
        className,
      )}
    >
      {badge && <div>{badge}</div>}
      <h2 className="landing-heading text-balance">{title}</h2>
      {description && (
        <p
          className={cn(
            "landing-sub-heading text-pretty",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};
