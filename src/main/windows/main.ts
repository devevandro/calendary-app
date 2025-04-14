import { BrowserWindow } from "electron";
import { join } from "node:path";

import { createWindow } from "lib/electron-app/factories/windows/create";
import { ENVIRONMENT } from "shared/constants";
import { displayName } from "~/package.json";

export async function MainWindow() {
  const window = createWindow({
    id: "main",
    title: displayName,
    width: 1000,
    height: 600,
    show: false,
    center: true,
    movable: true,
    resizable: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",

    webPreferences: {
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
