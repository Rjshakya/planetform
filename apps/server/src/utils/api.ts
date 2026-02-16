export const ApiResponse = <T>(params: {
  message: string;
  data: T;
  error?: unknown;
}) => params;
