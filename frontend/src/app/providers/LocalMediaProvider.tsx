import { createContext } from "react";
import { createLocalMediaUseCase, LocalMediaUseCase } from "../../domains/LocalMedia/localMediaUseCase";
import { useRTC } from "../hooks/useRTC";

type LocalMediaContextValue = {
  usecase: LocalMediaUseCase
}

export const LocalMediaContext = createContext<LocalMediaContextValue | undefined>(undefined);

export const LocalMediaProvider = ({ children }: { children: React.ReactNode }) => {
  const rtc = useRTC();

  const usecase = createLocalMediaUseCase(rtc);

  return (
    <LocalMediaContext.Provider value={{ usecase } as LocalMediaContextValue}>
      {children}
    </LocalMediaContext.Provider>
  )
}