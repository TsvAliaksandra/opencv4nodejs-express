const socketIOProvider = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode } = require("../common/index");

const fps = 30; //frames per second
/**
 * video source set to 0 for stream from webcam
 */
// const videoSource = 0;
const videoSource = path.join(__dirname, "../data/people.mp4");
const videoCap = new cv.VideoCapture(videoSource);
videoCap.set(cv.CAP_PROP_FRAME_WIDTH, 600);
videoCap.set(cv.CAP_PROP_FRAME_HEIGHT, 600);

/**
 *
 * Face detection transformation on the stream
 */
const faceDetector = () => {
  const frame = videoCap.read();
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
  const detection = classifier.detectMultiScale(frame.bgrToGray());

  if (!detection.objects.length) {
    // no faces detectd
    return frame;
  }

  // draw faces
  const frameWithFaces = frame.copy();
  detection.objects.forEach((rect, i) => {
    const blue = new cv.Vec(255, 0, 0);

    frameWithFaces.drawRectangle(
      new cv.Point(rect.x, rect.y),
      new cv.Point(rect.x + rect.width, rect.y + rect.height),
      { color: blue, thickness: 2 }
    );
  });
  return frameWithFaces;
};

const stream = (server) => {
  const io = socketIOProvider(server);

  setInterval(() => {
    const source = faceDetector();
    const detectedFrame = getImencode(source);
    io.emit("new-frame", { original: detectedFrame });
  }, 10000 / fps);
};

module.exports = stream;
