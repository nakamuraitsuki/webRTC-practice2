export {};

declare global {
  interface Window {
    electronAPI?: {
      selectScreenSource: () => Promise<Electron.DesktopCapturerSource[]>;
      getMediaStream: (sourceId: string) => Promise<MediaStream>;
    };
  }
}
