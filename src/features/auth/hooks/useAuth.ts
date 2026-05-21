import { useEffect, useState } from "react";
import { AuthenticationServices,  } from "../services/AuthenticationServices";
import type { Authentication } from "../types/Authentication";

export default function useAuth() {
  const [user, setUser] = useState<Authentication | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

    const login = async (email: string, password: string) => {
    try {
        setIsLoading(true);
        setError(null);

        const fakeUser = await AuthenticationServices.getAuth();

        if (email === fakeUser.email && password === fakeUser.password) {
        setUser(fakeUser);
        localStorage.setItem("auth_user", JSON.stringify(fakeUser));
        return true;
        } else {
        setError("Invalid email or password");
        return false;
        }
    } catch (err) {
        setError("Login failed");
        return false;
    } finally {
        setIsLoading(false);
    }
    };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
  };
}