import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toggleFormClose } from "@/hooks/use-form";
import { cn } from "@/lib/utils";

type CloseMethod = "immediate" | "date" | "submissions";

interface CloseSettingsProps {
  formId: string;
  currentSettings: {
    closed: boolean | null;
    closingTime: string | null;
    closeAfterSubmissions: number | null;
    closedMessage: string | null;
  };
  currentSubmissionCount?: number;
}

export const CloseSettings = ({
  formId,
  currentSettings,
  currentSubmissionCount = 0,
}: CloseSettingsProps) => {
  const [closeMethod, setCloseMethod] = useState<CloseMethod>(() => {
    if (currentSettings.closed) return "immediate";
    if (currentSettings.closingTime) return "date";
    if (currentSettings.closeAfterSubmissions) return "submissions";
    return "immediate";
  });

  const [closingDate, setClosingDate] = useState<Date | undefined>(() => {
    return currentSettings.closingTime
      ? new Date(currentSettings.closingTime)
      : undefined;
  });

  const [closingTime, setClosingTime] = useState<string>(() => {
    if (currentSettings.closingTime) {
      return format(new Date(currentSettings.closingTime), "HH:mm");
    }
    return "23:59";
  });

  const [submissionLimit, setSubmissionLimit] = useState<string>(() => {
    return currentSettings.closeAfterSubmissions?.toString() || "";
  });

  const [closedMessage, setClosedMessage] = useState(() => {
    return currentSettings.closedMessage || "This form is closed.";
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const isDateInFuture = useCallback((date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const dateWithTime = new Date(date);
    dateWithTime.setHours(hours, minutes, 0, 0);
    return dateWithTime > new Date();
  }, []);

  const validationError = useMemo(() => {
    if (closeMethod === "date") {
      if (!closingDate) {
        return "Please select a closing date";
      }
      if (!isDateInFuture(closingDate, closingTime)) {
        return "Closing date and time must be in the future";
      }
    }
    if (closeMethod === "submissions") {
      const limit = parseInt(submissionLimit, 10);
      if (!submissionLimit || Number.isNaN(limit) || limit < 1) {
        return "Please enter a valid submission limit (minimum 1)";
      }
    }
    return null;
  }, [closeMethod, closingDate, closingTime, submissionLimit, isDateInFuture]);

  const submissionWarning = useMemo(() => {
    if (closeMethod === "submissions") {
      const limit = parseInt(submissionLimit, 10);
      if (!Number.isNaN(limit) && limit <= currentSubmissionCount) {
        return `Warning: This limit (${limit}) has already been reached (current: ${currentSubmissionCount}). Form will close immediately.`;
      }
    }
    return null;
  }, [closeMethod, submissionLimit, currentSubmissionCount]);

  const handleApply = useCallback(async () => {
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      let closingTimeDate: Date | undefined;
      let submissionCount: number | undefined;

      if (closeMethod === "date" && closingDate) {
        const [hours, minutes] = closingTime.split(":").map(Number);
        closingTimeDate = new Date(closingDate);
        closingTimeDate.setHours(hours, minutes, 0, 0);
      }

      if (closeMethod === "submissions" && submissionLimit) {
        submissionCount = parseInt(submissionLimit, 10);
      }

      await toggleFormClose({
        closed: closeMethod === "immediate",
        formId,
        closingTime: closeMethod === "date" ? closingTimeDate : null,
        closeAfterSubmissions:
          closeMethod === "submissions" ? submissionCount : null,
        closedMessage: closedMessage.trim() || undefined,
      });

      toast.success(
        closeMethod === "immediate"
          ? "Form closed successfully"
          : "Auto-close settings applied successfully",
      );
    } catch (error) {
      toast.error("Failed to update form settings");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    closeMethod,
    closingDate,
    closingTime,
    submissionLimit,
    closedMessage,
    formId,
    validationError,
  ]);

  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle>Form Close Settings</CardTitle>
        <CardDescription>
          Choose how you want to close this form
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={closeMethod}
          onValueChange={(value) => setCloseMethod(value as CloseMethod)}
          className="space-y-4"
        >
          {/* Immediate Close */}
          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="immediate" id="immediate" />
            <div className="space-y-1 leading-none">
              <Label htmlFor="immediate" className="font-medium">
                Close form immediately
              </Label>
              <p className="text-sm text-muted-foreground">
                Form will be closed right now
              </p>
            </div>
          </div>

          {/* Date Close */}
          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="date" id="date" />
            <div className="space-y-3 leading-none flex-1">
              <Label htmlFor="date" className="font-medium">
                Close on specific date
              </Label>
              {closeMethod === "date" && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Popover
                    open={datePickerOpen}
                    onOpenChange={setDatePickerOpen}
                  >
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full sm:w-[240px] justify-start text-left font-normal",
                            !closingDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {closingDate ? (
                            format(closingDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={closingDate}
                        onSelect={(date) => {
                          setClosingDate(date);
                          setDatePickerOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full sm:w-[120px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submission Limit */}
          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="submissions" id="submissions" />
            <div className="space-y-3 leading-none flex-1">
              <Label htmlFor="submissions" className="font-medium">
                Close after number of submissions
              </Label>
              {closeMethod === "submissions" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Close after:
                    </span>
                    <Input
                      type="number"
                      min={1}
                      value={submissionLimit}
                      onChange={(e) => setSubmissionLimit(e.target.value)}
                      placeholder="100"
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      submissions
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Currently: {currentSubmissionCount} submission
                    {currentSubmissionCount !== 1 ? "s" : ""}
                  </p>
                  {submissionWarning && (
                    <p className="text-sm text-amber-600">
                      {submissionWarning}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </RadioGroup>

        {/* Closed Message */}
        <div className="space-y-2 pt-4 border-t">
          <Label htmlFor="closed-message">Closed Form Message</Label>
          <Textarea
            id="closed-message"
            value={closedMessage}
            onChange={(e) => setClosedMessage(e.target.value)}
            placeholder="This form is closed."
            maxLength={500}
            rows={3}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>This message will be shown when the form is closed</span>
            <span>{closedMessage.length}/500</span>
          </div>
        </div>

        {/* Apply Button */}
        <div className="pt-2">
          <Button
            onClick={handleApply}
            disabled={isSubmitting || !!validationError}
            className="w-full sm:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {closeMethod === "immediate" ? "Close Form Now" : "Apply Settings"}
          </Button>
          {validationError && (
            <p className="text-sm text-destructive mt-2">{validationError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
