export interface User {
  email: string;
  password: string;
  type: UserType;
  loggedIn: boolean;
}

export enum UserType {
  User,
  Seller,
  Admin,
}

export const link_auth =
  "https://prelovedbackend.azurewebsites.net/auth/is_authenticated";
export const link_logout =
  "https://prelovedbackend.azurewebsites.net/auth/logout";
