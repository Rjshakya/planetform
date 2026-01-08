import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-User";
import { apiClient } from "@/lib/axios";
import { toastPromiseOptions } from "@/lib/toast";
import { Loader, TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string) => apiClient.get(url).then((d) => d?.data);
export const Settings = () => {
  const { formId } = useParams();
  const { user } = useUser();
  const { data, error, isLoading } = useSWR(
    () => `/api/form/settings/` + formId,
    fetcher
  );

  const [state, setState] = useState({
    closed: data?.settings?.closed || false,
    closedMessage: data?.settings?.closedMessage || "This form is closed",
    disable: true,
  });

  const handleSubmit = async () => {
    if (!formId || !user?.dodoCustomerId) return;
    const payload = {
      customerId: user?.dodoCustomerId,
      formId,
      ...state,
    };

    try {
      const { status } = await apiClient.post(
        `/api/form/settings/update`,
        payload
      );
    } catch (e) {}
  };

  const handleSubmitWithToast = () => {
    return toast.promise(handleSubmit, toastPromiseOptions({}));
  };

  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center gap-4">
        <span>
          <TriangleAlert className=" text-destructive" />
        </span>
        <p>failed to form details</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <Card className=" border-none shadow-none bg-background">
      <CardContent className="grid gap-4 px-1">
        <div className=" bg-muted/70 rounded-md">
          <Label
            htmlFor="check"
            className=" flex items-center justify-between gap-2  py-4 px-2"
          >
            <span className=" text-base pl-1">Close form</span>
            <Switch
              id="check"
              checked={state.closed}
              onCheckedChange={(c) => {
                setState({ ...state, closed: c, disable: false });
              }}
            />
          </Label>
        </div>
        <div className="grid gap-4 bg-muted/70 py-4 px-2 rounded-md">
          <Label className="pl-1 text-base">Closed message</Label>
          <Textarea
            className=" appearance-none bg-transparent border-none shadow-none"
            value={state.closedMessage}
            onChange={(e) => {
              setState({
                ...state,
                closedMessage: e?.currentTarget?.value,
                disable: false,
              });
            }}
          />
        </div>
      </CardContent>
      <CardFooter className=" px-1">
        <CardAction className="">
          <Button
            onClick={handleSubmitWithToast}
            variant={"destructive"}
            className="w-[220px] h-12"
            size={"lg"}
            disabled={state.disable}
          >
            Submit
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
};
