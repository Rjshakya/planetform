import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  keyOfUseSlackChannels,
  useSlackChannels,
} from "@/hooks/use-integrations";
import { useEffect, useState } from "react";
import { useFormFields } from "@/hooks/use-formFields";
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
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { toastPromiseOptions } from "@/lib/toast";
import MultiSelect from "@/components/common/multi-select";

interface SlackConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (params: {
    formId: string;
    channelId: string;
    channelName: string;
    creator: string;
    fields: string[];
    message: string;
  }) => Promise<void>;
  formId: string;
}

export const SlackConfigDialog = ({
  open,
  onOpenChange,
  onConnect,
  formId,
}: SlackConfigDialogProps) => {
  const { formFields, formFieldsError, formFieldsLoading } =
    useFormFields(formId);
  const { channels, channelsLoading, slackChannelsError } = useSlackChannels(
    keyOfUseSlackChannels(formId),
  );

  const [selectChannels, setSelectChannels] = useState<
    {
      channelId: string;
      channelName: string;
      creator: string;
    }[]
  >([]);

  const [fields, setFields] = useState<{ label: string; value: string }[]>();
  const [onConnectParams, setOnConnectParams] = useState<{
    formId: string;
    channelId: string;
    channelName: string;
    creator: string;
    fields: string[];
    message: string;
  }>({
    fields: [],
    message: "",
    formId,
    channelId: "",
    channelName: "",
    creator: "",
  });

  useEffect(() => {
    if (slackChannelsError || formFieldsError) {
      toast.error(
        slackChannelsError
          ? "failed to get slack channels"
          : "failed to get form fields",
      );
    }
  }, [slackChannelsError, formFieldsError]);

  useEffect(() => {
    if (!formFields || !formFields.length) return;
    (() => {
      const _fields = formFields.map((v) => ({ label: v.label, value: v.id }));
      setFields(_fields);
      setOnConnectParams({
        ...onConnectParams,
        fields: _fields.map((v) => v.value),
      });
    })();
  }, [formFields]);

  useEffect(() => {
    if (!channels) return;
    const _channels = channels.map((c) => ({
      channelName: c.name,
      channelId: c.id,
      creator: c.creator,
    }));
    (() => setSelectChannels(_channels))();
  }, [channels]);

  if (!formFields || !channels) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Slack</DialogTitle>
          <DialogDescription>
            Enter your Slack incoming webhook URL to receive form submissions.
          </DialogDescription>
        </DialogHeader>
        {channelsLoading || formFieldsLoading ? (
          <div className="size-full grid place-content-center">
            <Loader className=" animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* select channels */}
            <div className="space-y-2 w-full">
              <Label htmlFor="slack-channels">Slack channel</Label>
              {channels && channels.length > 0 && (
                <Select
                  id="slack-channels"
                  value={selectChannels[0].channelId}
                  onValueChange={(v) => {
                    if (!v) return;
                    const _channel = selectChannels.find(
                      (c) => c.channelId === v,
                    );
                    if (!_channel) return;
                    setOnConnectParams({
                      ...onConnectParams,
                      ..._channel,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue className={""}>
                      {onConnectParams.channelName || "select channel"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className={"w-full"}>
                    <SelectGroup>
                      <SelectLabel>Channels</SelectLabel>
                      {channels.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* select fields */}
            <div className="space-y-2 w-full">
              {/* <Label htmlFor="form-inputs">Inputs</Label> */}
              {fields && fields.length > 0 && (
                <MultiSelect
                  commandProps={{ label: "Select Inputs" }}
                  label="Inputs"
                  value={fields}
                  defaultOptions={fields}
                  emptyIndicator={
                    <p className="text-center text-sm">No results found</p>
                  }
                  hideClearAllButton
                  hidePlaceholderWhenSelected
                  placeholder="Select Inputs"
                  onChange={(v) => {
                    setFields(v);
                    setOnConnectParams({
                      ...onConnectParams,
                      fields: v.map((v) => v.value),
                    });
                  }}
                />
              )}
            </div>

            {/* message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={onConnectParams.message}
                onChange={(e) => {
                  setOnConnectParams({
                    ...onConnectParams,
                    message: e.currentTarget.value,
                  });
                }}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={() =>
              toast.promise(
                () => onConnect(onConnectParams),
                toastPromiseOptions({
                  error: "failed to integrate with slack",
                  loading: "integrating...",
                  success: "Slack integrated",
                }),
              )
            }
            className="w-full"
          >
            Connect Slack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
