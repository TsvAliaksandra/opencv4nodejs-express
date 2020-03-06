const socketIO = require('socket.io');
const cv = require('opencv4nodejs');

const getImages = () => {
  const img = cv.imread('./apple.jpg');
  const copy = img.copy();
  const gray = img.cvtColor(cv.COLOR_BGR2GRAY);
  const grayThresh = gray.threshold(120, 255, cv.THRESH_BINARY);
  const contours = grayThresh.findContours(cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  const greenColor = new cv.Vec(0, 100, 0);

  const sortedContours = contours.sort((c0, c1) => c1.area - c0.area);
  const imgContours = sortedContours.map(contour => contour.getPoints());

  copy.drawContours(imgContours, -1, greenColor, { thickness: 2 });

  gray.release();
  grayThresh.release();

  return { copy, img };
};

const detectContours = server => {
  const io = socketIO(server);
  const { copy, img } = getImages();

  const copyImage = cv.imencode('.jpg', copy).toString('base64');
  const originalImage = cv.imencode('.jpg', img).toString('base64');

  io.on('connection', socket => {
    socket.emit('new-frame', { original: originalImage });
    socket.emit('new-frame', { copyImage: copyImage });

    socket.on('disconnect', function () {
      copy.release();
      img.release();
    });
  });
};

module.exports = detectContours;