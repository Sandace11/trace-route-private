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

// Copilot 
console.log(data);
if (data.error) {
    return alert(data.error);
}
const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {
        lat: data.coords[0].lat,
        lng: data.coords[0].lng
    }
});
const marker = new google.maps.Marker({
    position: {
        lat: data.coords[0].lat,
        lng: data.coords[0].lng
    },
    map: map
});
data.coords.forEach(coord => {
    const marker = new google.maps.Marker({
        position: {
            lat: coord.lat,
            lng: coord.lng
        },
        map: map
    });
});