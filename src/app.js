import express from 'express';
import path from 'path';

import traceRoute from './traceRoute.js';
import toCoords from './toCoords.js';

const app = express();
const port = process.env.port || 3000;


import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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