const { app, BrowserWindow, session } = require('electron');
// const path = require('node:path');

// app.commandLine.appendSwitch('disable-site-isolation-trials')
// app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', () => {

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const headers = details.responseHeaders;
        
        // Remove X-Frame-Options if present
        if (headers['x-frame-options']) {
            delete headers['x-frame-options'];
        }
    
        // Modify or remove frame-ancestors in Content Security Policy
        if (headers['content-security-policy']) {
            headers['content-security-policy'] = headers['content-security-policy'].map(policy => {
                return policy.replace(/frame-ancestors[^;]*/g, ""); // Allow all frame ancestors
            });
        }

        console.log('headers', details.url, headers);
    
        callback({ cancel: false, responseHeaders: headers });
    });

    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 970,
        webPreferences: {
            // nodeIntegration: true,
            // webSecurity: false, // Disable web security to prevent iframe blocking
            // preload: path.join(__dirname, './preload.js'), // Path to preload script
            // sandbox: false,
            // contextIsolation: true,
        }
    });

    // mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    //     (details, callback) => {
    //         const { requestHeaders } = details;
    //         UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
    //         delete requestHeaders['x-frame-options'];
    //         callback({ requestHeaders });
    //     },
    // );
    
    // mainWindow.webContents.session.webRequest.onHeadersReceived(
    //     (details, callback) => {
    //         const { responseHeaders } = details;
    //         UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
    //         UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
    //         console.log('responseHeaders', responseHeaders);
    //         delete responseHeaders['x-frame-options'];
    //         callback({
    //             responseHeaders,
    //         });
    //     }
    // );

    mainWindow.loadFile('index.html');
});


function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value;
        // Done
        return;
      }
    }
    // Insert at end instead
    obj[keyToChange] = value;
}