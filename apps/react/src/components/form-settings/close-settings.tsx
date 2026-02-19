import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toggleFormClose } from "@/hooks/use-form-settings";
import { DatePickerInput } from "../ui/date-picker";
import { Separator } from "../ui/separator";
import { InputGroup, InputGroupInput } from "../ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
}: CloseSettingsProps) => {
  const [toggleAdditionSetting, setToggleAddtionalSetting] = useState(false);
  const [additionalSetting, setAdditonalSetting] = useState<{
    date: string | null;
    submission: number | null;
    closedMessage: string;
  }>({
    date: currentSettings.closingTime || null,
    submission: currentSettings.closeAfterSubmissions || null,
    closedMessage: currentSettings.closedMessage || "",
  });

  const toggleClose = (c: boolean) =>
    toast.promise(
      toggleFormClose({
        formId,
        closed: c,
        closeAfterSubmissions: null,
        closingTime: null,
      }),
      {
        success: `Form is ${c ? "closed" : "open"}`,
        error: "Failed to close form",
      },
    );

  const handleConfirm = async () => {
    try {
      const { date, submission, closedMessage } = additionalSetting;

      const payload = {
        submission: submission,
        date: date ? new Date(date) : null,
        closedMessage: closedMessage || "This form is closed",
      };

      await toggleFormClose({
        closed: false,
        closeAfterSubmissions: payload.submission,
        closingTime: payload.date,
        closedMessage: payload.closedMessage,
        formId,
      });

      return toast.success(
        `Your form is scheduled to close at Date ${payload.date || "N/A"} or after ${payload.submission || "N/A"} Submissions`,
      );
    } catch {
      toast.error("failed to schedule close form");
    }
  };

  return (
    <Card className="bg-muted overflow-hidden">
      <CardHeader className="pb-4 flex items-center justify-between">
        <CardTitle>Close form</CardTitle>
        <div className="flex items-center gap-2">
          <Switch
            checked={!!currentSettings.closed}
            onCheckedChange={toggleClose}
          />
          <Button
            onClick={() => setToggleAddtionalSetting(!toggleAdditionSetting)}
            size={"icon-xs"}
            variant={"outline"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-none"
              viewBox="0 0 24 24"
            >
              <path
                d="M19.92 8.9502L13.4 15.4702C12.63 16.2402 11.37 16.2402 10.6 15.4702L4.07996 8.9502"
                className="stroke-foreground"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
        {toggleAdditionSetting && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <div className=" mb-4">Schedule closing</div>
              <div className="bg-background p-4 rounded-sm">
                <div className="grid gap-3">
                  <Label>Close on date</Label>
                  <div className="flex gap-2 items-center">
                    <DatePickerInput
                      dateProp={additionalSetting.date}
                      className="w-52"
                      onDateChange={(d) =>
                        setAdditonalSetting({
                          ...additionalSetting,
                          date: d ? new Date(d).toISOString() : null,
                        })
                      }
                    />
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            onClick={() =>
                              setAdditonalSetting({
                                ...additionalSetting,
                                date: null,
                              })
                            }
                            size={"icon"}
                            variant={"secondary"}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M14.8901 5.08039C14.0201 4.82039 13.0601 4.65039 12.0001 4.65039C7.21008 4.65039 3.33008 8.53039 3.33008 13.3204C3.33008 18.1204 7.21008 22.0004 12.0001 22.0004C16.7901 22.0004 20.6701 18.1204 20.6701 13.3304C20.6701 11.5504 20.1301 9.89039 19.2101 8.51039"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16.13 5.32L13.24 2"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16.13 5.32031L12.76 7.78031"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                        }
                      />
                      <TooltipContent>Reset</TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Form will closed on the date you set
                  </span>
                </div>

                <Separator className={"my-5"} />

                <div className="grid gap-3">
                  <Label>Close on submissions</Label>
                  <div className="flex gap-2 items-center">
                    <InputGroup className="w-52">
                      <InputGroupInput
                        value={additionalSetting.submission || ""}
                        onChange={(e) =>
                          setAdditonalSetting({
                            ...additionalSetting,
                            submission: e.target.valueAsNumber,
                          })
                        }
                        type="number"
                        placeholder="50"
                      />
                    </InputGroup>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            onClick={() =>
                              setAdditonalSetting({
                                ...additionalSetting,
                                submission: null,
                              })
                            }
                            size={"icon"}
                            variant={"secondary"}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M14.8901 5.08039C14.0201 4.82039 13.0601 4.65039 12.0001 4.65039C7.21008 4.65039 3.33008 8.53039 3.33008 13.3204C3.33008 18.1204 7.21008 22.0004 12.0001 22.0004C16.7901 22.0004 20.6701 18.1204 20.6701 13.3304C20.6701 11.5504 20.1301 9.89039 19.2101 8.51039"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16.13 5.32L13.24 2"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16.13 5.32031L12.76 7.78031"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                        }
                      />
                      <TooltipContent>Reset</TooltipContent>
                    </Tooltip>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Form will closed after number of submissions you set
                  </span>
                </div>
              </div>

              <div className=" my-4">Closed message</div>
              <div className="bg-background p-4 rounded-sm">
                <div className="grid gap-3">
                  <div className="">
                    <Textarea
                      placeholder="Oops , form is closed now :("
                      value={additionalSetting.closedMessage}
                      onChange={(e) =>
                        setAdditonalSetting({
                          ...additionalSetting,
                          closedMessage: e.target.value,
                        })
                      }
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Message to show , when form is close
                  </span>
                </div>
              </div>

              <div className="mt-5 w-full">
                <Button onClick={handleConfirm}>Confirm</Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
