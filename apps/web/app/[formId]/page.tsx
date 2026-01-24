"use client";
import { cn } from "@/lib/utils";
import { RenderForm } from "./_components/RenderForm";
import { useFormStore } from "@/stores/useformStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/axios";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { JsonDoc } from "@/lib/types";
import { Loader, TriangleAlert } from "lucide-react";
import {
  Icustomisation,
  IeditorStore,
  useEditorStore,
} from "@/stores/useEditorStore";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

const fetcher = (url: string) => apiClient.get(url);
const planetform = process.env.NEXT_PUBLIC_CLIENT_URL ?? "/";
export default function Page() {
  const { formId } = useParams();
  const { data, isLoading, error } = useSWR(`/api/form/${formId}`, fetcher);
  const [docs, setDocs] = useState<JsonDoc[]>([]);
  const { formColorScheme } = useEditorStore((s) => s);
  const { activeStep } = useFormStore((s) => s);
  const [closedState, setClosed] = useState({
    isClosed: false,
    closedMessage: "The form is closed",
  });

  const form = useForm<Record<string, any>>({});

  const handleCreateRespondent = async (formId: string, customerId: string) => {
    if (useFormStore.getState().respondentId) return;

    const resp = await apiClient.post(`/api/respondent`, {
      form: formId,
      customerId: customerId,
    });

    const respondentId = resp?.data?.respondent?.id;
    useFormStore?.setState({ respondentId });
  };

  useEffect(() => {
    if (!data) return;
    const formData = data.data?.form;
    const closed = formData?.closed;
    const closedMessage = formData?.closedMessage;
    const form_schema = formData?.form_schema;
    const creator = formData?.creator;
    const customerId = formData?.customerId;
    const customisation = formData?.customisation as Icustomisation;

    if (closed) {
      setClosed({ ...closedState, isClosed: closed, closedMessage });
      return;
    }

    if (!form_schema?.content) {
      setDocs([]);
      return;
    }
    const content = [...form_schema?.content];
    const breakIndices: number[] = [0];

    content?.forEach((node, i) => {
      if (node.type === "horizontalRule") {
        breakIndices.push(i);
      }
    });

    breakIndices?.push(content?.length - 1);

    const parsedDocs = [] as any[];
    for (let i = 0; i < breakIndices.length - 1; i++) {
      const stepContent = content
        .slice(breakIndices[i], breakIndices[i + 1])
        .filter((n) => n?.type !== "horizontalRule");

      if (stepContent.length > 0) {
        parsedDocs.push({ type: "doc", content: stepContent });
      }
    }

    setDocs(parsedDocs);

    if (parsedDocs?.length === 1) {
      useFormStore.setState({
        isSingleForm: true,
        creator: creator,
        customerId: customerId,
        isLastStep: activeStep === parsedDocs?.length - 1,
        maxStep: parsedDocs?.length - 1,
        form,
      });
    } else {
      useFormStore.setState({
        isSingleForm: false,
        creator: creator,
        customerId: customerId,
        isLastStep: activeStep === parsedDocs?.length - 1,
        maxStep: parsedDocs?.length - 1,
        form,
      });
    }
    useEditorStore.setState({ ...customisation });
    handleCreateRespondent(formId as string, customerId);
  }, [data]);

  useEffect(() => {
    const val = document.documentElement.classList.values();
    document.documentElement.classList.remove(...val);
    document.documentElement.classList.add(formColorScheme);
  }, [formColorScheme]);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span>
          <TriangleAlert className=" text-destructive" /> failed to get form
        </span>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="animate-spin " />
      </div>
    );
  }

  return (
    <section className=" w-full relative ">
      <div
        className={cn(
          ` max-w-6xl w-full mx-auto px-2 min-h-screen flex items-center justify-center relative`,
        )}
      >
        <div className=" fixed z-50 left-0 bottom-4  w-full h-9 flex items-center justify-end py-2 px-4">
          <Link href={planetform}>
            <Button size={"lg"} variant={"secondary"}>
              <Logo />
            </Button>
          </Link>
        </div>
        {closedState.isClosed ? (
          <div className="w-full text-center">
            <p>{closedState.closedMessage}</p>
          </div>
        ) : (
          <>{<RenderForm docs={docs} />}</>
        )}
      </div>
    </section>
  );
}
