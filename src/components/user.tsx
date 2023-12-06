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

export const link_auth = "https://prelovedbackends.azurewebsites.net/auth/is_authenticated";
export const link_logout = "https://prelovedbackends.azurewebsites.net/auth/logout";