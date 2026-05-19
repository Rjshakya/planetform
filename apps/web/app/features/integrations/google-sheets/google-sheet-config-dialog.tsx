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
import type { GoogleSheetConfig } from "../types";

interface GoogleSheetConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: GoogleSheetConfig;
  onConfigChange: (config: GoogleSheetConfig) => void;
  onConnect: () => any;
}

export const GoogleSheetConfigDialog = ({
  open,
  onOpenChange,
  config,
  onConfigChange,
  onConnect,
}: GoogleSheetConfigDialogProps) => {
  const handleSheetTitleChange = (sheetTitle: string) => {
    onConfigChange({ sheetTitle });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Google Sheets</DialogTitle>
          <DialogDescription>
            Connect your Google account and create a new sheet for form
            submissions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sheet-title">Sheet Title</Label>
            <Input
              id="sheet-title"
              placeholder="My Form Submissions"
              value={config.sheetTitle}
              onChange={(e) => handleSheetTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onConnect();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              A new Google Sheet will be created with this title
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onConnect}
            disabled={!config.sheetTitle}
            className="w-full"
          >
            Connect Google Sheets
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
