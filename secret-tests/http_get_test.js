const http = require('http');

const port = 3000;
const set_cookie = [];
const dataFromServer = {};

function get(reletiveURI) {
    return new Promise((resolve, reject) => {
        console.log("\n\n\n\nin get1\n\n\n\n");
        const get_options = {
            host: 'localhost',
            port: port,
            path: '/' + reletiveURI,
            method: 'GET',
            headers: {
                'Cookie': set_cookie
            }
        };
        console.log("\n\n\n\nin get2\n\n\n\n");
        if ('token' in dataFromServer) {
            get_options.headers.authorization = 'Bearer ' + dataFromServer.token;
        }
        console.log("\n\n\n\nin get3\n\n\n\n");
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
        console.log("\n\n\n\nin get4\n\n\n\n");
        req.end();
    });
}

new Promise((resolve, reject) => {
    let attempts = 10;
    let resolved = false;
    const interval = setInterval(() => {
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