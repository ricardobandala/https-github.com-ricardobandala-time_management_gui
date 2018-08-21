// https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e

const electron = require('electron');
const path = require('path');
const fs = require('fs');
const request = require('request');
import local_store from './app_assets/local-store.js';


const time_management_client = new _TimeManagementClient()

class _TimeManagementClient {
    api_url = 'http://localhost:8181/api'

    //Pseudo class methods (not present on the state classes)
    get() {
        return this._state
    };

    state_to_string() {
        return this._state.name
    }

    set(state) {
        this._state = state
    };

    define_initial_state_by_token(){
        if(local_store.get('bearer_token')){
            return this.bearer_holder
        }
        else if(local_store.get('basic_token')){
            return this.basic_holder
        }
        else{
            return this.unauthenticated
        }
    };

    constructor(api_url) {
        const _that = this

        //Define behaviour type
        this.unauthenticated = new _Unauthenticaded(_that);
        this.unauthorized = new _Unauthorized(_that);
        this.basic_holder = new _BasicHolder(_that);
        this.bearer_holder = new _BearerHolder(_that);
        this.authorized = new _Authorized(_that);

        // Check what do we have stored in our local app data
        // and define the state based on that
        this._state = this.define_initial_state_by_token();
    }



    //define interface methods

    is_authenticated(opts) {
        this._state.is_authenticated(opts)
    }

    request_resource = function (url, success_callback, error_callback) {
        this._state.request_resource(url, success_callback, error_callback);
    }

    request_basic = function (args) {
        this._state.request_basic(args);
    }

    request_bearer = function (args) {
        this._state.request_bearer(args);
    }

    request_logout = function (args) {
        this._state.request_logout(args);
    }
}

class _Unauthenticaded {
    constructor(opts) {
        this._super = opts;
    };

    name = 'unauthenticaded';

    is_authenticated(success_callback, error_callback) {
        if(local_store.get('bearer_token')){
            // request(this._super.api_url)
        }
    }

    request_resource() {
        throw error
    };

    request_basic() {

    };

    request_bearer() {
        throw error
    };

    request_logout() {
        throw error
    };
}


class _Unauthorized {
    name = 'unauthorized';

    constructor(opts) {
        this._super = opts;
    };

    is_authenticated() {
        throw error
    }
    request_resource() {
        throw error
    };

    request_basic() {
        throw error
    };

    request_bearer() {
        throw error
    };

    request_logout() {
        throw error
    };
}


class _BasicHolder {
    constructor(opts) {
        this._super = opts;
    };

    name = 'basic_holder';

    is_authenticated() {
        throw error
    }
    request_resource() {
        throw error
    };

    request_basic() {
        throw error
    };

    request_bearer() {
        throw error
    };

    request_logout() {
        throw error
    };
}


class _BearerHolder {
    constructor(opts) {
        this._super = opts;
        this.status = null;
    };

    name = 'bearer_holder';

    is_authenticated() {
        this._super.uri
    }
    request_resource(url, success_callback, error_callback) {
        request({
            url: url,
            headers: {
                Accept: 'application/json'
            }
        }, function (err, resp, body) {
            if (err) {
                switch (resp.statusCode) {
                    case 401:
                        this._super.set(this._super.unauthenticated);
                        break;
                    case 403:
                        this._super.set(this._super.unauthorized);
                        break;
                }
                error_callback(err, body);
            } else {
                success_callback(resp, body);
            }
        });
    };

    request_basic() {
        throw error
    };

    request_bearer() {
        throw error
    };

    request_logout() {
        //delete bearer token
    };
}


class _Authorized {
    constructor(opts) {
        this._super = opts;
    };

    name = 'Authorized';

    is_authenticated() {
        throw error
    }
    request_resource() {
        throw error
    };

    request_basic() {
        throw error
    };

    request_bearer() {
        throw error
    };

    request_logout() {
        throw error
    };
}

module.exports = time_management_client

//
//
//
//
//
//     constructor(opts) {
//
//         // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
//         // app.getPath('userData') will return a string of the user's app data directory path.
//         const userDataPath = (electron.app || electron.remote.app).getPath('userData');
//         // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
//         this.path = path.join(userDataPath, opts.configName + '.json');
//
//         this.data = parseDataFile(this.path, opts.defaults);
//     }
//
//     // This will just return the property on the `data` object
//     get(key) {
//         return this.data[key];
//     }
//
//     // ...and this will set it
//     set(key, val) {
//         this.data[key] = val;
//         // Wait, I thought using the node.js' synchronous APIs was bad form?
//         // We're not writing a server so there's not nearly the same IO demand on the process
//         // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
//         // we might lose that data. Note that in a real app, we would try/catch this.
//         fs.writeFileSync(this.path, JSON.stringify(this.data));
//     }
// }
//
// function parseDataFile(filePath, defaults) {
//     // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
//     // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
//     try {
//         return JSON.parse(fs.readFileSync(filePath));
//     } catch(error) {
//         // if there was some kind of error, return the passed in defaults instead.
//         return defaults;
//     }
// }
//
// // expose the class
// module.exports = LocalStore;