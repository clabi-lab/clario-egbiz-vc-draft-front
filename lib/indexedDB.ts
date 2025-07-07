const DB_NAME = process.env.NEXT_PUBLIC_DATABASE_NAME || "Clabi";
const CHAT_HISTORY_STORE = "ChatHistoryStore";
const SAVED_CHAT_STORE = "SavedChatStore";

interface IndexedDBItem {
  id: number;
  title: string;
  shareCode: string;
}

export const getAllChatGroups = (): Promise<IndexedDBItem[]> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, 1);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains(CHAT_HISTORY_STORE)) {
        db.createObjectStore(CHAT_HISTORY_STORE, { keyPath: "id" });
      }
    };

    openRequest.onerror = () => reject(openRequest.error);

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction(CHAT_HISTORY_STORE, "readonly");
      const store = tx.objectStore(CHAT_HISTORY_STORE);

      const getAllRequest = store.getAll();

      getAllRequest.onerror = () => reject(getAllRequest.error);
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
    };
  });
};

export const saveChatGroup = async ({
  id,
  title,
  shareCode,
}: IndexedDBItem) => {
  const openRequest = indexedDB.open(DB_NAME, 1);

  return new Promise<void>((resolve, reject) => {
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains(CHAT_HISTORY_STORE)) {
        db.createObjectStore(CHAT_HISTORY_STORE, { keyPath: "id" });
      }
    };

    openRequest.onerror = () => {
      reject(openRequest.error);
    };

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction(CHAT_HISTORY_STORE, "readwrite");
      const store = tx.objectStore(CHAT_HISTORY_STORE);

      store.put({ id, title, shareCode });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
};

export const getShareCode = async (id: number): Promise<string | null> => {
  const dbs = await indexedDB.databases?.();
  const exists = dbs?.some((db) => db.name === DB_NAME);

  if (!exists) return null;

  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, 1);

    openRequest.onerror = () => reject(openRequest.error);

    openRequest.onsuccess = () => {
      const db = openRequest.result;

      if (!db.objectStoreNames.contains(CHAT_HISTORY_STORE)) {
        resolve(null);
        return;
      }

      const tx = db.transaction(CHAT_HISTORY_STORE, "readonly");
      const store = tx.objectStore(CHAT_HISTORY_STORE);
      const allRequest = store.getAll();

      allRequest.onsuccess = () => {
        const foundItem = allRequest.result.find((item) => item.id === id);

        resolve(foundItem?.shareCode ?? null);
      };

      allRequest.onerror = () => reject(allRequest.error);
    };
  });
};

export const updateChatGroup = async ({
  id,
  title,
  shareCode,
}: IndexedDBItem) => {
  const openRequest = indexedDB.open(DB_NAME, 1);

  return new Promise<void>((resolve, reject) => {
    openRequest.onerror = () => reject(openRequest.error);

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction(CHAT_HISTORY_STORE, "readwrite");
      const store = tx.objectStore(CHAT_HISTORY_STORE);

      store.put({ id, title, shareCode });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
};

export const deleteChatGroup = async (id: number) => {
  const openRequest = indexedDB.open(DB_NAME, 1);

  return new Promise<void>((resolve, reject) => {
    openRequest.onerror = () => reject(openRequest.error);

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction(CHAT_HISTORY_STORE, "readwrite");
      const store = tx.objectStore(CHAT_HISTORY_STORE);

      store.delete(id);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
};

export const savedChatGroup = async ({
  id,
  title,
  shareCode,
}: IndexedDBItem) => {
  const openRequest = indexedDB.open(DB_NAME, 1);

  return new Promise<void>((resolve, reject) => {
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains(SAVED_CHAT_STORE)) {
        db.createObjectStore(SAVED_CHAT_STORE, { keyPath: "id" });
      }
    };

    openRequest.onerror = () => {
      reject(openRequest.error);
    };

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction(SAVED_CHAT_STORE, "readwrite");
      const store = tx.objectStore(SAVED_CHAT_STORE);

      store.put({ id, title, shareCode });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
  });
};
