/* eslint-disable */
// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  type CommandProps,
  Node,
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  mergeAttributes,
} from "@tiptap/react";
import { Image, Link, Upload, Loader2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ImagePlaceholderOptions {
  HTMLAttributes: Record<string, any>;
  onUpload?: (url: string) => void;
  onError?: (error: string) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imagePlaceholder: {
      /**
       * Inserts an image placeholder
       */
      insertImagePlaceholder: () => ReturnType;
    };
  }
}

export const ImagePlaceholder = Node.create<ImagePlaceholderOptions>({
  name: "image-placeholder",

  addOptions() {
    return {
      HTMLAttributes: {},
      onUpload: () => {},
      onError: () => {},
    };
  },

  group: "block",

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderComponent, {});
  },

  addCommands() {
    return {
      insertImagePlaceholder: () => (props: CommandProps) => {
        return props.commands.insertContent({
          type: "image-placeholder",
        });
      },
    };
  },
});

function ImagePlaceholderComponent(props: NodeViewProps) {
  const { editor, extension, selected } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [urlError, setUrlError] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const {
    previewUrl,
    fileInputRef,
    handleFileChange,
    handleRemove,
    uploading,
    error,
  } = useImageUpload({
    onUpload: (imageUrl) => {
      editor
        .chain()
        .focus()
        // @ts-ignore
        .setImage({
          src: imageUrl,
          alt: altText || fileInputRef.current?.files?.[0]?.name,
        })
        .run();
      handleRemove();
    },
  });

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileChange({ target: input } as any);
      }
    }
  };

  const handleInsertEmbed = (e: FormEvent) => {
    e.preventDefault();
    const valid = isValidUrl(url);
    if (!valid) {
      setUrlError(true);
      return;
    }
    if (url) {
      //   @ts-ignore
      editor.chain().focus().setImage({ src: url, alt: altText }).run();
      setIsExpanded(false);
      setUrl("");
      setAltText("");
    }
  };

  return (
    <NodeViewWrapper className="w-full">
      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle className="flex  items-center justify-between gap-1">
            Add Image
            <Button
              onClick={() => {
                props.deleteNode();
              }}
              variant="ghost"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <Tabs
            value={activeTab}
            onValueChange={(v: any) => setActiveTab(v)}
            className="w-full"
          >
            <TabsList className="grid  grid-cols-2 min-h-9 w-fit">
              <TabsTrigger className={"px-6"} value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger className={"px-6"} value="url">
                <Link className="mr-2 h-4 w-4" />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  "my-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                  isDragActive && "border-primary bg-primary/10",
                  error && "border-destructive bg-destructive/10",
                )}
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto max-h-50 rounded-lg object-cover"
                    />
                    <div className="space-y-2">
                      <Input
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Alt text (optional)"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={handleRemove}
                          disabled={uploading}
                        >
                          Remove
                        </Button>
                        <Button disabled={uploading}>
                          {uploading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-56 flex items-center justify-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />

                    <div className="">
                      <div>
                        <div className=" flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-18 fill-foreground"
                            viewBox="0 0 24 24"
                          >
                            <g clipPath="url(#clip0_4418_4278)">
                              <path
                                d="M13.47 14.3896H10.53C9.26 14.3896 8.5 15.1496 8.5 16.4196V19.3596C8.5 20.6296 9.26 21.3896 10.53 21.3896H13.47C14.74 21.3896 15.5 20.6296 15.5 19.3596V16.4196C15.5 15.1496 14.74 14.3896 13.47 14.3896ZM14.41 18.3196C14.31 18.4196 14.16 18.4896 14 18.4996H12.59L12.6 19.8896C12.59 20.0596 12.53 20.1996 12.41 20.3196C12.31 20.4196 12.16 20.4896 12 20.4896C11.67 20.4896 11.4 20.2196 11.4 19.8896V18.4896L10 18.4996C9.67 18.4996 9.4 18.2196 9.4 17.8896C9.4 17.5596 9.67 17.2896 10 17.2896L11.4 17.2996V15.8996C11.4 15.5696 11.67 15.2896 12 15.2896C12.33 15.2896 12.6 15.5696 12.6 15.8996L12.59 17.2896H14C14.33 17.2896 14.6 17.5596 14.6 17.8896C14.59 18.0596 14.52 18.1996 14.41 18.3196Z"
                                fill="white"
                                style={{ fill: "var(--fillg)" }}
                              />
                              <path
                                opacity="0.4"
                                d="M21.74 11.7396C21.13 9.73956 19.61 8.29956 17.7 7.86956C17.14 5.36956 15.6 3.57956 13.42 2.89956C11.04 2.16956 8.28 2.87956 6.55 4.68956C5.02 6.27956 4.52 8.46956 5.11 10.7996C2.98 11.3196 2 13.1796 2 14.8596C2 16.7396 3.23 18.8496 5.97 19.0396H8.5V16.4096C8.5 15.1396 9.26 14.3796 10.53 14.3796H13.47C14.74 14.3796 15.5 15.1396 15.5 16.4096V19.0396H16.31C16.32 19.0396 16.34 19.0396 16.35 19.0396C17.77 19.0396 19.13 18.5096 20.17 17.5596C21.8 16.1396 22.4 13.9096 21.74 11.7396Z"
                                fill="white"
                                style={{ fill: "var(--fillg)" }}
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_4418_4278">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            if (!fileInputRef.current) return;
                            fileInputRef.current.click();
                          }}
                          variant={"secondary"}
                          className=""
                        >
                          Click to upload file or drag and drop
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <p className="mt-2 text-sm text-destructive">{error}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError(false);
                    }}
                    placeholder="Enter image URL..."
                  />
                  {urlError && (
                    <p className="text-xs text-destructive">
                      Please enter a valid URL
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Alt text (optional)"
                  />
                </div>
                <Button
                  onClick={handleInsertEmbed}
                  className="w-full"
                  disabled={!url}
                >
                  Add Image
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </NodeViewWrapper>
  );
}
