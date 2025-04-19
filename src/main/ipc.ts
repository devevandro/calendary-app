import { ipcMain } from "electron";

import { IPC } from "../shared/contants/ipc";
import {
  CreateCommitmentResponse,
  DeleteCommitmentRequest,
  FetchAllCommitmentsResponse,
  FetchCommitmentRequest,
  FetchCommitmentResponse,
  SaveCommitmentRequest,
  Commitment,
} from "../shared/types/ipc";

import { store } from "./store";
import { randomUUID } from "crypto";

ipcMain.handle(
  IPC.COMMITMENTS.FETCH_ALL,
  async (): Promise<FetchAllCommitmentsResponse> => {
    return {
      data: Object.values(store.get("commitments")),
    };
  }
);

ipcMain.handle(
  IPC.COMMITMENTS.FETCH,
  async (
    _,
    { id }: FetchCommitmentRequest
  ): Promise<FetchCommitmentResponse> => {
    const commitment = store.get(`commitments.${id}`) as Commitment;

    return {
      data: commitment,
    };
  }
);

ipcMain.handle(
  IPC.COMMITMENTS.SAVE,
  async (
    _,
    { id, email, description, commitment, time }: SaveCommitmentRequest
  ): Promise<void> => {
    store.set(`commitments.${id}`, {
      id,
      email,
      description,
      commitment,
      time,
    });
  }
);

ipcMain.handle(
  IPC.COMMITMENTS.DELETE,
  async (_, { id }: DeleteCommitmentRequest): Promise<void> => {
    // @ts-ignore (https://github.com/sindresorhus/electron-store/issues/196)
    store.delete(`commitments.${id}`);
  }
);
