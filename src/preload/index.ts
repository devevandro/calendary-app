import { contextBridge, ipcRenderer } from "electron";
import { IPC } from "shared/contants/ipc";
import {
  CreateCommitmentResponse,
  DeleteCommitmentRequest,
  FetchAllCommitmentsResponse,
  FetchCommitmentRequest,
  FetchCommitmentResponse,
  SaveCommitmentRequest,
} from "shared/types/ipc";
declare global {
  interface Window {
    App: typeof API;
  }
}

const API = {
  fetchCommitments: (): Promise<FetchAllCommitmentsResponse> => {
    return ipcRenderer.invoke(IPC.COMMITMENTS.FETCH_ALL);
  },

  fetchCommitment: (
    req: FetchCommitmentRequest
  ): Promise<FetchCommitmentResponse> => {
    return ipcRenderer.invoke(IPC.COMMITMENTS.FETCH, req);
  },

  createCommitment: (): Promise<CreateCommitmentResponse> => {
    return ipcRenderer.invoke(IPC.COMMITMENTS.CREATE);
  },

  saveCommitment: (req: SaveCommitmentRequest): Promise<void> => {
    return ipcRenderer.invoke(IPC.COMMITMENTS.SAVE, req);
  },

  deleteCommitment: (req: DeleteCommitmentRequest): Promise<void> => {
    return ipcRenderer.invoke(IPC.COMMITMENTS.DELETE, req);
  },

  onNewCommitmentRequest(callback: () => void) {
    ipcRenderer.on("new-commitment", callback);

    return () => {
      ipcRenderer.off("new-commitment", callback);
    };
  },
};

contextBridge.exposeInMainWorld("App", API);
