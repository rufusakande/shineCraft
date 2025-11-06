export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const formatResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const formatError = (message: string): ApiResponse<never> => ({
  success: false,
  error: message,
});