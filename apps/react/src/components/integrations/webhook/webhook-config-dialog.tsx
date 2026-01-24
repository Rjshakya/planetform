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
import type { WebhookConfig } from "../types";

interface WebhookConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: WebhookConfig;
  onConfigChange: (config: WebhookConfig) => void;
  onConnect: () => any;
}

export const WebhookConfigDialog = ({
  open,
  onOpenChange,
  config,
  onConfigChange,
  onConnect,
}: WebhookConfigDialogProps) => {
  const handleWebhookUrlChange = (webhookUrl: string) => {
    onConfigChange({ webhookUrl });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Webhook</DialogTitle>
          <DialogDescription>
            Enter your webhook URL to receive form submissions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://yourserver.com/webhook"
              value={config.webhookUrl}
              onChange={(e) => handleWebhookUrlChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onConnect();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Form submissions will be POSTed to this URL as JSON
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onConnect}
            disabled={!config.webhookUrl}
            className="w-full"
          >
            {"Create Integration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
