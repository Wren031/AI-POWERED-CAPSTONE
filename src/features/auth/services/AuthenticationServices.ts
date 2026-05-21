import type { Authentication } from "../types/Authentication";

export const AuthenticationServices = {
  getAuth(): Promise<Authentication> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          username: "user",
          email: "renie@aclcbukidnon.com",
          password: "1",
        });
      }, 500);
    });
  },
};