import { createContext } from "react";
import { createDataChannelUseCase, DataChannelUseCase } from "../../domains/dataChannel/dataChannelUseCase";
import { useRTC } from "../hooks/useRTC";

type DataChannelContextValue = {
  usecase: DataChannelUseCase
}

export const DataChannelContext = createContext<DataChannelContextValue | undefined>(undefined);

export const DataChannelProvider = ({ children }: { children: React.ReactNode}) => {
  const rtc = useRTC();

  const usecase = createDataChannelUseCase(rtc);

  return (
    <DataChannelContext.Provider value={{ usecase } as DataChannelContextValue}>
      {children}
    </DataChannelContext.Provider>
  )
}