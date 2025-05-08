import { useCallback, useEffect, useState } from "react";

interface FetchParam {
  url: string;
  method: string;
  body?: any;
  headers?: HeadersInit;
}

export function useFetch<T>({ url, method, body, headers }: FetchParam) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | []>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL; // Get base URL from environment variables

  const fetchData = useCallback(async () => {
    try {
      console.log("Fetching data from wendy:", `${baseUrl}${url}`);
      const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setStatusCode(response.status);
    } catch (error) {
      setIsError(true);
      setStatusCode((error as Response).status);
      setErrorMessage((error as Response).statusText);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, url, method, JSON.stringify(body), JSON.stringify(headers)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { isError, isLoading, data, errorMessage, statusCode };
}
