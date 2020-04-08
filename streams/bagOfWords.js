const socketIO = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode, getImage } = require("../common/index");

const matchFeatures = () => {
  const img1 = getImage(path.join(__dirname, "../data/leopard1.jpg"));
  const img2 = getImage(path.join(__dirname, "../data/leopard2.jpg"));

  const detector = new cv.SIFTDetector({ nFeatures: 2000 });

  // detect keypoints
  const keypoints1 = detector.detect(img1);
  const keypoints2 = detector.detect(img2);

  // compute feature descriptors
  const descriptors1 = detector.compute(img1, keypoints1);
  const descriptors2 = detector.compute(img2, keypoints2);
  const matches = cv.matchFlannBased(descriptors1, descriptors2);

  return cv.drawMatches(img1, img2, keypoints1, keypoints2, matches);
};

const kmeansTrainer = () => {
  const img = getImage(path.join(__dirname, "../data/apple.jpg"));
  const detector = new cv.SIFTDetector({ nFeatures: 2000 });

  // detect keypoints
  const keypoints = detector.detect(img);

  // compute feature descriptors
  const descriptors = detector.compute(img, keypoints);
  const matches = cv.matchBruteForce(descriptors1, descriptors2);
};

const stream = server => {
  const io = socketIO(server);
  const img = matchFeatures();
  // const img = kmeansTrainer();

  // const copyImage = getImencode(copy);
  const originalImage = getImencode(img);

  io.on("connection", socket => {
    socket.emit("new-frame", { original: originalImage });
    // socket.emit("new-frame", { copyImage: copyImage });

    socket.on("disconnect", function() {
      // copy.release();
      // img.release();
    });
  });
};

module.exports = stream;
