import { createContext, useContext } from "react";
import { loginType, signUpType } from "@rajsinghast03/medium-common";

const INITIAL_STATE = {
  user: "",
  isLoading: false,
  token: "",
  loginAction: async () => {},
  signUpAction: async () => {},
  logOut: () => {},
};

interface AuthContextType {
  user: string;
  token: string;
  isLoading: boolean;
  loginAction: (data: loginType) => Promise<void>;
  signUpAction: (data: signUpType) => Promise<void>;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextType>(INITIAL_STATE);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == undefined) {
    console.log("AuthContext was used outside of AuthProvider");
  }
  return context;
};
