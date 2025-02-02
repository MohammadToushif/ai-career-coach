import { useState } from "react";
import { toast } from "sonner";

export function useFetch<T, A extends unknown[]>(
  cb: (...args: A) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fn = async (...args: A) => {
    setLoading(true);
    setError("");
    try {
      const response = await cb(...args);
      setData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
}
