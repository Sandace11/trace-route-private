const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

const toCoords = function (ips, callback) {

    let coords = [];

    ips.forEach(ip => {
        const URL = `https://ipinfo.io/${ip}/?token=${process.env.API_KEY}`;

        request({ url: URL, json: true }, (error, response) => {
            if (error) {
                console.log(error);
                callback("Unable to convert ip to coordinates", undefined);
            } else if (response.body.error) {
                callback(response.body.error, undefined);
            } else {
                coords.push(response.body.loc);
                if (coords.length === ips.length) {
                    callback(undefined, coords);
                }
            }
        });
    })
}

// export default toCoords;
module.exports = toCoords;

// toCoords([
//     '2400:1a00:b050:48a6::1',
//     '2400:1a00:b1a5::229',
//     '2400:1a00:0:1::228',
//     '2404:d180:1:212::201',
//     '2001:5a0:2300:200::b9',
//     '2001:5a0:2300:200::b5',
//     '2404:6800:8110::1',
//     '2001:4860:0:1::4fe8',
//     '2001:4860:0:1::269f',
//     '2404:6800:4009:82c::2004'
// ], (error, coords) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(coords);
//     }
// });

