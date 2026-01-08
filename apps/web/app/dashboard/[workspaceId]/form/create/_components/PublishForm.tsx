import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui//dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCurrentEditor } from "@tiptap/react";
import { JsonDoc } from "@/lib/types";
import { toast } from "sonner";
import { apiClient } from "@/lib/axios";
import { redirect, useParams, useRouter } from "next/navigation";
import { authClient, signOut } from "@/lib/auth-client";
import { mutate } from "swr";
import { Loader } from "lucide-react";
import ShortUniqueId from "short-unique-id";
import { v7 } from "uuid";
import { MarkType, NodeType, TextType } from "@tiptap/core";

type content = NodeType<
  string,
  Record<string, any> | undefined,
  any,
  (NodeType<any, any, any, any> | TextType<MarkType<any, any>>)[]
>[];

import { useEditorStore } from "@/stores/useEditorStore";
import { toastPromiseOptions } from "@/lib/toast";
import { ConditionalLogicAttrs } from "@/components/custom-nodes/conditional-logic/node";

const uid = new ShortUniqueId({ length: 10 });

export const PublishForm = () => {
  const { editor } = useCurrentEditor();
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const { workspaceId: workspace } = useParams();
  const { data: session } = authClient.useSession();
  const shortId = uid.rnd();
  const router = useRouter();

  const handlePublish = async (formname: string) => {
    if (!session?.user?.id) {
      toast("you'r not authenticated please sign up");
      await signOut();
      return;
    }

    if (!workspace) return;

    const cleanUp = () => {
      mutate(`/api/form/workspace/${workspace}`);
      setCreating(false);
      setOpen(false);
      useEditorStore.setState({
        content: {
          type: "doc",
          attrs: {},
          content: [],
        },
        editedContent: {
          type: "doc",
          attrs: {},
          content: [],
        },
      });
    };

    const schema = editor?.getJSON();
    const creator = session?.user?.id;
    const name = formname;
    const customerId = session?.user?.dodoCustomerId;
    const formCustomisation = JSON.stringify(getCustomization());

    setCreating(true);

    try {
      const res = await apiClient.post(`/api/form`, {
        formValues: {
          name,
          workspace,
          creator,
          form_schema: JSON.stringify(schema),
          shortId,
          customerId,
        },
        formCustomisation,
      });

      if (res.status === 200) {
        const formId = res?.data?.form?.shortId;
        await postFormFields(schema, formId);
      }
    } catch (e) {
      setCreating(false);
      throw e;
    }

    cleanUp();
    router.push(`/dashboard/${workspace}`);
  };

  const handlePublishWithToast = () => {
    return toast.promise(
      async () => await handlePublish(formName),
      toastPromiseOptions({})
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Publish</Button>
      </DialogTrigger>
      <DialogContent className="gap-7 font-sans">
        <DialogHeader>
          <DialogTitle>Create new form</DialogTitle>
        </DialogHeader>
        <div className=" grid gap-7">
          <Label>Form name</Label>
          <Input
            value={formName}
            onChange={(e) => setFormName(e?.currentTarget?.value)}
            placeholder="Please provide form name"
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePublishWithToast();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button
            disabled={creating}
            onClick={() => setOpen(false)}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button onClick={handlePublishWithToast}>
            <span>Create</span>
            {creating && <Loader className={`animate-spin`} />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const filterFormFields = (jsonDoc: JsonDoc, formId: string) => {
  const filterInputFields = jsonDoc?.content?.filter((f) =>
    f?.type?.includes("Input")
  );
  const mapFilteredFields = filterInputFields?.map((f, i) => {
    return {
      id: f?.attrs?.id,
      form: formId,
      // @ts-ignore
      label: f?.content?.[0]?.text?.trim() || f?.attrs?.label,
      type: f?.type,
      subType: f?.attrs?.type,
      placeholder: f?.attrs?.placeholder,
      order: i,
      isRequired: f?.attrs?.isRequired,
      file_limit: f?.attrs?.file_limit,
      choices: f?.attrs?.options,
      multiple_select: f?.attrs?.type !== "single",
    };
  });

  return mapFilteredFields;
};

export const postFormFields = async (jsonDoc: JsonDoc, formId: string) => {
  const fields = filterFormFields(jsonDoc, formId);

  try {
    const res = await apiClient.post(`/api/formField`, fields);
    return res?.status === 200;
  } catch (e) {
    await apiClient.delete(`/api/form/${formId}`);
    throw new Error("failed-to-postFormFields");
  }
};

export const handleFormSchema = (jsonDoc: JsonDoc): JsonDoc => {
  if (!jsonDoc) return;
  const doc = jsonDoc;
  let multipleChoiceId: string;

  const alterContent = doc?.content?.map((c) => {
    if (c?.type === "multipleChoiceInput") {
      multipleChoiceId = v7();
      const mapWithOption = c?.content?.map((opt) => {
        if (opt?.type === "optionNode") {
          return {
            ...opt,
            attrs: {
              // @ts-ignore
              ...opt?.attrs,
              parentId: multipleChoiceId,
            },
          };
        }

        return opt;
      });
      return {
        ...c,
        attrs: { ...c.attrs, id: multipleChoiceId },
        content: mapWithOption,
      };
    }

    if (c?.type?.includes("Input") && c?.type !== "multipleChoiceInput") {
      return { ...c, attrs: { ...c.attrs, id: v7() } };
    }
    return c;
  });

  return { ...jsonDoc, content: alterContent };
};

export const getCustomization = () => {
  return {
    formBackgroundColor: useEditorStore.getState().formBackgroundColor,
    formColorScheme: useEditorStore.getState().formColorScheme,
    formFontFamliy: useEditorStore.getState().formFontFamliy,
    formFontSize: useEditorStore.getState().formFontSize,
    formTextColor: useEditorStore.getState().formTextColor,
    actionBtnBorderColor: useEditorStore.getState().actionBtnBorderColor,
    actionBtnColor: useEditorStore.getState().actionBtnColor,
    actionBtnSize: useEditorStore.getState().actionBtnSize,
    actionBtnTextColor: useEditorStore.getState().actionBtnTextColor,
    inputBackgroundColor: useEditorStore.getState().inputBackgroundColor,
    inputBorderColor: useEditorStore.getState().inputBorderColor,
    customThankyouMessage: useEditorStore.getState().customThankyouMessage,
  };
};

export const handleSchema = (jsonDoc: JsonDoc): JsonDoc => {
  if (!jsonDoc) return;
  const doc = jsonDoc;
  const content: content = [];
  let multipleChoiceId: string;

  const idMap = {} as Record<string, string>;

  for (const c of doc.content) {
    if (!c.attrs?.id) continue;
    const newId = v7();

    if (c?.type === "multipleChoiceInput") {
      multipleChoiceId = newId;
      idMap[c.attrs.id] = multipleChoiceId;

      const mapOptionsWithParent = c?.content?.map((opt) => {
        if (opt?.type === "optionNode") {
          return {
            ...opt,
            attrs: {
              // @ts-ignore
              ...opt?.attrs,
              parentId: multipleChoiceId,
            },
          };
        }

        return opt;
      });

      content.push({
        ...c,
        attrs: { ...c.attrs, id: multipleChoiceId },
        content: mapOptionsWithParent,
      });
    }

    if (c?.type?.includes("Input") && c?.type !== "multipleChoiceInput") {
      idMap[c.attrs.id] = newId;
      content.push({ ...c, attrs: { ...c.attrs, id: newId } });
    }

    if (c.type?.includes("conditionalLogic")) {
      content.push({ ...c });
    }
  }

  const contentWithConditionals = content.map((c) => {
    if (c.type !== "conditionalLogic") return c;

    const { action, conditions, id, logicOperator, targetFieldIds } =
      c.attrs as ConditionalLogicAttrs;

    const mappedConditions = conditions.map((con) => ({
      ...con,
      fieldId: idMap[con.fieldId] || con.fieldId,
    }));

    const mappedTarget = targetFieldIds.map((id) => idMap[id] || id);

    return {
      ...c,
      attrs: {
        action,
        conditions: mappedConditions,
        targetFieldIds: mappedTarget,
        id,
        logicOperator,
      } as ConditionalLogicAttrs,
    };
  });

  return { ...jsonDoc, content: contentWithConditionals };
};

// first it will not able to replicate , because of same id ,
