// https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e

const electron = require('electron');
const path = require('path');
const fs = require('fs');

const local_store = new _LocalStore()

class _LocalStore {
    constructor() {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');

        this.path = path.join(userDataPath, 'time_management_preferences.json');

        this.data = this.parseDataFile(this.path, {
            landing_view: 'view///dashboard.html',
            landing_page: 'view///dashboard.html',
            login_view: path.join(__dirname, 'view//login.html'),
            basic_token:'',
            bearer_token:'',
        });
    }
    get(key) {
        return this.data[key];
    }


    set(key, val) {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    parseDataFile(filePath, defaults) {
        try {
            return JSON.parse(fs.readFileSync(filePath));
        } catch(error) {
            return defaults;
        }
    }
}

// expose the class
module.exports = local_store;