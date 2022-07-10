const express = require('express')
const path = require('path');

const traceRoute = require('./utils/traceRoute');
const toCoords = require('./utils/toCoords');

const app = express();
const port = process.env.port || 3000;

const publicFolder = path.join(__dirname, '../public');

app.use(express.static(publicFolder));

app.get("/", (req, res) => {
    res.render('index');
})

app.get("/trace", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Must provide an address!"
        });
    }

    traceRoute(req.query.address, (error, ips) => {
        if (error) {
            console.log(error);
            return res.status(500).send({
                error: error
            })
        }

        toCoords(ips, (error, coords) => {
            if (error) {
                return res.status(500).send({
                    error: error
                })
            }

            res.status(200).send({
                ips: ips,
                coords: coords
            });
        })
    })

})

app.listen(port, () => {
    console.log("Server up & running at port " + port);
});