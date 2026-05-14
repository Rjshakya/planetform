import { client } from "@/lib/hc";
import useSWR, { mutate } from "swr";

export const useFormSettings = (formId: string | undefined) => {
  const fetcher = (key: string) => getFormSettings(key.split(":")[1]);
  const { data, error, isLoading } = useSWR(
    formId ? `useFormSettings:${formId}` : null,
    fetcher,
  );

  return {
    formSettings: data,
    useFormSettingsError: error,
    useFormSettingsLoading: isLoading,
  };
};

export const toggleFormClose = async (payload: {
  formId: string;
  closed?: boolean | undefined;
  closedMessage?: string | undefined;
  closingTime?: Date | null | undefined;
  closeAfterSubmissions?: number | null | undefined;
}) => {
  const res = await client.api.form.settings.update.$post({
    json: payload,
  });

  if (!res.ok) throw new Error("failed to close/open form");
  const data = await res.json();
  mutate(`useFormSettings:${payload.formId}`);
  return data.settings;
};

export const getFormSettings = async (formId: string) => {
  const res = await client.api.form.settings[":formId"].$get({
    param: { formId },
  });
  if (!res.ok) throw new Error("failed to get form settings");

  const data = await res.json();

  return data.settings;
};

export const setFormPass = async (formId: string, password: string) => {
  const res = await client.api.form.settings.password.$post({
    json: { formId, password },
  });
  if (!res.ok) throw new Error("failed to set form password");
  const data = await res.json();
  mutate(`useFormSettings:${formId}`);
  return data;
};

export const resetFormSettings = async (formId: string | undefined) => {
  if (!formId) throw new Error("No form id");
  const res = await client.api.form.settings.reset.$post({ json: { formId } });
  if (!res.ok) throw new Error("failed to reset form");
  const data = await res.json();
  mutate(`useFormSettings:${formId}`);
  return data;
};
