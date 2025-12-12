"use client";
import { JsonDoc } from "@/lib/types";
import { useEditorStore } from "@/stores/useEditorStore";
import { useFormStore } from "@/stores/useformStore";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RenderForm } from "./_components/RenderForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-User";

export default function PreviewPage() {
  const indexUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
  const { user } = useUser();
  const [schemas, setSchemas] = useState<JsonDoc[]>([]);
  const { formColorScheme } = useEditorStore((s) => s);
  const { activeStep } = useFormStore((s) => s);
  const { content } = usePreviewStore((s) => s);
  const form = useForm();

  useEffect(() => {
    if (!content) return;
    const _content = [...content?.content];
    const breakIndices: number[] = [0];

    _content?.forEach((node, i) => {
      if (node.type === "horizontalRule") {
        breakIndices.push(i);
      }
    });

    breakIndices?.push(_content?.length - 1);
    const _schemas = [] as JsonDoc[];

    for (let i = 0; i < breakIndices.length - 1; i++) {
      const stepContent = _content
        .slice(breakIndices[i], breakIndices[i + 1])
        .filter((n) => n?.type !== "horizontalRule");

      if (stepContent.length > 0) {
        _schemas.push({ type: "doc", content: stepContent, attrs: {} });
      }
    }

    setSchemas(_schemas);

    if (_schemas.length === 1) {
      useFormStore.setState({
        isSingleForm: true,
        isLastStep: activeStep === _schemas?.length - 1,
        maxStep: _schemas?.length - 1,
        form,
        creator: user?.id,
        customerId: user?.dodoCustomerId,
      });
    } else {
      useFormStore.setState({
        isSingleForm: false,
        isLastStep: activeStep === _schemas?.length - 1,
        maxStep: _schemas?.length - 1,
        form,
        creator: user?.id,
        customerId: user?.dodoCustomerId,
      });
    }
  }, [content, activeStep, form, user?.dodoCustomerId, user?.id]);

  return (
    <section className=" w-full relative ">
      <div
        className={cn(
          ` max-w-6xl w-full mx-auto px-2 min-h-screen flex items-center justify-center relative`
        )}
      >
        <div className=" fixed z-50 left-0 bottom-4  w-full h-9 flex items-center justify-end py-2 px-4">
          <Link href={indexUrl}>
            <Button size={"lg"} variant={"secondary"}>
              <Logo />
            </Button>
          </Link>
        </div>
        {<>{<RenderForm docs={schemas} />}</>}
      </div>
    </section>
  );
}
