export interface JwtPayload {
  sub: string;
  email: string;
  type: string;
  roles: string[];
  permissions: string[];
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
}
