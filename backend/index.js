const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const Connect = require("../backend/connectdatabase/mongodb");
const user = require("../backend/router/userroute");
const message = require("../backend/router/messageroute");

dotenv.config({ path: "backend/env/config.env" });

const currentDir = __dirname;
const newDir = currentDir.replace('backend', 'forentend');

const app = express();
app.use(express.static(path.join(__dirname, 'frontend')));

const corsOptions = {
  origin: ['https://anoniymous-messages.vercel.app', 'http://127.0.0.1:5500'],
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
  res.send('Server is working in Vercel');
});

app.get("/anonymousMessages", (req, res) => {
    console.log("Reserver ID:", req.params.reserverid);
  res.sendFile(path.join(newDir, 'anyonemessage.html'));
});

// Improved error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.use(express.json());

Connect()
  .then(() => {
    console.log("Connected to database:", process.env.URL);
  })
  .catch(err => {
    console.error("Failed to connect to database", err);
  });

app.listen(process.env.PORT || 5500, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5500}`);
});
