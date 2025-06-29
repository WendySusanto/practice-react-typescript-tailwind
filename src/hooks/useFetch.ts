import { useCallback, useState } from "react";

interface FetchParam {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: HeadersInit;
}

interface FetchResponse<T> {
  data: T | null;
  statusCode: number | null;
  error: string | null;
  success: boolean;
}

export const useFetch = <T = any>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchData = useCallback(
    async ({
      url,
      method,
      body,
      headers,
    }: FetchParam): Promise<FetchResponse<T>> => {
      const controller = new AbortController();
      const signal = controller.signal;

      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      setStatusCode(null);

      try {
        const response = await fetch(baseUrl + url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal,
        });

        setStatusCode(response.status);

        const contentType = response.headers.get("Content-Type");
        const result =
          contentType && contentType.includes("application/json")
            ? await response.json()
            : contentType && contentType.includes("text/plain")
            ? await response.text()
            : null;

        if (!response.ok) {
          const errorMsg =
            result?.message || `HTTP error! status: ${response.status}`;
          setIsError(true);
          setErrorMessage(errorMsg);
          return {
            data: null,
            statusCode: response.status,
            error: errorMsg,
            success: false,
          };
        }

        return {
          data: result,
          statusCode: response.status,
          error: null,
          success: true,
        };
      } catch (error) {
        if (signal.aborted) {
          console.log("Fetch aborted");
          return {
            data: null,
            statusCode: null,
            error: "Request aborted",
            success: false,
          };
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setIsError(true);
        setErrorMessage(message);
        return {
          data: null,
          statusCode: null,
          error: message,
          success: false,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl]
  );

  const get = (url: string, headers?: HeadersInit) =>
    fetchData({ url, method: "GET", headers });

  const post = (url: string, body?: any, headers?: HeadersInit) =>
    fetchData({ url, method: "POST", body, headers });

  const put = (url: string, body?: any, headers?: HeadersInit) =>
    fetchData({ url, method: "PUT", body, headers });

  const del = (url: string, headers?: HeadersInit) =>
    fetchData({ url, method: "DELETE", headers });

  const patch = (url: string, body?: any, headers?: HeadersInit) =>
    fetchData({ url, method: "PATCH", body, headers });

  return {
    isLoading,
    isError,
    errorMessage,
    statusCode,
    get,
    post,
    put,
    del,
    patch,
  };
};
