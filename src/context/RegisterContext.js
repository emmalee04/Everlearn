import { createContext, useContext, useState } from "react";

export const RegisterContext = createContext();

// Registration context provider for whether or not registration is with
// email or not.
export const RegisterContextProvider = ({children}) => {
  const [registerWithEmail, setRegisterWithEmail] = useState(false);

  return (
    <RegisterContext.Provider
      value={{
        registerWithEmail,
        setRegisterWithEmail
      }}
    >
      {children}
    </RegisterContext.Provider>
  )
}

export function useRegisterContext() {
  return useContext(RegisterContext)
}