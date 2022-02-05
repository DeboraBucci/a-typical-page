import React from "react";

// Can also be a string: React.createContext("");
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
});

export default AuthContext;
