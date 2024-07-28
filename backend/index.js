const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const Connect = require("../backend/connectdatabase/mongodb");
const user = require("../backend/router/userroute");
const message = require("../backend/router/messageroute");

dotenv.config({ path: "backend/env/cong.env" });
console.log("Environment URL:", process.env.URL)

const app = express();
const port = 5500;

const currentDir = __dirname;
const newDir = currentDir.replace('backend', 'forentend');

const corsOptions = {
    origin: ['https://anoniymous-messages.vercel.app', 'http://127.0.0.1:5500'],
    optionsSuccessStatus: 200,
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend')));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Routes
app.use("/anonymousMessages", user);
app.use("/anonymousMessages", message);

app.get('/', (req, res) => {
    res.send('server is working in vercel');
});

app.get('/test-cors', cors(corsOptions), (req, res) => {
    res.json({ message: 'CORS test successful' });
});

app.get("/anonymousMessages/:reserverid", (req, res) => {
    res.sendFile(path.join(newDir, 'anyonemessage.html'));
});

// Database connection
Connect()
    .then(() => {
        console.log("connected to database: ", process.env.URL);
        console.log(newDir);
    })
    .catch(err => {
        console.log("connect database fail", err);
    });

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
