const ChildProcess = require('child_process');

const traceRoute = function (address, callback) {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    const ipRegex = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;

    if (!urlRegex.test(address) && !ipRegex.test(address)) {
        return callback({
            errorMessage: 'Invalid address. Please enter a valid URL or IP address.'
        }, undefined);
    }

    // remove the http:// or https:// from the address
    address = address.replace(/^https?:\/\//, '');

    ChildProcess.exec(`tracert -w 100 -h 15 ${address}`, (err, stdout, stderr) => {
        if (err) {
            callback({
                errorMessage: 'Error while tracing route.',
                error: err
            }, undefined);
        } else if (stderr.toString().length > 0) {
            callback({
                errorMessage: 'Error while tracing route. stderr',
                error: stderr
            }, undefined);
        } else {
            let routes = stdout.toString();
            routes = routes.split('\n').slice(3).filter(line => line.length > 20).map(route => {
                route = route.slice(32).trim();
                if (!route.length == 0 && !route.includes('Request timed out.') && !route.includes('Destination host unreachable')) {
                    route = route.split(' ')[route.split(' ').length - 1];
                    // replace '[' and ']' in a string
                    route = route.replace(/[\[\]]/g, '');       //RegEx - github copilot
                    return route;
                } else {
                    return undefined;
                }
            })

            if (routes.length == 0) {
                return callback({
                    errorMessage: 'No route found.'
                }, undefined);
            }

            routes = routes.filter(e => (e != undefined))
            callback(undefined, routes);
        }
    });
}

module.exports = traceRoute;
