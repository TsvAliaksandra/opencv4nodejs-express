const express = require("express");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const api = require("./routes");
// const streamEnabler = require("./streams/detectContours");
// const streamEnabler = require("./streams/faceDetection");
const streamEnabler = require("./streams/filters");

const port = process.env.PORT || 3000;
const STATIC_PATH = path.join(__dirname, "public");

const app = express();
const server = http.createServer(app);
streamEnabler(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(STATIC_PATH));
app.get("*", (req, res) => {
  res.sendFile(`${STATIC_PATH}/index.html`);
});

app.use("/", api);

server.listen(port, () => {
  console.log("Listening on", port);
});
