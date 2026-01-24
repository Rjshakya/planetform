import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { useCurrentEditor, type JSONContent } from "@tiptap/react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { client } from "@/lib/hc";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { toastPromiseOptions } from "@/lib/toast";
import { mutate } from "swr";
import { useEditorStore } from "@/stores/useEditorStore";

interface IFormField {
  form: string;
  label: string;
  id?: string | undefined;
  placeholder?: string | null | undefined;
  type?: string | null | undefined;
  subType?: string | null | undefined;
  order: number;
  isRequired: boolean | null | undefined;
  min?: number | null | undefined;
  max?: number | null | undefined;
  file_limit?: string | null | undefined;
  accepted_file_types?: string[] | null | undefined;
  choices?: unknown[] | null | undefined;
  multiple_select?: boolean | null | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
}

export const PublishForm = () => {
  const { editor } = useCurrentEditor();
  const [formName, setFormName] = useState("");
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace");
  const navigate = useNavigate();
  const { user } = useUser();

  const customization = getCustomization();

  const handlePublish = useCallback(async () => {
    if (!editor || !workspaceId) return;

    const doc = editor.getJSON();
    const res = await client.api.form.$post({
      json: {
        formValues: {
          creator: user.id,
          customerId: user.dodoCustomerId,
          form_schema: JSON.stringify(doc),
          name: formName,
          workspace: workspaceId,
        },
        formCustomisation: JSON.stringify(customization),
      },
    });

    if (!res.ok) throw new Error("failed to publish form");
    const resData = await res.json();
    const form = resData.form;

    if (!form?.shortId) throw new Error("failed to publish form");
    await postFormFields(form.shortId as string, doc);

    mutate(`useWorkspace:${workspaceId}`);
    navigate(`/dashboard/${workspaceId}`);
  }, [editor, user, formName, workspaceId, navigate, customization]);

  if (!workspaceId) {
    return <Navigate to={"/dashboard"} />;
  }
  if (!editor) return null;

  return (
    <Dialog>
      <DialogTrigger render={<Button>Publish</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish form</DialogTitle>
          <DialogDescription>
            make your form live , and start getting submissions
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="form-name">Form name</Label>

          <div className="grid gap-1">
            <Input
              value={formName}
              onChange={(e) => setFormName(e.currentTarget.value)}
              id="form-name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  toast.promise(
                    handlePublish,
                    toastPromiseOptions({
                      success: "Published",
                      error: "failed to publish form",
                      loading: "publishing...",
                    }),
                  );
                }
              }}
            />
            <Button
              size={"lg"}
              onClick={() => {
                toast.promise(
                  handlePublish,
                  toastPromiseOptions({
                    success: "Published",
                    error: "failed to publish form",
                    loading: "publishing...",
                  }),
                );
              }}
            >
              Make it live
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const filterFormFieldsFromContent = (
  jsonContent: JSONContent,
  form: string,
) => {
  const inputNodes = jsonContent.content?.filter((n) =>
    n.type?.includes("Input"),
  );

  const formFields: IFormField[] = inputNodes!.map((f, i) => {
    return {
      form: form,
      label: f?.content?.[0]?.text?.trim() || f?.attrs?.label.trim(),
      id: f.attrs?.id,
      type: f?.type,
      subType: f?.attrs?.type,
      order: i,
      isRequired: f?.attrs?.isRequired,
      choices: f?.attrs?.options,
    };
  });

  return formFields;
};

export const postFormFields = async (
  formId: string,
  jsonContent: JSONContent,
) => {
  const formFields = filterFormFieldsFromContent(jsonContent, formId);

  try {
    await client.api.formField.$post({ json: formFields });
  } catch (e) {
    await client.api.form[":formId"].$delete({ param: { formId } });
  }
};

export const getCustomization = () => {
  const {
    formBackgroundColor,
    formColorScheme,
    formFontFamliy,
    formFontSize,
    formTextColor,
    actionBtnBorderColor,
    actionBtnColor,
    actionBtnSize,
    actionBtnTextColor,
    inputBackgroundColor,
    inputBorderColor,
    customThankyouMessage,
  } = useEditorStore.getState();

  return {
    formBackgroundColor,
    formColorScheme,
    formFontFamliy,
    formFontSize,
    formTextColor,
    actionBtnBorderColor,
    actionBtnColor,
    actionBtnSize,
    actionBtnTextColor,
    inputBackgroundColor,
    inputBorderColor,
    customThankyouMessage,
  };
};
