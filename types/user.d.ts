declare module "user-types" {
  export interface IUser {
    username: string;
    email: string;
    password: string;
    role: string;
    [key: string]: string;
  }

  // Returns user info without the password hash
  export interface ISecuredUser {
    id: string;
    username: string;
    email: string;
    role: string;
    [key: string]: string;
  }
}
