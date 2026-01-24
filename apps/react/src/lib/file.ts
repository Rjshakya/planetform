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
