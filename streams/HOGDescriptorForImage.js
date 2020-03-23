const socketIO = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode, getImage } = require("../common/index");

const hog = () => {
  // const nbins = 9;
  // const cellSize = new cv.Size(10, 10);
  // const blockSize = new cv.Size(20, 20);
  // const blockStride = new cv.Size(10, 10);
  // const winSize = new cv.Size(640, 360);

  const nbins = 9;
  const cellSize = new cv.Size(8, 8);
  const blockSize = new cv.Size(16, 16);
  const blockStride = new cv.Size(8, 8);
  const winSize = new cv.Size(64, 128);

  const hog = new cv.HOGDescriptor(
    winSize,
    blockSize,
    blockStride,
    cellSize,
    nbins
  );

  hog.setSVMDetector(cv.HOGDescriptor.getDefaultPeopleDetector());

  return hog;
};

const computeHOGDescriptorFromImage = () => {
  let img = getImage(path.join(__dirname, "../data/testimg.jpg"));

  img = img.resize(new cv.Size(img.cols * 2, img.rows * 2));
  const winStride = new cv.Size(4, 4);

  const detectedImg = hog().detectMultiScale(
    img,
    0.1,
    winStride,
    new cv.Size(),
    1.05,
    1.5,
    true
  );

  img = img.resize(new cv.Size(img.cols / 2, img.rows / 2));

  for (let i = 0; i < detectedImg.foundLocations.length; ++i) {
    const detection = detectedImg.foundLocations[i];
    let x = detection.x / 2;
    let y = detection.y / 2;
    let width = detection.width / 2;
    let height = detection.height / 2;
    const newDetection = new cv.Rect(x, y, width, height);

    img.drawRectangle(newDetection, new cv.Vec3(0, 0, 255), 2);
  }

  return { img };
};

const latentSVMDetection = () => {
  let img = getImage(path.join(__dirname, "../data/testimg.jpg"));
  img = img.resize(new cv.Size(img.cols * 2, img.rows * 2));
  const svm = new cv.SVM();
  svm.load(path.join(__dirname, "../data/person.xml"));
};

const stream = server => {
  const io = socketIO(server);
  const { img } = computeHOGDescriptorFromImage();

  const originalImage = getImencode(img);
  // latentSVMDetection();

  io.on("connection", socket => {
    socket.emit("new-frame", { original: originalImage });

    socket.on("disconnect", function() {
      img.release();
    });
  });
};

module.exports = stream;
