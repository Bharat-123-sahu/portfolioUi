export interface LoginResponse {
  success?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    data?: {
      accessToken?: string;
      refreshToken?: string;
    };
  };
}
