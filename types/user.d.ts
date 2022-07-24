declare module "user-types" {
  interface IUser {
    username: string;
    email: string;
    password: string;
    role: string;
    [key: string]: string;
  }

  // Returns user info without the password hash
  interface ISecuredUser {
    id: string;
    username: string;
    email: string;
    role: string;
    [key: string]: string;
  }
}
