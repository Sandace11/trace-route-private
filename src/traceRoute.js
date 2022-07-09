const ChildProcess = require('child_process');
const { isIPAddress } = require("ip-address-validator");


const traceRoute = function (address, callback) {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    const ipRegex = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
    if (urlRegex.test(address)) {
        console.log("URL");
    }
    if (ipRegex.test(address)) {
        console.log("IP");
    }


    if (!urlRegex.test(address) && !ipRegex.test(address)) {
        return callback("Invalid URL", undefined);
    }


    // ChildProcess.exec(`tracert -w 100 -h 15 ${address}`, (err, stdout, stderr) => {
    //     if (err) {
    //         callback(err, undefined);
    //         console.log("ChildProcess.exec error: " + err);
    //     } else if (stderr.toString().length > 0) {
    //         callback(stderr, undefined);
    //         console.log("stderr error , stderr.toString().length > 0");
    //     } else {
    //         console.log("stdout: " + stdout);
    //         // let routes = stdout.toString().split('\n').slice(3).filter(line => line.length > 20).map(route => {
    //         //     route = route.slice(32).trim();
    //         //     if (!(route.includes('Request timed out.') || route.includes('Destination host unreachable'))) {
    //         //         route = route.split(' ')[route.split(' ').length - 1];
    //         //         // replace '[' and ']' in a string
    //         //         route = route.replace(/[\[\]]/g, '');       //RegEx credit github copilot
    //         //         return route;
    //         //     } else {
    //         //         return undefined;
    //         //     }
    //         // })
    //         // routes = routes.filter(e => (e != undefined))
    //         // callback(undefined, routes);
    //     }
    // });
}

module.exports = traceRoute;
// export default traceRoute;

// traceRoute("worldlink.com.np", (error, ips) => {
//     if (error) {
//         console.log(error)
//     } else {
//         console.log(ips)
//     }
// });
