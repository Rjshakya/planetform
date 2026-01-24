import { useCallback } from "react";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IntegrationCard } from "../types";

interface BaseIntegrationProps {
  integration: IntegrationCard;
  formId: string;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  swrKey: string;
  children: React.ReactNode;
}

export const BaseIntegration = ({
  integration,
  formId,
  onConnect,
  onDisconnect,
  swrKey,
  children,
}: BaseIntegrationProps) => {
  const handleDisconnect = useCallback(async () => {
    if (!integration.connected || !formId) return;
    await onDisconnect();
    mutate(swrKey);
  }, [integration, formId, onDisconnect, swrKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration.name}</CardTitle>
        <CardDescription>
          {integration.connected
            ? `Connected to ${integration.name}`
            : integration.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {integration.connected ? (
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            Disconnect
          </Button>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};
