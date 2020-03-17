const electron = require('electron');
const path = require('path');

const { app, BrowserWindow, globalShortcut, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    frame: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL(`file://${__dirname}/capture.html`);

  mainWindow.on('close', () => {
    mainWindow = null;
  });

  globalShortcut.register('CommandOrControl+Y', () => {
    console.log('call');
    mainWindow.webContents.send('capture', app.getPath('pictures'));
  });
});
