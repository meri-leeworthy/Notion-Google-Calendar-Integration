// Require express and body-parser
const express = require("express");
const path = require("path");
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
  console.log(JSON.stringify(req.body));
  console.log(req.baseUrl);
  console.log("X-Goog-Channel-ID:");
  console.log(JSON.stringify(req.get("X-Goog-Channel-ID")));
  console.log("X-Goog-Resource-ID:");
  console.log(req.get("X-Goog-Resource-ID"));
  console.log("X-Goog-Resource-State:");
  console.log(req.get("X-Goog-Resource-State"));
  res.status(200).end(); // Responding is important
});

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//need to send a watch request to google
