import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { GmailConfig } from "../types";

interface GmailConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: GmailConfig;
  onConfigChange: (config: GmailConfig) => void;
  onConnect: () => any
  userFrom: string;
}

export const GmailConfigDialog = ({
  open,
  onOpenChange,
  config,
  onConfigChange,
  onConnect,
  userFrom,
}: GmailConfigDialogProps) => {
  const handleFieldChange = (
    field: keyof GmailConfig,
    value: string | boolean,
  ) => {
    onConfigChange({ ...config, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Gmail Notifications</DialogTitle>
          <DialogDescription>
            Set up automatic email notifications for form submissions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="from">From Email</Label>
            <Input
              id="from"
              type="email"
              placeholder="noreply@yourdomain.com"
              value={userFrom}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To Email</Label>
            <Input
              id="to"
              type="email"
              placeholder="notifications@yourdomain.com"
              value={config.to}
              onChange={(e) => handleFieldChange("to", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="New form submission received"
              value={config.subject}
              onChange={(e) => handleFieldChange("subject", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              placeholder="You received a new form submission..."
              value={config.body}
              onChange={(e) => handleFieldChange("body", e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="dynamic-body"
              checked={config.isDynamicBody}
              onCheckedChange={(c) => handleFieldChange("isDynamicBody", c)}
            />
            <Label htmlFor="dynamic-body">
              Use dynamic body with form data
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onConnect}
            disabled={!config.to || !config.subject || !config.body}
            className="w-full"
          >
            Create Integration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
