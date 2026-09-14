import {
  createContext,
  useContext,
  useState
} from "react";

import { apiFetch } from "../services/api";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user") || "null"
    )
  );


  // ======================================
  // LOGIN
  // ======================================

  const login = async (email, password) => {

    const data = await apiFetch(
  "/api/auth/login",
      {
        method: "POST",

        body: JSON.stringify({
          email,
          password
        })
      }
    );


    localStorage.setItem(
      "token",
      data.token
    );


    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );


    setToken(data.token);
    setUser(data.user);

    return data;
  };


  // ======================================
  // LOGOUT
  // ======================================

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};