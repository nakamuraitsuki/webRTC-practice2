import { app, BrowserWindow } from 'electron' 

const createWindow = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  if (isDev) {
    // Vite dev server を読み込む
    win.loadURL('http://localhost:5173/')
    win.webContents.openDevTools()
  } else {
    // 本番ビルドされた index.html を読み込む
    win.loadFile('index.html')
  }
}

app.whenReady().then(() => {
  createWindow()
})