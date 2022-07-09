const ChildProcess = require('child_process')

const traceRoute = function (address, callback) {
    ChildProcess.exec(`tracert -w 100 -h 15 ${address}`, (err, stdout, stderr) => {
        if (err) {
            callback(err, undefined);
            process.exit(1)
        } else if (stderr.toString().length > 0) {
            callback("stderr error", undefined);
        } else {
            let routes = stdout.toString().split('\n').slice(3).filter(line => line.length > 20).map(route => {
                route = route.slice(32).trim();
                if (!(route.includes('Request timed out.') || route.includes('Destination host unreachable'))) {
                    route = route.split(' ')[route.split(' ').length - 1];
                    // replace '[' and ']' in a string
                    route = route.replace(/[\[\]]/g, '');       //RegEx credit github copilot
                    return route;
                } else {
                    return undefined;
                }
            })
            routes = routes.filter(e => (e != undefined))
            callback(undefined, routes);
        }
    });
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
