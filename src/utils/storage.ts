const DB_NAME = 'GlobalAdmitDB';
const STORE_NAME = 'documents';
const DB_VERSION = 1;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function saveDocuments(files: Record<string, File>): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Clear old files
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      // Save new files
      const entries = Object.entries(files);
      if (entries.length === 0) {
        resolve();
        return;
      }
      
      let completed = 0;
      entries.forEach(([key, file]) => {
        const putRequest = store.put(file, key);
        putRequest.onsuccess = () => {
          completed++;
          if (completed === entries.length) resolve();
        };
        putRequest.onerror = () => reject(putRequest.error);
      });
    };
    clearRequest.onerror = () => reject(clearRequest.error);
  });
}

export async function loadDocuments(): Promise<Record<string, File>> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openCursor();
    const files: Record<string, File> = {};
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        files[cursor.key as string] = cursor.value as File;
        cursor.continue();
      } else {
        resolve(files);
      }
    };
    request.onerror = () => reject(request.error);
  });
}
