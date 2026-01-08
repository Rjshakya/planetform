import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/axios";
import { toastPromiseOptions } from "@/lib/toast";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

interface IworkspaceData {
  name: string;
}

export const WorkspaceSettings = ({
  workspaceName,
}: {
  workspaceName: string;
}) => {
  const [workspaceData, setWorkspaceData] = useState<IworkspaceData>({
    name: workspaceName || " ",
  });
  const [disable, setDisable] = useState(true);
  const { workspaceId } = useParams();

  const handleWorkspaceUpdate = async (params: IworkspaceData) => {
    try {
      const body = {
        data: params,
        workspaceId,
      };
      const { status } = await apiClient.patch(`/api/workspace`, body);
      if (status === 200) {
        mutate(`/api/form/workspace/${workspaceId}`);
      }
    } catch (e) {}
  };

  const handleWorkspaceUpdateWithToast = (params: IworkspaceData) => {
    return toast.promise(
      async () => handleWorkspaceUpdate(params),
      toastPromiseOptions({})
    );
  };

  return (
    <Card className="border-none shadow-none rounded-sm bg-background px-0 ">
      <CardContent className="grid gap-3 px-1">
        <div className="bg-muted rounded-md grid gap-3 px-2 py-4">
          <Label>Name</Label>
          <Input
            value={workspaceData.name}
            onChange={(e) => {
              setWorkspaceData({
                ...workspaceData,
                name: e.target?.value,
              });
              if (workspaceName !== e.target.value) {
                setDisable(false);
              } else {
                setDisable(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleWorkspaceUpdate(workspaceData);
                setDisable(true);
              }
            }}
            placeholder="Workspace Name"
            className=" text-muted-foreground"
          />
        </div>
      </CardContent>
      <CardFooter className=" px-1">
        <CardAction className="">
          <Button
            onClick={() => handleWorkspaceUpdateWithToast(workspaceData)}
            variant={"destructive"}
            className="w-[220px] h-12"
            size={"lg"}
            disabled={disable}
          >
            Submit
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
};
