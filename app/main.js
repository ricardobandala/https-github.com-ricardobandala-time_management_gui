const {app, BrowserWindow} = require('electron');

let window;
const path = require('path');

import time_management_client from './app_assets/time_management_client.js';
import local_store from './app_assets/local-store.js';

function initial_window_load() {

    let landing_view = local_store.get('landing_view');
    time_management_client().is_authenticated(
        //on success
        function (err, resp, body) {
            createWindowLandingPage(err, resp, body, landing_view)
        },
        //on error
        function (err, resp, body) {

            let user = local_store.get('user');
            let password = local_store.get('password');
            switch(resp.statusCode){
                case 401:
                    createWindowLogin(err, resp, body, local_store.get('login_view'), user, password);
                case 403:
                    createWindowLandingPage(err, resp, body, view_path)
                    break;
                default:
                    console.log('error')
                    break;
            }
        }
    )
}

function createWindowLogin (err, resp, body, path, user, password) {
    // webPreferences: {devTools: false};
    window = new BrowserWindow({modal:true, frame: false});
    window.loadFile(path,{
        user: user,
        password: password
    });
    window.on('closed', () => {
        window = null
    });
}

/**
 * This is a app defined default page for when system errors or unauthorized events
 * avoid the user to reach the section on the app
 *
 * @param err
 * @param resp
 * @param body
 * @param path
 */
function createWindowDefaultPage (err, resp, body, path) {
    window = new BrowserWindow({fullscreen:true, webPreferences: {devTools: false}});
    window.loadFile(path);
    window.on('closed', () => {
        window = null
    });
}

function createWindowLandingPage (err, resp, body, path) {
    window = new BrowserWindow({fullscreen:true, webPreferences: {devTools: false}});
    window.loadFile(path);
    window.on('closed', () => {
        window = null
    });
}

function start_app(){
    initial_window_load();

}


app.on('ready', start_app);

app.on('activate', () => {
    if (window === null) {
        start_app()
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});