interface ItoastPromiseOptions {
  error?: string;
  loading?: string;
  success?: string;
}

export const toastPromiseOptions = ({
  error = "failed",
  loading = "creating...",
  success = "success",
}: ItoastPromiseOptions) => ({ error, loading, success });
