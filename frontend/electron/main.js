import { app, BrowserWindow } from 'electron' 
import path from 'path'

const createWindow = () => {
  const isDev = process.env.NODE_ENV === 'development';
  // 複数インスタンス識別用（例：USER_INDEXを環境変数で指定）
  const userIndex = process.env.USER_INDEX || '1';

  // userDataディレクトリを変更して、Cookie・Storageを分離
  app.setPath('userData', path.join(app.getPath('userData'), `profile-${userIndex}`));

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