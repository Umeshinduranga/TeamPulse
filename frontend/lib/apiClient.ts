// frontend/lib/apiClient.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface FetchOptions extends RequestInit {
  data?: any;
}

export const apiClient = async <T>(endpoint: string, options: FetchOptions = {}) => {
  const { data, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    credentials: 'include', // Crucial for your HTTP-only cookie!
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong');
    }

    return result as { success: boolean; data?: T; token?: string };
  } catch (error: any) {
    throw new Error(error.message || 'Network error occurred');
  }
};