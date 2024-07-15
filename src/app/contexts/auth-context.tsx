import { createContext, useContext, useState } from "react";
import type { FC, ReactNode } from "react";
import { appFetch } from "../utils/app-fetch";

type Status = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  user: any;
  status?: Status;
  login: (username: string, password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  status: undefined,
  login: async (username, password) => { }
});

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [user, setUser] = useState(undefined);
  const [status, setStatus] = useState<Status | undefined>(undefined);

  const login = async (username: string, password: string): Promise<void> => {
    setStatus('loading')

    try {
      await appFetch({
        url: '/login',
        config: {
          body: JSON.stringify({ username, password })
        }
      });
      setStatus('authenticated')
    } catch (error) {
      setStatus('unauthenticated')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        login
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
