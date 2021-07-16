// Require express and body-parser
const express = require("express");
const path = require("path");
const bigSync = require("./sync")
// const bodyParser = require("body-parser");

// Initialize express and define a port
const app = express();
const PORT = 80;

// Tell express to use body-parser's JSON parsing
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/google96814f8a402614e3.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/google96814f8a402614e3.html"));
});

app.post("/hook", (req, res) => {
  console.log("Trying to synchronise");
  bigSync();
  console.log("maybe it worked?");
  res.status(200).end(); // Responding is important
});

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//need to send a watch request to google
