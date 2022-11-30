const {app, BrowserWindow} = require('electron');
const path = require('path');
function createWindow(){
    const win = new BrowserWindow({
        minWidth: 1080,
        minHeight: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
          }
    });
    // win.loadFile(__dirname + '/pages/index.html');
    win.loadFile(__dirname + '/index.html');
    win.removeMenu();
}


app.whenReady().then(()=>{
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
      })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


