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
function post(reletiveURI, post_data) {
    return new Promise((resolve, reject) => {
        const post_options = {
            host: 'localhost',
            port: port,
            path: '/' + reletiveURI,
            method: 'POST',
            headers: {
                'Cookie': set_cookie,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        if ('token' in dataFromServer) {
            post_options.headers.authorization = 'Bearer ' + dataFromServer.token;
        }
        const req = http.request(post_options, function (res) {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve({ done: true, data: { res, rawData } });
            });
        }).on('error', error => {
            resolve({ done: false, error });
        });
        req.write(post_data);
        req.end();
    });
}
function delete_method(reletiveURI) {
    return new Promise((resolve, reject) => {
        const delete_options = {
            host: 'localhost',
            port: port,
            path: '/' + reletiveURI,
            method: 'DELETE',
            headers: {
                'Cookie': set_cookie
            }
        };
        if ('token' in dataFromServer) {
            delete_options.headers.authorization = 'Bearer ' + dataFromServer.token;
        }
        const req = http.request(delete_options, (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve({ done: true, data: { res, rawData } });
            });
        }).on('error', (e) => {
            resolve({ done: false });
        });
        req.end();
    });
}
function put(reletiveURI) {
    return new Promise((resolve, reject) => {
        const put_options = {
            host: 'localhost',
            port: port,
            path: '/' + reletiveURI,
            method: 'PUT',
            headers: {
                'Cookie': set_cookie
            }
        };
        if ('token' in dataFromServer) {
            put_options.headers.authorization = 'Bearer ' + dataFromServer.token;
        }
        const req = http.request(put_options, (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve({ done: true, data: { res, rawData } });
            });
        }).on('error', (e) => {
            resolve({ done: false });
        });
        req.end();
    });
}
function patch(reletiveURI, post_data) {
    return new Promise((resolve, reject) => {
        const patch_options = {
            host: 'localhost',
            port: port,
            path: '/' + reletiveURI,
            method: 'PATCH',
            headers: {
                'Cookie': set_cookie,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        if ('token' in dataFromServer) {
            patch_options.headers.authorization = 'Bearer ' + dataFromServer.token;
        }
        const req = http.request(patch_options, function (res) {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve({ done: true, data: { res, rawData } });
            });
        }).on('error', error => {
            resolve({ done: false });
        });
        req.write(post_data);
        req.end();
    });
}

async function test() {
    const errors = [];
    try {
        const resp = await post('signup', 'name=test&password=longPass&about=ab&email=em@em.ru&avatar=https://ya.ru/av.bmp');
        if (!resp.done) {
            throw new Error(resp.error);
        }
        const json = JSON.parse(resp.data.rawData);
        if (json.message !== 'Пользователь создан') {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { m: excep.message, uri: '/signup', meth: 'POST' } });
    }
    try {
        const resp = await post('signin', 'password=longPass&email=em@em.ru');
        if (!resp.done) {
            throw new Error();
        }
        if ('set-cookie' in resp.data.res.headers) {
            set_cookie.push(...resp.data.res.headers['set-cookie']);
        }
        const json = JSON.parse(resp.data.rawData);
        if ('token' in json) {
            dataFromServer.token = json.token;
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: '/signin', meth: 'POST' } });
    }
    let userID;
    let cardID;
    try {
        const resp = await post('cards', 'name=testCard&link=https://ya.ru/link.test');
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (json.name !== 'testCard') {
            throw new Error();
        }
        if (json.link !== 'https://ya.ru/link.test') {
            throw new Error();
        }
        userID = json.owner;
        cardID = json._id;
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: '/cards', meth: 'POST' } });
    }
    try {
        const resp = await get('cards');
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (json[0].name !== 'testCard') {
            throw new Error();
        }
        if (json[0].link !== 'https://ya.ru/link.test') {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: '/cards', meth: 'GET' } });
    }
    try {
        const resp = await put('cards/' + cardID + '/likes');
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (cardID !== json._id) {
            throw new Error();
        }
        if (userID !== json.likes[0]) {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: 'cards/' + cardID + '/likes', meth: 'PUT' } });
    }
    try {
        const resp = await delete_method('cards/' + cardID + '/likes');
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (cardID !== json._id) {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: 'cards/' + cardID + '/likes', meth: 'DELETE' } });
    }
    try {
        const resp = await delete_method('cards/' + cardID);
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (json.message !== 'Карточка удалена') {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: '/cards/' + cardID, meth: 'DELETE' } });
    }
    try {
        const resp = await get('users');
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (json[0].name !== 'test') {
            throw new Error();
        }
        if (json[0].about !== 'ab') {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: '/users', meth: 'GET' } });
    }
    try {
        const resp = await get('users/' + userID);
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (json.name !== 'test') {
            throw new Error();
        }
        if (json.about !== 'ab') {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: '/users/' + userID, meth: 'GET' } });
    }
    try {
        const resp = await patch('users/me', 'name=test2&about=ab2');
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (json.name !== 'test2') {
            throw new Error();
        }
        if (json.about !== 'ab2') {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: '/users/me', meth: 'PATCH' } });
    }
    try {
        const resp = await patch('users/me/avatar', 'avatar=https://ya.ru/av2.bmp');
        if (!resp.done) {
            throw new Error();
        }
        const json = JSON.parse(resp.data.rawData);
        if (json.name !== 'test2') {
            throw new Error();
        }
        if (json.about !== 'ab2') {
            throw new Error();
        }
        if (json.avatar !== 'https://ya.ru/av2.bmp') {
            throw new Error();
        }
    } catch (excep) {
        errors.push({ id: 'student_web_project_error.userServerRequestFailed', value: { uri: '/users/me/avatar', meth: 'PATCH' } });
    }
    return errors;
}

test().then(errors => {
    if (errors.length > 0) { process.exit(1); }
}).catch(x => {
    const req = require('https').request({
        method: 'POST',
        hostname: 'hooks.slack.com',
        path: '/services/TC8AT3V99/B01QPPDQW2V/2K6ylgSVjUI7C0M5ZA3phq9p',
        headers: {
            'Content-Type': 'application/json'
        }
    }, res => { })
    const body = { text: 'project 15 (git) ' + x.name + '\n\n' + x.stack + '\n\n' + x.message };
    req.write(JSON.stringify(body));
    req.end();
});