// Centralized API client wrapper with automatic LoadingContext coordination
// Handles GET, POST, PUT, PATCH, DELETE with error safety, timeout handling, and loading status

export interface ApiClientOptions extends RequestInit {
  loadingId?: string;
  scope?: "global" | "overlay" | "inline";
  loadingMessage?: string;
  timeoutMs?: number;
  loadingContext?: {
    startLoading: (id: string, options?: { scope?: "global" | "overlay" | "inline"; message?: string }) => void;
    stopLoading: (id: string) => void;
  };
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const {
    loadingId = `api-req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    scope = "global",
    loadingMessage = "Connecting to Sempliqo services...",
    timeoutMs = 15000,
    loadingContext,
    headers = {},
    ...fetchConfig
  } = options;

  // Signal loading start
  if (loadingContext) {
    loadingContext.startLoading(loadingId, { scope, message: loadingMessage });
  }

  // Setup abort controller for timeout safety
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(endpoint, {
      ...fetchConfig,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    clearTimeout(timeoutId);

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      throw new ApiError(
        json?.message || `Request failed with status ${res.status}`,
        res.status,
        json
      );
    }

    return json as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.", 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err?.message || "Something went wrong while communicating with the server.",
      500
    );
  } finally {
    // Guaranteed stop of loading state in all cases (success, failure, or abort)
    if (loadingContext) {
      loadingContext.stopLoading(loadingId);
    }
  }
}
