import z from "zod";

export interface Ivalidation {
  isRequired: boolean;
  type: string;
}


export const validationFn = (params: Ivalidation) => {
  const emailSchema = z.email();
  return (value: any) => {
    
    if (!params.isRequired) return true;
    if (!value || value?.length === 0) {
      return "field is required";
    }

    if (params.type === "emailInput") {
      const { success } = emailSchema.safeParse(value);
      if (!success) {
        return "Please write valid email";
      } else {
        return true;
      }
    }

    return true;
  };
};
