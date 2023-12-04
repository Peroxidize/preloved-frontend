export interface User {
    email: string;
    type: UserType;
    loggedIn: boolean;
}
  
export enum UserType {
    User,
    Seller,
    Admin,
}