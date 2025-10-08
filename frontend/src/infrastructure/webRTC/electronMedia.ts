export const getElectronScreenStream = async (): Promise<MediaStream | null> => {
  // ブラウザなら null を返す
  if (!window.electronAPI) {
    console.warn("Electron API not available");
    return null;
  }

  const sources = await window.electronAPI.selectScreenSource();
  if (sources.length === 0) return null;

  const source = sources[0]; // ユーザー選択UIを作っても良い
  const stream = await window.electronAPI.getMediaStream(source.id);
  return stream;
};
