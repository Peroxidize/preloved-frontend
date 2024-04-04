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
  "https://preloved.westus3.cloudapp.azure.com/auth/is_authenticated";
export const link_logout =
  "https://preloved.westus3.cloudapp.azure.com/auth/logout";
