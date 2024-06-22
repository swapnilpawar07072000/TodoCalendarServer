const express = require('express');
// const serverless = require("serverless-http");
const app = express();
const port = 3003; 
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const cors = require('cors');
// const router = express.Router();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

app.get("/", (req, res) => {
    res.send({msg: "Site is running"});
})

app.get("/api/resetJSONFile", async(req, res) => {
    const file_location = '/tmp/files/eventsList.json';;
    const data = {
        "data": {},
        "last_id": 1
    }
    await createJSONFile(file_location, data, true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send({msg: "JSON File set to default value"});
})

app.get("/api/getJSONFile", async(req, res) => {  
    const file_location = '/tmp/files/eventsList.json';  
    const data = await readFileJSON(file_location);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(data);
});

app.post('/api/updateJSONFile', async(req, res) => {
    var reqData = req.body;
    const file_location = '/tmp/files/eventsList.json';
    //createJSONFile(file_location, reqData);
    await writeFileJSON(file_location, reqData);
    const data = await readFileJSON(file_location);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // console.log(data);
    res.send(data);
});
app.delete('/api/delete', async(req, res) => {
    var reqData = req.body;
    var eventData = JSON.parse(reqData.event_data);
    var eventID = reqData.event_id;
    delete eventData.data[eventID];
    const file_location = '/tmp/files/eventsList.json';;
    //createJSONFile(file_location, eventData);
    await writeFileJSON(file_location, eventData);
    const data = await readFileJSON(file_location);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(data);
});

 const createJSONFile = async(file_location, data, reset=false)=>{
    if(reset){
        await writeFileJSON(file_location, data);
    }else if(!fs.existsSync(path.resolve(__dirname+file_location))){
        await writeFileJSON(file_location, data);
    }   

}
const writeFileJSON = async(file_location, reqData) => {
    // await writeFileAsync(path.resolve(__dirname+file_location), JSON.stringify(reqData));
    await writeFileAsync(path.resolve(__dirname+file_location), JSON.stringify(reqData));
}

const readFileJSON = async(file_location) => {
    var data = await readFileAsync(path.resolve(__dirname+file_location), "utf8");
    return data;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// app.use("/.netlify/functions/server", router);
// module.exports.handler = serverless(app);
