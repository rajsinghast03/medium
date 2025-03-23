import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginType, signUpType } from "@rajsinghast03/medium-common";
import { AuthContext } from "../hooks/useAuth";
import api from "@/lib/utils";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginAction = async (loginData: loginType) => {
    let loadingToast;
    try {
      setIsLoading(true);
      loadingToast = toast.loading("Logging in...");

      const res = await api.post("/user/login", loginData);

      if (res.data) {
        console.log(res.data.name);
        setUser(res.data.name);
        setToken(res.data.jwtToken);
        localStorage.setItem("token", res.data.jwtToken);
        localStorage.setItem("user", res.data.name);
        toast.success("Login done", { id: loadingToast });
        navigate("/home");
        return;
      }
      throw new Error("Error while login");
    } catch (err) {
      toast.error("Login failed", { id: loadingToast });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpAction = async (signUpData: signUpType) => {
    let loadingToast;
    try {
      setIsLoading(true);
      loadingToast = toast.loading("Signing up...");

      const res = await api.post("/user/signup", signUpData);

      if (res.data) {
        toast.success("Signup done", { id: loadingToast });
        navigate("/login");
        setIsLoading(false);
        return;
      }
      throw new Error("Error while signing up");
    } catch (err) {
      toast.error("Signup Failed", { id: loadingToast });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const logOut = () => {
    setUser("");
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const value = { token, user, loginAction, signUpAction, isLoading, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
