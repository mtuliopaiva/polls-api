export interface AuthUser {
  uuid: string;
  email: string;
  type: string;
  roles: string[];
  permissions: string[];
}
