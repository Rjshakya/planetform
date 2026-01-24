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
import type { SlackConfig } from "../types";

interface SlackConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SlackConfig;
  onConfigChange: (config: SlackConfig) => void;
  onConnect: () => Promise<void>;
}

export const SlackConfigDialog = ({
  open,
  onOpenChange,
  config,
  onConfigChange,
  onConnect,
}: SlackConfigDialogProps) => {
  const handleWebhookUrlChange = (webhookUrl: string) => {
    onConfigChange({ webhookUrl });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Slack</DialogTitle>
          <DialogDescription>
            Enter your Slack incoming webhook URL to receive form submissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={config.webhookUrl}
              onChange={(e) => handleWebhookUrlChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Create a webhook in your Slack workspace settings
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onConnect}
            disabled={!config.webhookUrl}
            className="w-full"
          >
            Connect Slack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
