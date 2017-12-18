var hrf = require('hash-rename-file');

hrf('./css/admin.css', './css/', function (err) {
    if (err) {
        console.error(err);
    }
});