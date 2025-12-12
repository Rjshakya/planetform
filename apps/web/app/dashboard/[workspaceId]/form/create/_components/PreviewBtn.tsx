"use client";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentEditor } from "@tiptap/react";
import { useFormStore } from "@/stores/useformStore";
import { usePreviewStore } from "@/stores/usePreviewStore";
import { useRouter } from "next/navigation";

export const PreviewButton = () => {
  const { editor } = useCurrentEditor();
  const { setContent } = usePreviewStore((s) => s);
  const router = useRouter();

  const handlePreview = useCallback(() => {
    if (!editor) return;
    const json = editor.getJSON();
    setContent(json);
    console.log(json);
    
    useFormStore.setState({ activeStep: 0 });
    router.push("/preview");
  }, [editor, router, setContent]);

  return (
    <Button onClick={handlePreview} variant={"outline"} size={"sm"}>
      Preview
    </Button>
  );
};
