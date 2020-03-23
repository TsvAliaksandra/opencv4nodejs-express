const socketIO = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode, getImage } = require("../common/index");

const featureDetector = () => {
  const img = getImage(path.join(__dirname, "../data/apple.jpg"));
  const detector = new cv.SIFTDetector({ nFeatures: 2000 });
  // detect keypoints
  const keypoints = detector.detect(img);
  // compute feature descriptors
  const descriptors = detector.compute(img, keypoints);
  // let a = cv.kmeans(new cv.Point2);
};

const stream = server => {
  const io = socketIO(server);
  featureDetector();

  // const copyImage = getImencode(copy);
  // const originalImage = getImencode(img);

  io.on("connection", socket => {
    // socket.emit("new-frame", { original: originalImage });
    // socket.emit("new-frame", { copyImage: copyImage });

    socket.on("disconnect", function() {
      // copy.release();
      // img.release();
    });
  });
};

module.exports = stream;
