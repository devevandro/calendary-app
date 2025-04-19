import { BrowserWindow } from "electron";
import { join } from "node:path";
import "../ipc";
import "../store";

import { createWindow } from "lib/electron-app/factories/windows/create";

export async function MainWindow() {
  const window = createWindow({
    id: "main",
    title: "",
    width: 1100,
    height: 620,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#101828",
    titleBarStyle: "hiddenInset",

    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      preload: join(__dirname, "../preload/index.js"),
    },
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
