export interface LoginResponse {
  success?: boolean;
  message?: string;
  accessToken?: string;
  data?: {
    accessToken?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    data?: {
      accessToken?: string;
    };
  };
}
