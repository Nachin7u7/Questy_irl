const { contextBridge, ipcRenderer } = require('electron');

// Exponer la API de Electron al proceso de renderizado
contextBridge.exposeInMainWorld('electronAPI', {
    showPrompt: (message) => ipcRenderer.invoke('show-prompt', message),
});