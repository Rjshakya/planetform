import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { clientUrl } from "@/lib/hc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!window.navigator) return;
    await window.navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
};

export const EmbedHome = () => {
  const { formId } = useParams();
  const formUrl = `${clientUrl}/${formId}`;
  const [iframeWidth, setIframeWidth] = useState("100%");
  const [iframeHeight, setIframeHeight] = useState("600");

  const iframeCode = `<iframe\n  src="${formUrl}"\n  width="${iframeWidth}"\n  height="${iframeHeight}"\n  frameborder="0"\n  allowfullscreen\n></iframe>`;

  const { copied: copiedUrl, copy: copyUrl } = useCopy();
  const { copied: copiedIframe, copy: copyIframe } = useCopy();

  return (
    <div className="grid gap-4">
      {/* Direct Link */}
      <Card>
        <CardHeader>
          <CardTitle>Direct Link</CardTitle>
          <CardDescription>Share this link anywhere</CardDescription>
        </CardHeader>
        <CardContent>
          <InputGroup>
            <InputGroupInput value={formUrl} readOnly />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                onClick={() => copyUrl(formUrl)}
                variant={copiedUrl ? "secondary" : "ghost"}
              >
                {copiedUrl ? <Check className="size-4" /> : <Copy className="size-4" />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </CardContent>
      </Card>

      {/* iframe Embed */}
      <Card>
        <CardHeader>
          <CardTitle>iframe Embed</CardTitle>
          <CardDescription>Copy this HTML to embed the form on your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Width</Label>
              <Input
                value={iframeWidth}
                onChange={(e) => setIframeWidth(e.target.value)}
                placeholder="100% or 600px"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Height</Label>
              <Input
                value={iframeHeight}
                onChange={(e) => setIframeHeight(e.target.value)}
                placeholder="600"
              />
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={iframeCode}
              readOnly
              rows={5}
              className="font-mono text-sm pr-10"
            />
            <button
              onClick={() => copyIframe(iframeCode)}
              className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-muted transition-colors"
              title="Copy"
            >
              {copiedIframe ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>See how the embedded form will look</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden bg-muted">
            <iframe
              src={formUrl}
              width={iframeWidth}
              height={iframeHeight}
              style={{
                width: iframeWidth,
                height: `${iframeHeight}px`,
              }}
              className="block"
              title="Form preview"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
