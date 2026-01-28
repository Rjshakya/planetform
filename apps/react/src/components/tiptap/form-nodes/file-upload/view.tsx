import { type NodeViewProps } from "@tiptap/core";
import { type InsertFileUploadParams } from "./node";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { useFormStore } from "@/stores/useformStore";
// import FileUploadComp from "@/components/comp-547";
import { Button } from "@/components/ui/button";
import {
  AlertCircleIcon,
  ImageIcon,
  Loader,
  UploadIcon,
  XIcon,
} from "lucide-react";
import {
  type FileMetadata,
  type FileUploadState,
  type FileWithPreview,
  formatBytes,
} from "@/hooks/use-file-upload";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import { validationFn } from "@/lib/FormFieldValidations";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { handleFileUpload } from "@/lib/file";
import { RequiredIcon } from "../../required-icon";

export const FileUploadInputView = (props: NodeViewProps) => {
  const { id, isRequired, label, type, maxFiles, maxSize, accept } = props?.node
    ?.attrs as InsertFileUploadParams;

  const editor = props.editor;
  const { respondentId } = useFormStore((s) => s);
  const form = useFormStore.getState().getHookForm();
  const [state, setState] = useState<FileUploadState>({
    files: [],
    isDragging: false,
    errors: [],
    isUploading: false,
  });
  const pathName = window.location.pathname;
  const { formId } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      if (file instanceof File) {
        if (file.size > maxSize) {
          return `File "${file.name}" exceeds the maximum size of ${formatBytes(
            maxSize,
          )}.`;
        }
      } else {
        if (file?.size > maxSize) {
          return `File "${file.name}" exceeds the maximum size of ${formatBytes(
            maxSize,
          )}.`;
        }
      }

      if (accept !== "*") {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const fileType = file instanceof File ? file.type || "" : file.type;
        const fileExtension = `.${
          file instanceof File
            ? file.name.split(".").pop()
            : file.name.split(".").pop()
        }`;

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension.toLowerCase() === type.toLowerCase();
          }
          if (type.endsWith("/*")) {
            const baseType = type.split("/")[0];
            return fileType.startsWith(`${baseType}/`);
          }
          return fileType === type;
        });

        if (!isAccepted) {
          return `File "${
            file instanceof File ? file.name : file.name
          }" is not an accepted file type.`;
        }
      }

      return null;
    },
    [accept, maxSize],
  );

  // main fn that uploads file to storage
  const createPreview = useCallback(
    async (file: File | FileMetadata): Promise<string | undefined> => {
      if (file instanceof File) {
        setState((p) => ({ ...p, isUploading: true }));
        const { name } = file;
        let url = URL.createObjectURL(file);

        if (pathName.includes("/edit")) {
          setTimeout(() => {
            setState((p) => ({ ...p, isUploading: false }));
          }, 500);
          return url;
        }

        if (!respondentId || !formId) {
          setState((p) => ({ ...p, isUploading: false }));
          toast.error("Can't upload file please refresh or try again later");
          return;
        }

        // try {
        //   const res = await apiClient.post("/api/file/respondent", {
        //     fileName: name,
        //     formId,
        //     respondentId,
        //   });
        //   if (res?.status === 200) {
        //     const signedUrl = res?.data?.url?.uploadUrl;
        //     url = res?.data?.url?.fileUrl;
        //     await axios.put(signedUrl, file);
        //   }
        // } catch (e) {
        //   toast.error("Failed to upload file.");
        // }

        url = await handleFileUpload({
          file,
          fileName: name,
          formId,
          respondentId,
        });

        setState((p) => ({ ...p, isUploading: false }));
        return url;
      }
      return file.url;
    },
    [formId, pathName, respondentId],
  );

  const generateUniqueId = useCallback((file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
    }
    return file.id;
  }, []);

  const clearFiles = useCallback(() => {
    setState((prev) => {
      // Clean up object URLs
      prev.files.forEach((file) => {
        if (
          file.preview &&
          file.file instanceof File &&
          file.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(file.preview);
        }
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
      };

      // onFilesChange?.(newState.files);
      return newState;
    });
  }, []);

  const addFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) return;

      const newFilesArray = Array.from(newFiles);
      const errors: string[] = [];

      // Clear existing errors when new files are uploaded
      setState((prev) => ({ ...prev, errors: [] }));

      // Check if adding these files would exceed maxFiles (only in multiple mode)
      if (
        maxFiles !== Infinity &&
        state.files.length + newFilesArray.length > maxFiles
      ) {
        errors.push(`You can only upload a maximum of ${maxFiles} files.`);
        setState((prev) => ({ ...prev, errors }));
        return;
      }

      const validFiles: FileWithPreview[] = [];

      for (const file of newFilesArray) {
        // if (multiple) {
        const isDuplicate = state.files.some(
          (existingFile) =>
            existingFile.file.name === file.name &&
            existingFile.file.size === file.size,
        );

        // Skip duplicate files silently
        if (isDuplicate) {
          return;
        }
        // }

        // Check file size
        if (file.size > maxSize) {
          errors.push(
            `File exceeds the maximum size of ${formatBytes(maxSize)}.`,
          );
          return;
        }

        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push({
            file,
            id: generateUniqueId(file),
            preview: await createPreview(file),
          });
        }
      }

      // Only update state if we have valid files to add
      if (validFiles.length > 0) {
        // Call the onFilesAdded callback with the newly added valid files
        //  onFilesAdded?.(validFiles);
        // const newFiles = [...state.files, ...validFiles];

        //  onFilesChange?.(newFiles);

        setState((prev) => {
          const _newFiles = [...prev.files, ...validFiles];

          return {
            ...prev,
            files: _newFiles,
            errors,
          };
        });
      } else if (errors.length > 0) {
        setState((prev) => ({
          ...prev,
          errors,
        }));
      }

      // Reset input value after handling files
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return validFiles;
    },
    [
      state.files,
      maxFiles,
      //  multiple,
      maxSize,
      validateFile,
      createPreview,
      generateUniqueId,
      clearFiles,
      //  onFilesChange,
      //  onFilesAdded,
    ],
  );

  const removeFile = useCallback(
    async (id: string, files: FileWithPreview[]) => {
      setState((prev) => {
        const fileToRemove = prev.files.find((file) => file.id === id);
        if (
          fileToRemove?.preview &&
          fileToRemove.file instanceof File &&
          fileToRemove.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(fileToRemove.preview);
        }

        const newFiles = prev.files.filter((file) => file.id !== id);
        //  onFilesChange?.(newFiles);

        return {
          ...prev,
          files: newFiles,
          errors: [],
        };
      });

      if (pathName.includes("/create") || pathName.includes("/edit")) {
        return;
      }

      try {
        const fileToRemove = files.find((file) => file.id === id);
        if (
          fileToRemove?.preview &&
          fileToRemove.file instanceof File &&
          fileToRemove.file.type.startsWith("image/")
        ) {
          const key = fileToRemove.preview?.split("xyz/")[1];
          await apiClient.put(`/api/file/delete`, { key });
        }
      } catch (e) {
        console.log("Error deleting file from server:");
      }
    },
    [],
  );

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        return await addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        return await addFiles(e.target.files);
      }
    },
    [addFiles],
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  return (
    <NodeViewWrapper as={"div"} className="mb-4">
      <Controller
        control={form?.control}
        name={id}
        rules={{
          validate: validationFn({ isRequired, type: "fileInput" }),
        }}
        render={({
          field: { name, onBlur, onChange, value, disabled, ref },
          fieldState,
        }) => (
          <Field className="" data-invalid={fieldState?.invalid}>
            <FieldLabel
              htmlFor={name}
              aria-label={name}
              className="text-base grid gap-3"
              id={id}
            >
              {/* {label.} */}
              <div className="flex items-center gap-2">
                <NodeViewContent as="div" className=" min-w-5" />
                {(isRequired && editor.isEditable) || <RequiredIcon />}
              </div>

              {/* Drop area */}
              <div>
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={async (e) => {
                    const files = await handleDrop(e);
                    const previews = files?.map((f) => f?.preview);
                    onChange(previews);
                  }}
                  data-dragging={state.isDragging || undefined}
                  data-files={state.files.length > 0 || undefined}
                  className="file-upload-drag-area"
                  onClick={openFileDialog}
                >
                  <input
                    className="sr-only"
                    aria-label={label}
                    id={name}
                    name={name}
                    ref={inputRef}
                    onChange={async (e) => {
                      const files = await handleFileChange(e);
                      const previews = files?.map((f) => f?.preview);
                      onChange(previews);
                    }}
                    type="file"
                    multiple={type === "multiple"}
                    onBlur={onBlur}
                    aria-invalid={fieldState.invalid}
                  />

                  {/* uploading loader */}
                  {state.isUploading && (
                    <div className="absolute inset-x-0 z-30 size-full  flex items-center justify-center">
                      <Loader className="animate-spin" />
                    </div>
                  )}

                  <div className="flex flex-col items-center justify-center px-4 py-3 text-center gap-3 mb-6">
                    <div
                      className=" flex shrink-0 items-center justify-center "
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-16 fill-primary"
                        viewBox="0 0 24 24"
                        fill="#fff"
                      >
                        <g clip-path="url(#clip0_4418_4278)">
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
                    <span className=" text-sm font-medium">
                      Drop your files here or click
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (max. {maxSize / (1024 * 1024)}MB)
                    </span>
                  </div>
                  {/* <Button
                    onClick={openFileDialog}
                    size={"sm"}
                    variant={"outline"}
                    type="button"
                  >
                    select files
                  </Button> */}
                </div>

                {state.errors.length > 0 && (
                  <div
                    className="flex items-center gap-1 text-xs text-destructive"
                    role="alert"
                  >
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{state.errors[0]}</span>
                  </div>
                )}

                {/* File list */}

                {state?.files?.length > 0 && (
                  <div className=" mt-2">
                    {state?.files?.map((file: FileWithPreview) => (
                      <div
                        key={file?.id}
                        className="flex items-center justify-between border bg-background p-2 pe-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="aspect-square shrink-0 ">
                            <img
                              src={file?.preview}
                              alt={file?.file.name}
                              className="size-14 object-cover  rounded-none scale-95 hover:scale-100 hover:rounded-md transition-all ease-in-out duration-200"
                            />
                          </div>
                          <div className=" flex flex-col gap-1 ">
                            <span className="truncate font-medium">
                              {file?.file.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatBytes(file?.file.size)}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                          onClick={() => removeFile(file.id, state.files)}
                          aria-label="Remove file"
                        >
                          <XIcon aria-hidden="true" />
                        </Button>
                      </div>
                    ))}

                    {state?.files.length > 1 && (
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={clearFiles}
                        >
                          Remove all files
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FieldLabel>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </NodeViewWrapper>
  );
};
