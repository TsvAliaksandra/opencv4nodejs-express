const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const detectContoursStream = require("./streams/detectContours");
const faceDetectionStream = require("./streams/faceDetection");
const filtersStream = require("./streams/filters");
const machineLearnigStream = require("./streams/machineLearnig");
const bagOfWordsStream = require("./streams/bagOfWords");
const HOGDescriptorForImageStream = require("./streams/HOGDescriptorForImage");

const port = process.env.PORT || 3000;
const STATIC_PATH = path.join(__dirname, "public");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(STATIC_PATH));

app.get("/detect-contours", (req, res) => {
  detectContoursStream(server);
  res.sendFile(`${STATIC_PATH}/index.html`);
});

app.get("/face-detection", (req, res) => {
  faceDetectionStream(server);
  res.sendFile(`${STATIC_PATH}/index.html`);
});

app.get("/filters", (req, res) => {
  filtersStream(server);
  res.sendFile(`${STATIC_PATH}/index.html`);
});

app.get("/machine-learing", (req, res) => {
  machineLearnigStream(server);
  res.sendFile(`${STATIC_PATH}/index.html`);
});

app.get("/bag-of-words", (req, res) => {
  bagOfWordsStream(server);
  res.sendFile(`${STATIC_PATH}/index.html`);
});

app.get("/hog-descriptor", (req, res) => {
  HOGDescriptorForImageStream(server);
  res.sendFile(`${STATIC_PATH}/index.html`);
});

server.listen(port, () => {
  console.log("Listening on", port);
});
