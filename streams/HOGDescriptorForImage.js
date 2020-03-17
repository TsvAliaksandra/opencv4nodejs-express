const socketIO = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode, getImage } = require("../common/index");

const hog = () => {
  const nbins = 9;
  const cellSize = new cv.Size(10, 10);
  const blockSize = new cv.Size(20, 20);
  const blockStride = new cv.Size(10, 10);
  const winSize = new cv.Size(920, 690);

  const peopleDetectorHog = new cv.HOGDescriptor(
    winSize,
    blockSize,
    blockStride,
    cellSize,
    nbins
  );

  // peopleDetectorHog.setSVMDetector(cv.HOGDescriptor.getDefaultPeopleDetector());

  return peopleDetectorHog;
};

const computeHOGDescriptorFromImage = () => {
  const img = getImage(path.join(__dirname, "../data/people-2.jpg"));
  img.resize(new cv.Size(img.cols * 2, img.rows * 2));
  const winStride = new cv.Size(4, 4);

  const detectedImg = hog().detectMultiScale(
    img,
    0.0,
    winStride,
    new cv.Size(),
    1.05,
    2.0,
    true
  );

  img.resize(new cv.Size(img.cols / 2, img.rows / 2));

  console.log(detectedImg.foundLocations);

  for (let i = 0; i < detectedImg.foundLocations.length; ++i) {
    const detection = new cv.Rect(detectedImg.foundLocations[i]);
    detection.x /= 2;
    detection.y /= 2;
    detection.width /= 2;
    detection.height /= 2;

    img.drawRectangle(detection, new cv.Vec3(0, 0, 255));
  }

  return { img };
};

const stream = server => {
  const io = socketIO(server);
  const { img } = computeHOGDescriptorFromImage();

  const originalImage = getImencode(img);

  io.on("connection", socket => {
    socket.emit("new-frame", { original: originalImage });

    socket.on("disconnect", function() {
      img.release();
    });
  });
};

module.exports = stream;
