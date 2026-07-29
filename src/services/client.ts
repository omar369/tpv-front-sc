export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('pos_token');
  if (!token) return {};
  return {
    'Authorization': `Bearer ${token}`
  };
}

export function normalizeApiUrl(rawUrl?: string): string {
  const base = rawUrl || import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return base;
  }
  return `https://${base}`;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}, baseUrl?: string): Promise<T> {
  const targetBase = normalizeApiUrl(baseUrl);
  const url = `${targetBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.detail || `Error HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}
