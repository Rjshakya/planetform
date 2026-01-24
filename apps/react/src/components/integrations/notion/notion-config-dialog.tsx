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
import type { NotionConfig } from "../types";

interface NotionConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: NotionConfig;
  onConfigChange: (config: NotionConfig) => void;
  onConnect: () => any
  formFields: {
    id: string;
    label: string;
    type: string;
    order: number;
  }[];
}

export const NotionConfigDialog = ({
  open,
  onOpenChange,
  config,
  onConfigChange,
  onConnect,
  formFields,
}: NotionConfigDialogProps) => {
  const handleTitleChange = (title: string) => {
    onConfigChange({ ...config, title, formFields });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Notion</DialogTitle>
          <DialogDescription>
            Connect your Notion workspace and create a new database for form
            submissions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notion-db-title">Database Title</Label>
            <Input
              id="notion-db-title"
              placeholder="My Form Submissions"
              value={config.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onConnect();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              A new Notion database will be created with this title
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onConnect}
            disabled={!config.title}
            className="w-full"
          >
            Connect Notion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
