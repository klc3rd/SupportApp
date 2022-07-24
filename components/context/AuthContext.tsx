/**
 * Provides an accessible context so each page and element can track
 * the users role and email address without having retrieve the user
 */
import React from "react";

export const AuthContext = React.createContext({
  role: "",
  email: "",
});

interface iAuthContext {
  children: JSX.Element | JSX.Element[];
}

const AuthContextProvider: React.FC<iAuthContext> = (props) => {
  const { children } = props;

  return (
    <AuthContext.Provider value={{ role: "", email: "" }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.displayName = "AuthContextProvider";
export default AuthContextProvider;
