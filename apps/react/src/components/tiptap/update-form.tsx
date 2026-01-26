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
import { useCurrentEditor } from "@tiptap/react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { client } from "@/lib/hc";
import { toast } from "sonner";
import { toastPromiseOptions } from "@/lib/toast";
import { mutate } from "swr";
import {
  filterFormFieldsFromContent,
  getCustomization,
} from "@/lib/publish-form-helpers";
import { keyOfuseForm } from "@/hooks/use-form";

export const UpdateForm = () => {
  const { formId } = useParams();
  const { editor } = useCurrentEditor();
  const [searchParams] = useSearchParams();
  const [formName, setFormName] = useState(searchParams.get("name") || "");
  const navigate = useNavigate();
  const customization = getCustomization();

  const handleUpdate = useCallback(async () => {
    if (!editor || !formId) return;

    const content = editor.getJSON();
    const fields = filterFormFieldsFromContent(content, formId);

    const res = await client.api.form.$put({
      json: {
        fields,
        form_schema: JSON.stringify(content),
        formCustomisation: JSON.stringify(customization),
        formId,
        formName,
      },
    });

    if (!res.ok) throw new Error("failed to update form");
    mutate(keyOfuseForm(formId));
    navigate(-1);
  }, [editor, formId, formName, navigate, customization]);

  if (!editor) return null;

  return (
    <Dialog>
      <DialogTrigger render={<Button>Save</Button>} />
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
                    handleUpdate,
                    toastPromiseOptions({
                      success: "form saved",
                      error: "failed to create form",
                      loading: "saving...",
                    }),
                  );
                }
              }}
            />
            <Button
              size={"lg"}
              onClick={() => {
                toast.promise(
                  handleUpdate,
                  toastPromiseOptions({
                    success: "form saved",
                    error: "failed to create form",
                    loading: "saving...",
                  }),
                );
              }}
            >
              Yes save form
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
