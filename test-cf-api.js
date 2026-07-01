import crypto from 'crypto';

const apiKey = "dummy";
const apiSecret = "dummy";
const handle = "diaslui";

const methodName = "user.status";
const time = Math.floor(Date.now() / 1000);
const rand = Math.random().toString(36).substring(2, 8).padEnd(6, '0');

const params = {
    apiKey,
    handle,
    time
};

const sortedParams = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
const sigString = `${rand}/${methodName}?${sortedParams}#${apiSecret}`;
const hash = crypto.createHash('sha512').update(sigString).digest('hex');
const apiSig = `${rand}${hash}`;

console.log(`URL: https://codeforces.com/api/${methodName}?${sortedParams}&apiSig=${apiSig}`);
