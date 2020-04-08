const socketIOProvider = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode, getImage } = require("../common/index");

const faceDetectionForImage = () => {
  const img = getImage(path.join(__dirname, "../data/got.jpg"));
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
  const detection = classifier.detectMultiScale(img.bgrToGray());
  const numDetectionsTh = 10;

  detection.objects.forEach((rect, i) => {
    const thickness = detection.numDetections[i] < numDetectionsTh ? 1 : 2;
    const blue = new cv.Vec(255, 0, 0);
    img.drawRectangle(rect, blue, thickness, cv.LINE_8);
  });
  return img;
};

const stream = (server) => {
  const io = socketIOProvider(server);

  const source = faceDetectionForImage();
  const img = getImencode(source);

  io.on("connection", (socket) => {
    io.emit("new-frame", { original: img });

    socket.on("disconnect", function () {
      source.release();
    });
  });
};

module.exports = stream;
