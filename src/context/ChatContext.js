import { createContext, useReducer, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

// Chat context provider for users' infos.
export const ChatContextProvider = ({children}) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {}
  }

  const chatReducer = (state, action) => {
    switch(action.type) {
      case "CHANGE_USER":
        console.log("User changed to: " + action.payload.displayName);
        return {
          user: action.payload,
          chatId: currentUser.uid > action.payload.uid 
          ? currentUser.uid + action.payload.uid 
          : action.payload.uid + currentUser.uid  
        }
      default: 
        return state;
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children} 
    </ChatContext.Provider>
  )
}