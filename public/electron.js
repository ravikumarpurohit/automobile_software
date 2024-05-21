// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
function createWindow() {
  let mainWindow = null;
  mainWindow = new BrowserWindow({
    // show: false,
    fullscreenable: true,
    icon: "../src/assets/logo.ico",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
      contextIsolation: false,
    },
  });
  mainWindow.maximize();
  mainWindow.loadURL(isDev ? "http://localhost:7000" : `file://${path.join(__dirname, "./index.html")}`);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
Menu.setApplicationMenu(null);
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("database_action", (event, req) => {});
