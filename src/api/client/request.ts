import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "../../config/api";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  errors?: Array<{ field?: string; message?: string; value?: unknown }>;
};

export class ApiError extends Error {
  status: number;
  errorCode?: string;
  errors?: Array<{ field?: string; message?: string; value?: unknown }>;

  constructor(
    message: string,
    status: number,
    errorCode?: string,
    errors?: Array<{ field?: string; message?: string; value?: unknown }>
  ) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

const buildUrl = (path: string) => {
  const trimmedBase = API_BASE_URL.replace(/\/$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
};

const parseJsonSafely = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const requestJson = async <T>(
  method: "POST" | "PUT",
  path: string,
  body: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl(path), {
      method,
      headers: { "Content-Type": "application/json", ...(headers || {}) },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = (await parseJsonSafely(response)) as ApiResponse<T> | null;

    if (!response.ok || (payload && payload.success === false)) {
      const message = payload?.message || "Request failed";
      const errorCode = payload?.errorCode;
      const errors = payload?.errors;
      throw new ApiError(message, response.status, errorCode, errors);
    }

    return (
      payload ||
      ({
        success: true,
        message: "Success",
        data: null as T,
      } as ApiResponse<T>)
    );
  } finally {
    clearTimeout(timeoutId);
  }
};

export const postJson = async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
  return requestJson<T>("POST", path, body);
};

export const putJson = async <T>(
  path: string,
  body: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
  return requestJson<T>("PUT", path, body, headers);
};
