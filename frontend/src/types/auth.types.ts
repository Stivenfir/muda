export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginUser {
  sub: number;
  username: string;
  role: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: LoginUser;
}

export interface ProfileResponse {
  userId: number;
  username: string;
  role: string;
  roles: string[];
  permissions: string[];
}
