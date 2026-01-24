"use client";
import { FormEditor } from "@/app/dashboard/[workspaceId]/form/_components/FormEditor";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios";
import { thankyouPageContent } from "@/lib/content";
import { JsonDoc } from "@/lib/types";
import { useFormStore } from "@/stores/useformStore";
import { ArrowLeft, Loader, TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useEditorStore } from "@/stores/useEditorStore";

export const RenderForm = ({ docs }: { docs: JsonDoc[] }) => {
  const { activeStep, maxStep } = useFormStore((s) => s);
  const { customThankyouMessage } = useEditorStore((s) => s);
  const handleActiveIndex = useCallback(
    (idx: number) => {
      const index = idx < 0 ? 0 : Math.min(docs?.length - 1, idx);
      useFormStore.setState({
        activeStep: index,
        isLastStep: maxStep === index,
      });
    },
    [maxStep, docs?.length],
  );

  return (
    <div className="pt-3 w-full">
      {docs?.length > 1 && activeStep > 0 && activeStep < docs?.length && (
        <div className="w-full max-w-2xl mx-auto fixed top-4 inset-x-0  z-20">
          <Button
            onClick={() => handleActiveIndex(activeStep - 1)}
            variant={"secondary"}
            size={"icon"}
          >
            <ArrowLeft size={16} />
          </Button>
        </div>
      )}

      {docs?.length > 0 && activeStep === docs?.length && (
        <div className="max-w-3xl mx-auto text-center">
          <p>{customThankyouMessage || "Thankyou"}</p>
        </div>
      )}

      {docs?.map((content, i) => {
        if (activeStep === i) {
          return (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: -700, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full"
            >
              <FormEditor
                key={activeStep}
                className="max-w-xl mx-auto  w-full rounded-2xl  dark:bg-accent/0 "
                isEditable={false}
                content={content}
              />
            </motion.div>
          );
        }
      })}
    </div>
  );
};
