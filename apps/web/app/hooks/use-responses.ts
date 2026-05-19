import { client } from "@/lib/hc";
import useSWR from "swr";

interface IgetFormResponsesParams {
  formId: string;
  pageIndex: number;
  pageSize: number;
}

export const useResponses = ({
  formId,
  pageIndex,
  pageSize,
}: {
  formId: string | undefined;
  pageIndex: number;
  pageSize: number;
}) => {
  const key = formId ? `useResponse:${formId}:${pageIndex}:${pageSize}` : null;
  const fetcher = () =>
    getFormResponses({ formId: formId!, pageIndex, pageSize });
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  return {
    responses: data,
    responsesErr: error,
    responseLoading: isLoading,
    mutate,
  };
};

export const getUseResponsesKey = ({
  formId,
  pageIndex,
  pageSize,
}: IgetFormResponsesParams) => {
  return `useResponse:${formId}:${pageIndex}:${pageSize}`;
};

export const getFormResponses = async ({
  formId,
  pageIndex,
  pageSize,
}: IgetFormResponsesParams) => {
  const res = await client.api.response.form[":formId"].$get({
    param: { formId },
    query: { pageIndex: `${pageIndex}`, pageSize: `${pageSize}` },
  });

  if (!res.ok) throw new Error("getFormResponses");
  const result = await res.json();
  return result.responses;
};
