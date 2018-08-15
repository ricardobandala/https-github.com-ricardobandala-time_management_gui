const {app, BrowserWindow} = require('electron');
let window;


function createWindow () {

    window = new BrowserWindow({modal:true, frame: false, webPreferences: {devTools: false}});

    window.loadFile('view//login.html');

    let wala = app.getAppPath()

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