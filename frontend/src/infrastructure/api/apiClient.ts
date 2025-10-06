class ApiClient {
  // リクエストのベースURLを保持
  readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 汎用HTTPリクエストメソッド
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: "include", // Cookieを送信
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "APIリクエストに失敗しました");
    }

    return res.json() as Promise<T>;
  }

  // GETリクエスト専用
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POSTリクエスト専用
  post<TRequest, TResponse>(endpoint: string, body: TRequest, headers?: HeadersInit): Promise<TResponse> {
    return this.request<TResponse>(endpoint, {
      method: "POST",
      headers: headers ?? { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");


