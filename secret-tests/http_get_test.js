const http = require('http');

const port = 3000;
const set_cookie = [];
const dataFromServer = {};

function get(reletiveURI) {
    return new Promise((resolve, reject) => {
        const get_options = {
            host: 'localhost',
            port: port,
            path: '/' + reletiveURI,
            method: 'GET',
            headers: {
                'Cookie': set_cookie
            }
        };
        if ('token' in dataFromServer) {
            get_options.headers.authorization = 'Bearer ' + dataFromServer.token;
        }
        const req = http.request(get_options, (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve({ done: true, data: { res, rawData } });
            });
        }).on('error', error => {
            resolve({ done: false });
        });
        req.end();
    });
}

new Promise((resolve, reject) => {
    let attempts = 10;
    let resolved = false;
    const interval = setInterval(() => {
        console.log("\n\n\n\nin setInterval\n\n\n\n");
        attempts--;
        if (attempts === 0) {
            clearInterval(interval);
            reject();
        }
        if (resolved) {
            clearInterval(interval);
            resolve();
        }
        get('cards').then(resp => {
            if (resp.done) {
                resolved = true;
            }
        });
    }, 1000);
}).catch(x => process.exit(1));