const express = require("express");
const app = express();
const controller = require("./controller")
const cors = require('cors')
app.use(cors())

app.get('/dictionary', controller.translate);

app.get('/', (req, res) => {
    res.send('We are on home');
})

app.listen(8000, '0.0.0.0', async() =>{
    await controller.primaryHash();
    await controller.secondaryHash();
    console.log("server started");
});