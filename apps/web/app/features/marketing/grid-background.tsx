import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  children?: ReactNode;
  className?: string;
  gridSize?: number;
  dotSize?: number;
  lineOpacity?: number;
  dotOpacity?: number;
}

export const GridBackground = ({
  children,
  className,
  gridSize = 60,
  dotSize = 2,
  lineOpacity = 0.2,
  dotOpacity = 0.6,
}: GridBackgroundProps) => {
  const dotRadius = dotSize / 2;

  return (
    <div className={cn("relative", className)}>
      {/* Grid pattern background - lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, ${lineOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, ${lineOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Grid dots at intersections */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, ${dotOpacity}) ${dotRadius}px, transparent ${dotRadius}px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${-dotRadius}px ${-dotRadius}px`,
        }}
      />

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

export const DotBackground = ({
  children,
  className,
  gridSize = 24,
  dotSize = 1,
  dotOpacity = 0.3,
}: Omit<GridBackgroundProps, "lineOpacity">) => {
  const dotRadius = dotSize / 2;

  return (
    <div className={cn("relative", className)}>
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, ${dotOpacity}) ${dotRadius}px, transparent ${dotRadius}px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};
