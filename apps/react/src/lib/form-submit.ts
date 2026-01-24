import { client } from "./hc";

interface IsubmissionObj {
  form: string;
  form_field: string;
  value: string;
  respondent: string;
}

interface IsubmitResponse {
  formId: string;
  respondent: string;
  data: Record<string, string | string[]>;
  creator:string
}

export const createRespondent = async (formId: string, customerId: string) => {
  const res = await client.api.respondent.$post({
    json: { form: formId, customerId },
  });

  if (!res.ok) throw new Error("failed to createRespondent");

  const respondent = await res.json();
  
  return respondent.respondent?.id
};

export const deleteRespondent = async (respondentId: string) => {
  const res = await client.api.respondent[":respondentId"].$delete({
    param: { respondentId },
  });
  if (!res.ok) throw new Error("failed to deleteRespondend");
  const json = await res.json();
  return json.respondent;
};

export const submitResponse = async ({
  data,
  formId,
  respondent,
  creator
}: IsubmitResponse) => {

  const submissions = Object.entries(data).map(([id, value]) => {
    return {
      form: formId,
      respondent,
      form_field: id,
      value: Array.isArray(value) ? value.join(",") : value,
    };
  }) as IsubmissionObj[];

  const res = await client.api.response.multiple.$post({
    json: { finalValues: submissions, creator },
  });

  if (!res.ok) throw new Error("failed to submitResponse");

  const json = await res.json();
  return json.responses?.id;
};
