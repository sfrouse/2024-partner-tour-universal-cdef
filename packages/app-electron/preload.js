const { session } = require('electron');

session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.responseHeaders['x-frame-options']) {
        delete details.responseHeaders['x-frame-options'];
    }
    callback({ cancel: false, responseHeaders: details.responseHeaders });
});