const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const port = 5500;
const cookieParser = require("cookie-parser");
const Connect = require("../backend/connectdatabase/mongodb");
const user = require("../backend/router/userroute");
const message = require("../backend/router/messageroute");

dotenv.config({ path: "backend/env/cong.env" });
app.use(express.static(path.join(__dirname, 'frontend')));

const currentDir = __dirname;
const newDir = currentDir.replace('backend', 'forentend');


const corsOptions = {
    origin: ['http://127.0.0.1:5500','https://anoniymous-messages.vercel.app','http://10.200.34.100:5500', '${API_URL}' ,'http://192.168.137.1:5500'],
    optionsSuccessStatus: 200,
    credentials: true
};



app.use(cors(corsOptions));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/anonymousMessages", user);
app.use("/anonymousMessages", message);

app.get('/', (req, res) => {
    res.send('server is working in vercel');
});

app.get("/anonymousMessages/:reserverid",(req,res)=>{
    res.sendFile(path.join(newDir, 'anyonemessage.html'));
})



app.use(express.json());
Connect()
if(!Connect()){
    console.log("connect database fail")
}
else{
    console.log("connected to database: ", process.env.URL)
    console.log(newDir)
}




app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
    
});
