import {
  IndexedDBItem,
  SatisfactionDBItem,
  ShareDBItem,
} from "@/types/indexedDB";

const DB_NAME = process.env.NEXT_PUBLIC_DATABASE_NAME || "Clabi";
const DB_VERSION = 1;

const CHAT_HISTORY_STORE = "ChatHistoryStore"; // 채팅 전체 이력
const CHAT_SAVED_STORE = "ChatSavedStore"; // 사용자가 저장한 채팅
const CHAT_SATISFACTION_STORE = "ChatSatisfactionStore"; // 만족도 기록
const CHAT_SHARED_STORE = "ChatSharedStore"; // 공유된 채팅

// ✅ IDBRequest -> Promise 래퍼
const wrapRequest = <T>(request: IDBRequest<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const openDatabase = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      // 스토어가 없으면 생성
      // 각 스토어는 keyPath로 id를 사용
      if (!db.objectStoreNames.contains(CHAT_HISTORY_STORE)) {
        // 채팅 기록 스토어 생성
        db.createObjectStore(CHAT_HISTORY_STORE, { keyPath: "chatGroupId" });
      }
      if (!db.objectStoreNames.contains(CHAT_SAVED_STORE)) {
        // 저장된 채팅 스토어 생성
        db.createObjectStore(CHAT_SAVED_STORE, { keyPath: "chatGroupId" });
      }
      if (!db.objectStoreNames.contains(CHAT_SATISFACTION_STORE)) {
        // 만족도 스토어 생성
        db.createObjectStore(CHAT_SATISFACTION_STORE, {
          keyPath: "chatGroupId",
        });
      }
      if (!db.objectStoreNames.contains(CHAT_SHARED_STORE)) {
        // 공유된 채팅 스토어 생성
        db.createObjectStore(CHAT_SHARED_STORE, { keyPath: "chatGroupId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getStore = async (
  storeName: string,
  mode: IDBTransactionMode
): Promise<IDBObjectStore> => {
  const db = await openDatabase();
  const tx = db.transaction(storeName, mode);
  return tx.objectStore(storeName);
};

// 채팅 히스토리
export const getAllChatGroups = async (): Promise<IndexedDBItem[]> => {
  const store = await getStore(CHAT_HISTORY_STORE, "readonly");
  const request = store.getAll();
  return await wrapRequest(request);
};

export const saveChatGroup = async (item: IndexedDBItem): Promise<void> => {
  const store = await getStore(CHAT_HISTORY_STORE, "readwrite");
  await wrapRequest(store.put(item));
};

export const deleteChatGroup = async (id: number): Promise<void> => {
  const store = await getStore(CHAT_HISTORY_STORE, "readwrite");
  await wrapRequest(store.delete(id));
};

export const updateChatGroup = async (item: IndexedDBItem): Promise<void> => {
  await saveChatGroup(item);
};

// 보관 된 채팅
export const getSavedChatGroups = async (): Promise<IndexedDBItem[]> => {
  const store = await getStore(CHAT_SAVED_STORE, "readonly");
  const request = store.getAll();
  return (await wrapRequest(request)) ?? [];
};

export const updateSavedChatGroup = async (
  item: IndexedDBItem
): Promise<void> => {
  const store = await getStore(CHAT_SAVED_STORE, "readwrite");
  await wrapRequest(store.put(item));
};

export const deleteSavedChatGroup = async (id: number): Promise<void> => {
  const store = await getStore(CHAT_SAVED_STORE, "readwrite");
  await wrapRequest(store.delete(id));
};

// 만족도 메모 된 채팅
export const getSatisfactionChatGroups = async (): Promise<
  SatisfactionDBItem[]
> => {
  const store = await getStore(CHAT_SATISFACTION_STORE, "readonly");
  const request = store.getAll();
  return (await wrapRequest(request)) ?? [];
};

export const getSatisfactionId = async (
  chatId: number
): Promise<number | undefined> => {
  const store = await getStore(CHAT_SATISFACTION_STORE, "readonly");
  const item = await wrapRequest(store.get(chatId));
  return (item && item.satisfactionId) ?? undefined;
};

export const updateSatisfactionGroups = async (
  item: SatisfactionDBItem
): Promise<void> => {
  const store = await getStore(CHAT_SATISFACTION_STORE, "readwrite");
  await wrapRequest(store.put(item));
};

//공유 된 채팅
export const getShareChatGroups = async (): Promise<ShareDBItem[]> => {
  const store = await getStore(CHAT_SHARED_STORE, "readonly");
  const request = store.getAll();
  return (await wrapRequest(request)) ?? [];
};

export const updateShareChatGroups = async (
  item: ShareDBItem
): Promise<void> => {
  const store = await getStore(CHAT_SHARED_STORE, "readwrite");
  await wrapRequest(store.put(item));
};

export const deleteShareChatGroups = async (id: number): Promise<void> => {
  const store = await getStore(CHAT_SHARED_STORE, "readwrite");
  await wrapRequest(store.delete(id));
};
