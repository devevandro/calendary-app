import Store from "electron-store";

import { Commitment } from "../shared/types/ipc";

interface StoreType {
  commitments: Record<string, Commitment>;
}

export const store = new Store<StoreType>({
  defaults: {
    commitments: {},
  },
});
