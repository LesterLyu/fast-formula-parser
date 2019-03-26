const colCache = require('./col-cache');
const addressConverter = require('./addressConverter');
const utils = require('./utils');

let start = Date.now();
for (let i = 0; i < 100000; i++) {
    colCache.decode('AB11');
}
let end = Date.now();
console.log('colCache takes', end - start, 'ms')
start = Date.now();
for (let i = 0; i < 100000; i++) {
    addressConverter.fromAddress('AB11');
}
end = Date.now();
console.log('addressConverter takes', end - start, 'ms')

start = Date.now();
for (let i = 0; i < 100000; i++) {
    utils.parseCell('AB11');
}
end = Date.now();
console.log('addressConverter takes', end - start, 'ms')
