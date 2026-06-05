import React, { useEffect, useState } from "react";
import BASE_URL from "../config";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/me.php`, {
          credentials: "include",
        });
        const data = "";
        // const data = await response.json();
        const text = await response.text();
        console.log("AUTH RAW RESPONSE:", text);

        setUser(data.user);
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout.php`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      navigate("/home");
    } catch (err) {
      console.error("Logout error: ", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
