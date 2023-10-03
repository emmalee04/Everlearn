import { createContext, useContext, useState } from "react";

export const LoginContext = createContext();

// Login context provider for whether or not login is with
// email or not.
export const LoginContextProvider = ({children}) => {
  const [loginWithEmail, setLoginWithEmail] = useState(false);

  return (
    <LoginContext.Provider
      value={{
        loginWithEmail,
        setLoginWithEmail
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export function useLoginContext() {
  return useContext(LoginContext)
}