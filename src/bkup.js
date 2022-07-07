ChildProcess.exec(`tracert ${address}`, (err, stdout, stderr) => {
    if (err) {
        return res.status(500).send({
            error: "server couldn't traceroute the address"
        });
    } else {
        cmdOutput = stdout.toString().split("\n").slice(3);
        cmdError = stderr.toString();
        console.log(cmdOutput);
        console.log(cmdError);
    }
    res.send({
        cmdOutput,
        cmdError
    });
});