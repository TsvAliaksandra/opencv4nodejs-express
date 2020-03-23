const socketIO = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode, getImage } = require("../common/index");

const getImages = () => {
  const img = getImage(path.join(__dirname, "../data/apple.jpg"));
  const copy = img.copy();
  const gray = img.cvtColor(cv.COLOR_BGR2GRAY);
  const grayThresh = gray.threshold(120, 255, cv.THRESH_BINARY);
  const contours = grayThresh.findContours(
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );

  const blueColor = new cv.Vec(204, 0, 0);

  const sortedContours = contours.sort((c0, c1) => c1.area - c0.area);
  const imgContours = sortedContours.map(contour => contour.getPoints());

  copy.drawContours(imgContours, -1, blueColor, { thickness: 2 });

  return { copy, img };
};

const stream = server => {
  const io = socketIO(server);
  const { copy, img } = getImages();

  const copyImage = getImencode(copy);
  const originalImage = getImencode(img);

  io.on("connection", socket => {
    socket.emit("new-frame", { original: originalImage });
    socket.emit("new-frame", { copyImage: copyImage });

    socket.on("disconnect", function() {
      copy.release();
      img.release();
    });
  });
};

module.exports = stream;
