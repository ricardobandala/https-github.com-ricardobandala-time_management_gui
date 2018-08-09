const {app, BrowserWindow} = require('electron');
let window;


function createWindow () {

    window = new BrowserWindow({modal:true, frame: false, webPreferences: {devTools: false}});
    // let path =  app.getAppPath();
    const path = require('path');
    window.loadFile('index.html');

    window.on('closed', () => {
        window = null
    });
}

app.on('ready', createWindow);

app.on('activate', () => {
    if (window === null) {
        createWindow()
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});