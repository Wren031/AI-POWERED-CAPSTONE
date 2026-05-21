import type { Authentication } from "../types/Authentication";

export const AuthenticationServices = {
  getAuth(): Promise<Authentication> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          username: "user",
          email: "derma-admin@gmail.com",
          password: "derma123",
        });
      }, 500);
    });
  },
};