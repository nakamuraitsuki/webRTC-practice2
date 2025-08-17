import { useContext } from "react"
import { TextMessageContext } from "../providers/TextMessageProvider"

export const useTextMessage = () => {
  const context = useContext(TextMessageContext);
  if (!context) {
    throw new Error("useTextMessage must be used within a TextMessageProvider");
  }
  return context;
}