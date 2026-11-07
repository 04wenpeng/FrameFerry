const { contextBridge, ipcRenderer, webUtils } = require('electron')

const subscribe = (channel, callback) => {
  const listener = (_event, payload) => callback(payload)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

contextBridge.exposeInMainWorld('frameferry', {
  getBootstrap: () => ipcRenderer.invoke('app:bootstrap'),
  setReady: () => ipcRenderer.invoke('app:ready'),

  openMediaDialog: () => ipcRenderer.invoke('dialog:open-media'),
  chooseOutput: (options) => ipcRenderer.invoke('dialog:choose-output', options),
  chooseDirectory: (defaultPath) => ipcRenderer.invoke('dialog:choose-directory', defaultPath),
  chooseDefaultOutput: () => ipcRenderer.invoke('settings:choose-default-output'),
  clearDefaultOutput: () => ipcRenderer.invoke('settings:clear-default-output'),
  getPathForFile: (file) => webUtils.getPathForFile(file),

  probeMedia: (filePath) => ipcRenderer.invoke('media:probe', filePath),
  getMediaUrl: (filePath) => ipcRenderer.invoke('media:url', filePath),
  getDefaultOutput: (sourcePath, format) =>
    ipcRenderer.invoke('media:default-output', { sourcePath, format }),

  startConversion: (payload) => ipcRenderer.invoke('jobs:start', payload),
  listJobs: () => ipcRenderer.invoke('jobs:list'),
  cancelConversion: (jobId) => ipcRenderer.invoke('jobs:cancel', jobId),
  clearFinishedJobs: () => ipcRenderer.invoke('jobs:clear'),

  listHistory: () => ipcRenderer.invoke('history:list'),
  clearHistory: () => ipcRenderer.invoke('history:clear'),

  showItemInFolder: (filePath) => ipcRenderer.invoke('shell:show-item', filePath),
  openPath: (target) => ipcRenderer.invoke('shell:open', target),

  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  toggleMaximizeWindow: () => ipcRenderer.invoke('window:toggle-maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),

  onJobsUpdate: (callback) => subscribe('jobs:update', callback),
  onOpenFiles: (callback) => subscribe('app:open-files', callback),
  onHistoryUpdate: (callback) => subscribe('history:update', callback),
  onWindowState: (callback) => subscribe('window:state', callback)
})
