import axios from "axios";
import { client } from "./hc";

interface IhandleFileUploadParams {
  file: File;
  fileName: string;
  respondentId: string;
  formId: string;
}

export const handleFileUpload = async ({
  file,
  fileName,
  formId,
  respondentId,
}: IhandleFileUploadParams) => {
  const getSignedUrls = await client.api.file.respondent.$post({
    json: { fileName, formId, respondentId },
  });
  if (!getSignedUrls.ok) throw new Error("failed to handleFileUpload");

  const {
    url: { fileUrl, uploadUrl },
  } = await getSignedUrls.json();
  const upload = await axios.put(uploadUrl, file);
  if (upload.status === 200 || upload.status === 201) {
    return fileUrl;
  }

  throw new Error("failed to upload file");
};

interface IhandleFileUploadInWorkspace {
  file: File;
  fileName: string;
  workspaceId: string;
}

export const handleFileUploadInWorkspace = async ({
  file,
  fileName,
  workspaceId,
}: IhandleFileUploadInWorkspace) => {
  const getSignedUrls = await client.api.file.workspace.$post({
    json: { fileName, workspaceId },
  });
  if (!getSignedUrls.ok) throw new Error("failed to upload file");

  const { url } = await getSignedUrls.json();
  const upload = await axios.put(url.uploadUrl, file);
  if (upload.status === 200 || upload.status === 201) {
    return url.fileUrl;
  }

  throw new Error("failed to upload file");
};

export const handleFileDelete = async (url: string) => {
  try {
    const isBucketUrl = url.includes("bucket.planetform.xyz");
    if (!isBucketUrl) return;
    const key = url.split("xyz/")[1];
    await client.api.file.delete.$put({ json: { key } });
  } catch (error) {
    console.log(error);
    console.log("failed to delete file");
  }
};
