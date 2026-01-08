"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCurrentEditor } from "@tiptap/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui//button";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/axios";
import { mutate } from "swr";
import {
  filterFormFields,
  getCustomization,
} from "../../../create/_components/PublishForm";
import { toastPromiseOptions } from "@/lib/toast";

export const EditForm = () => {
  const { editor } = useCurrentEditor();
  const { workspaceId, formId } = useParams();
  const searchParams = useSearchParams();
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);

  const [formName, setFormName] = useState(searchParams.get("name") || "");
  const router = useRouter();

  const handleSaveEditForm = async () => {
    if (!editor) return;
    const schema = editor.getJSON();
    const fields = filterFormFields(schema, formId as string);
    const formCustomisation = JSON.stringify(getCustomization());

    setCreating(true);
    try {
      await apiClient.put(`/api/form`, {
        formId,
        formName,
        form_schema: JSON.stringify(schema),
        fields,
        formCustomisation,
      });

      setOpen(false);
      router.push(`/dashboard/${workspaceId}`);
      mutate(`/api/form/${formId}`);
    } catch (e) {
      throw e;
    }

    setCreating(false);
  };

  const handleSaveEditFormWithToast = () => {
    return toast.promise(handleSaveEditForm, toastPromiseOptions({}));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Save</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new form</DialogTitle>
        </DialogHeader>
        <div className=" grid gap-2.5">
          <Label>Form name</Label>
          <Input
            value={formName}
            onChange={(e) => setFormName(e?.currentTarget?.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveEditFormWithToast();
              }
            }}
            placeholder="please provide form name"
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
          <Button onClick={handleSaveEditFormWithToast}>
            <span>Save</span>
            {creating && <Loader className={`animate-spin`} />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
