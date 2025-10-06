import { app, BrowserWindow } from 'electron' 

const createWindow = () => {
  const isDev = process.env.NODE_ENV === 'development';

  // 画面共有を有効にする
  app.commandLine.appendSwitch('enable-usermedia-screen-capturing');
  app.commandLine.appendSwitch('enable-experimental-web-platform-features');

  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    // Vite dev server を読み込む
    win.loadURL('http://localhost:5173/')
    win.webContents.openDevTools()
  } else {
    // 本番ビルドされた index.html を読み込む
    win.loadFile('../dist/index.html')
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()
})