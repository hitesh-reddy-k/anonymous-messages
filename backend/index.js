const express = require('express');
const dotenv = require('dotenv');
const Connect = require("../backend/databacesonnect/data.js");
const questions = require("../backend/routes/questionsroute.js");
const cors = require("cors");
const path = require("path");
const user = require("../backend/routes/userroute.js");
const marks = require("../backend/routes/sem-marksroute.js");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const messages = require("../backend/routes/message.js");
const community = require("../backend/routes/communityroute.js");

const app = express();
const port = 3000;

// CORS options
const corsOptions = {
    origin: [
        'http://127.0.0.1:5500', // Local development
        'https://collage-repo-1.vercel.app', // Backend URL
        'https://collage-repo-1-001.vercel.app' // Frontend URL
    ],
    optionsSuccessStatus: 200,
    credentials: true // Allow cookies and credentials
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight request handling

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add CORS headers explicitly (optional)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://collage-repo-1-001.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Routes
app.use("/question", questions);
app.use("/student", user);
app.use("/messages", messages);
app.use("/community", community);
app.use("/marks", marks);

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Load environment variables
dotenv.config({ path: "backend/envfile/config.env" });
console.log("MongoDB URL:", process.env.URL);

// Connect to the database
Connect();

// Start the server
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
