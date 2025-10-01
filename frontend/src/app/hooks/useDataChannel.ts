import { useContext } from "react"
import { DataChannelContext } from "../providers/DataChannelProvider"

export const useDataChannel = () => {
  const context = useContext(DataChannelContext);
  if (!context) {
    throw new Error("useDataChannel must be used within a DataChannelProvider");
  }
  // NOTE: 自動MediaStream取得はしない。順序明示のため
  return context.usecase;
}