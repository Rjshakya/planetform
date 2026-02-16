import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormFields } from "@/hooks/use-formFields";
import { Loader } from "lucide-react";
import { useState } from "react";

export interface EmailConfig {
  subject: string;
  body: string;
  emailFieldId: string;
}

interface EmailConfigDialogProps {
  formId: string;
  onConnect: (config: EmailConfig) => void;
}

export const EmailConfigDialog = ({
  onConnect,
  formId,
}: EmailConfigDialogProps) => {
  const [_config, setConfig] = useState<EmailConfig>({
    body: "",
    emailFieldId: "",
    subject: "",
  });

  const { formFields, formFieldsLoading } = useFormFields(formId);

  return (
    <Dialog>
      <DialogTrigger render={<Button variant={"secondary"}>Connect</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Email integration</DialogTitle>
          <DialogDescription>Send email to respondents.</DialogDescription>
        </DialogHeader>
        {formFieldsLoading ? (
          <div className="grid place-content-center">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="from">From Email</Label>
              <Input
                id="from"
                type="email"
                defaultValue={"notifications@planetform.xyz"}
                placeholder="notifications@planetform.xyz"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To Email</Label>
              <Select
                value={_config.emailFieldId}
                onValueChange={(v) => {
                  if (!v) return;
                  setConfig({ ..._config, emailFieldId: v });
                }}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue>
                    {(formFields &&
                      formFields?.find((f) => f.id === _config.emailFieldId)
                        ?.label) ||
                      "choose email field"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Email Fields</SelectLabel>
                    {formFields && formFields.length > 0 ? (
                      formFields
                        .filter((f) => f.type === "emailInput")
                        .map((f) => {
                          return (
                            <SelectItem value={f?.id}>{f?.label}</SelectItem>
                          );
                        })
                    ) : (
                      <SelectItem>No email fields in your form</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={_config.subject}
                onChange={(e) =>
                  setConfig({ ..._config, subject: e.target.value })
                }
                placeholder="New form submission received"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                placeholder="You received a new form submission..."
                rows={4}
                value={_config.body}
                onChange={(e) =>
                  setConfig({ ..._config, body: e.target.value })
                }
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => onConnect(_config)} className="w-full">
            Create Integration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
