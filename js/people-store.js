/*
 * Opslag van mensen (naam + foto) in IndexedDB, alleen op dit apparaat.
 * Foto's worden eerst verkleind zodat ze weinig ruimte innemen.
 */
(function () {
  'use strict';

  const DB_NAME = 'lets-talk';
  const DB_VERSION = 1;
  const STORE = 'people';
  const MAX_PHOTO_EDGE = 800;
  const PHOTO_QUALITY = 0.85;
  const PHOTO_BACKGROUND = '#FFFFFF';
  const MAX_UPLOAD_BYTES = 30 * 1024 * 1024;
  const MAX_NAME_LENGTH = 40;

  let dbPromise = null;

  function requestToPromise(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function openDb() {
    if (!('indexedDB' in window)) {
      return Promise.reject(new Error('IndexedDB wordt niet ondersteund'));
    }
    if (!dbPromise) {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE, { keyPath: 'id' });
      };
      dbPromise = requestToPromise(request).catch((error) => {
        dbPromise = null; // allow a retry later
        throw error;
      });
    }
    return dbPromise;
  }

  async function withStore(mode, action) {
    const db = await openDb();
    const transaction = db.transaction(STORE, mode);
    const completed = new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    const [result] = await Promise.all([
      requestToPromise(action(transaction.objectStore(STORE))),
      completed,
    ]);
    return result;
  }

  async function listPeople() {
    const people = await withStore('readonly', (store) => store.getAll());
    return [...people].sort((a, b) => a.createdAt - b.createdAt);
  }

  function newId() {
    return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function validateName(rawName) {
    const name = String(rawName ?? '').trim();
    if (name.length === 0) return { isValid: false, message: 'Typ eerst een naam.' };
    if (name.length > MAX_NAME_LENGTH) {
      return { isValid: false, message: `Gebruik maximaal ${MAX_NAME_LENGTH} tekens.` };
    }
    return { isValid: true, value: name };
  }

  async function addPerson({ name, photo }) {
    const nameResult = validateName(name);
    if (!nameResult.isValid) throw new Error(nameResult.message);
    if (!(photo instanceof Blob)) throw new Error('Geen geldige foto');
    const person = Object.freeze({ id: newId(), name: nameResult.value, photo, createdAt: Date.now() });
    await withStore('readwrite', (store) => store.add(person));
    requestPersistentStorage();
    return person;
  }

  function deletePerson(id) {
    return withStore('readwrite', (store) => store.delete(id));
  }

  // Ask the browser not to clear the photos when the device runs low on space.
  function requestPersistentStorage() {
    if (!navigator.storage?.persist) return;
    navigator.storage.persist().catch((error) => {
      console.warn('Blijvende opslag aanvragen is mislukt:', error);
    });
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Foto kon niet worden gelezen')); };
      img.src = url;
    });
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Foto kon niet worden verkleind'))),
        'image/jpeg',
        PHOTO_QUALITY,
      );
    });
  }

  /** Validates an uploaded file and returns a smaller JPEG blob. */
  async function preparePhoto(file) {
    if (!(file instanceof File) || !file.type.startsWith('image/')) {
      throw new Error('Kies een foto.');
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error('Deze foto is te groot.');
    }
    const img = await loadImage(file);
    const scale = Math.min(1, MAX_PHOTO_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const context = canvas.getContext('2d');
    context.fillStyle = PHOTO_BACKGROUND; // JPEG has no transparency; avoid black corners
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvasToBlob(canvas);
  }

  window.LetsTalk = Object.freeze({
    ...window.LetsTalk,
    peopleStore: Object.freeze({
      listPeople, addPerson, deletePerson, preparePhoto, validateName, MAX_NAME_LENGTH,
    }),
  });
})();
