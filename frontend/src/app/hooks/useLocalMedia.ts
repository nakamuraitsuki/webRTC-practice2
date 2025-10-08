import { useContext } from "react"
import { LocalMediaContext } from "../providers/LocalMediaProvider"

export const useLocalMedia = () => {
  const context = useContext(LocalMediaContext);
  if (!context) {
    throw new Error("useDataChannel must be used within a DataChannelProvider");
  }
  // NOTE: 自動MediaStream取得はしない。順序明示のため
  return context.usecase;
}