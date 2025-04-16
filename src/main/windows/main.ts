import { BrowserWindow } from "electron";
import { join } from "node:path";

import { createWindow } from "lib/electron-app/factories/windows/create";

export async function MainWindow() {
  const window = createWindow({
    id: "main",
    title: "",
    width: 1100,
    height: 620,
    show: false,
    center: true,
    movable: true,
    resizable: false,
    focusable: false,
    skipTaskbar: false,
    alwaysOnTop: false,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",

    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      preload: join(__dirname, "../preload/index.js")
    }
  });

  window.webContents.on("did-finish-load", () => {
    window.show();
  });

  window.on("close", () => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.destroy();
    }
  });

  return window;
}
