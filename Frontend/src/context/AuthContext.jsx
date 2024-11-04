// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("token : "+ token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
    console.log(decodedToken);

        setUser({ ...decodedToken, token });
        console.log(user);
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null); // Reset user on token error
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
