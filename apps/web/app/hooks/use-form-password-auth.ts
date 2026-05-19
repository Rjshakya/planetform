import { useCallback, useState } from "react";
import { client } from "@/lib/hc";

const getStorageKey = (formId: string) => `pp_auth_${formId}`;

export const useFormPasswordAuth = (formId: string) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStoredToken = useCallback(() => {
    return localStorage.getItem(getStorageKey(formId));
  }, [formId]);

  const storeToken = useCallback(
    (token: string) => {
      localStorage.setItem(getStorageKey(formId), token);
    },
    [formId],
  );

  const clearToken = useCallback(() => {
    localStorage.removeItem(getStorageKey(formId));
  }, [formId]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);

    try {
      const res = await client.api.form.settings.password.verify.$post({
        json: { formId, password },
      });

      const data = await res.json();

      if (!res.ok || !data.data.success) {
        setError("Invalid password");
        return false;
      }

      if (data.data.token) {
        storeToken(data.data.token);
      }

      return true;
    } catch {
      setError("Failed to verify password");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const checkIsAuthenticated = async (): Promise<boolean> => {
    const token = getStoredToken();
    if (!token) return false;

    try {
      const res = await client.api.form.settings.password["check-auth"].$post({
        json: { formId, token },
      });

      const data = await res.json();

      if (!res.ok || !data.data.isAuthenticated) {
        clearToken();
        return false;
      }

      return true;
    } catch {
      clearToken();
      return false;
    }
  };

  return {
    verifyPassword,
    checkIsAuthenticated,
    getStoredToken,
    clearToken,
    isVerifying,
    error,
  };
};
