"use client";

import { SimpleEditor } from "@/components/tiptap-main/simple/simple-editor";
import { JsonDoc } from "@/lib/types";
import { cn } from "@/lib/utils";

export const FormEditor = ({
  isEditable,
  content,
  className,
}: {
  isEditable: boolean;
  content?: JsonDoc;
  className?: string;
  isLast?: boolean;
  activeStep?: number;
  maxStep?: number;
}) => {
  return (
    <div className={cn(`  w-full ${className || ""} `)}>
      <SimpleEditor isEditable={isEditable} content={content} />
    </div>
  );
};
