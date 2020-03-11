const socketIO = require("socket.io");
const cv = require("opencv4nodejs");

const getFilter2D = () => {
  const rows = 3;
  const cols = 3;
  const shape = cv.MORPH_CROSS;
  const kernelSize = new cv.Size(cols, rows);

  const kernel = cv.getStructuringElement(shape, kernelSize);

  const img = cv.imread("./apple.jpg");
  const copy = img.copy();
  const filteredImg = copy.filter2D(-1, kernel);

  return { img, copy: filteredImg };
};

const getBlur = () => {
  const img = cv.imread("./apple.jpg");
  const copy = img.copy();

  const bluredImg = copy.blur(new cv.Size(5, 5));

  return { img, copy: bluredImg };
};

const getDilateAndErodeImgs = () => {
  const img = cv.imread("./kubick.png");
  const copy = img.copy();
  const point = new cv.Point(-1, -1);

  const dilatedImg = copy.dilate(new cv.Mat(), point, 4, cv.BORDER_CONSTANT);
  const erodedImg = copy.erode(new cv.Mat(), point, 4, cv.BORDER_CONSTANT);

  return { dilatedImg, erodedImg };
};

const getMorphologyEx = (morphType1, morphType2) => {
  const rows = 4;
  const cols = 4;
  const kernelSize = new cv.Size(cols, rows);

  const img = cv.imread("./kubick.png");
  const copy = img.copy();

  const kernel1 = cv.getStructuringElement(cv.MORPH_RECT, kernelSize);
  const kernel2 = cv.getStructuringElement(cv.MORPH_RECT, kernelSize);

  const point = new cv.Point(-1, -1);

  const morphologyEx1 = copy.morphologyEx(
    kernel1,
    morphType1,
    point,
    1,
    cv.BORDER_CONSTANT
  );
  const morphologyEx2 = copy.morphologyEx(
    kernel2,
    morphType2,
    point,
    1,
    cv.BORDER_CONSTANT
  );

  return { morphologyEx1, morphologyEx2 };
};

const getSobel = () => {
  const img = cv.imread("./kubick.png");
  const copy = img.copy();

  const gausianBlur = copy.gaussianBlur(
    new cv.Size(3, 3),
    0,
    0,
    cv.BORDER_DEFAULT
  );
  const grayImg = gausianBlur.cvtColor(cv.COLOR_RGB2GRAY);
  const xGrad = grayImg.sobel(cv.CV_16S, 1, 0);
  const yGrad = grayImg.sobel(cv.CV_16S, 0, 1);

  const xGradAbs = xGrad.convertScaleAbs();
  const yGradAbs = yGrad.convertScaleAbs();

  // const gradX = xGradAbs.addWeighted(0.5, xGradAbs, 0.5, 0);
  // const gradY = yGradAbs.addWeighted(0.5, yGradAbs, 0.5, 0);

  return { xGradAbs, yGradAbs };
};

const getLaplasian = () => {
  const img = cv.imread("./apple.jpg");
  const copy = img.copy();

  const gausianBlur = copy.gaussianBlur(
    new cv.Size(3, 3),
    0,
    0,
    cv.BORDER_DEFAULT
  );
  const grayImg = gausianBlur.cvtColor(cv.COLOR_RGB2GRAY);
  const laplasianImg = grayImg.laplacian(cv.CV_16S);
  const laplacianImgAbs = laplasianImg.convertScaleAbs();

  return { img, copy: laplacianImgAbs };
};

const getCanny = () => {
  const lowThreshold = 70;
  const uppThreshold = 260;
  const img = cv.imread("./kubick.png");
  const copy = img.copy();

  const blurImg = copy.blur(new cv.Size(3, 3));
  const grayImg = blurImg.cvtColor(cv.COLOR_RGB2GRAY);
  const edgesImg = grayImg.canny(lowThreshold, uppThreshold);

  return { copy: edgesImg, img };
};

const getHistogram = () => {
  const img = cv.imread("./javascript.jpg");
  const copy = img.copy();
  const kBins = 256;
  const histWidth = 512;
  const histHeight = 400;

  const binWidth = Number.parseFloat(histWidth / kBins);
  const colors = [
    new cv.Vec(255, 0, 0),
    new cv.Vec(0, 255, 0),
    new cv.Vec(0, 0, 255)
  ];

  const getHistAxis = channel => [
    {
      channel,
      bins: kBins,
      ranges: [0, 256]
    }
  ];

  const bHist = cv.calcHist(copy, getHistAxis(0));
  const gHist = cv.calcHist(copy, getHistAxis(1));
  const rHist = cv.calcHist(copy, getHistAxis(2));

  const histImg = new cv.Mat(
    histHeight,
    histWidth,
    cv.CV_8UC3,
    new cv.Vec(0, 0, 0)
  );

  const bHistNorm = bHist.normalize(
    0,
    histImg.rows,
    cv.NORM_MINMAX,
    -1,
    new cv.Mat()
  );
  const gHistNorm = gHist.normalize(
    0,
    histImg.rows,
    cv.NORM_MINMAX,
    -1,
    new cv.Mat()
  );
  const rHistNorm = rHist.normalize(
    0,
    histImg.rows,
    cv.NORM_MINMAX,
    -1,
    new cv.Mat()
  );

  for (let i = 1; i < kBins; i++) {
    histImg.drawLine(
      new cv.Point2(
        binWidth * (i - 1),
        histHeight - Number.parseFloat(bHistNorm.at(i - 1))
      ),
      new cv.Point2(
        binWidth * i,
        histHeight - Number.parseFloat(bHistNorm.at(i))
      ),
      colors[0],
      2,
      8,
      0
    );
    histImg.drawLine(
      new cv.Point2(
        binWidth * (i - 1),
        histHeight - Number.parseFloat(gHistNorm.at(i - 1))
      ),
      new cv.Point2(
        binWidth * i,
        histHeight - Number.parseFloat(gHistNorm.at(i))
      ),
      colors[1],
      2,
      8,
      0
    );
    histImg.drawLine(
      new cv.Point2(
        binWidth * (i - 1),
        histHeight - Number.parseFloat(rHistNorm.at(i - 1))
      ),
      new cv.Point2(
        binWidth * i,
        histHeight - Number.parseFloat(rHistNorm.at(i))
      ),
      colors[2],
      2,
      8,
      0
    );
  }

  // cv.plot1DHist(bHist, plot, colors[0], 2);
  // cv.plot1DHist(gHist, plot, colors[1], 2);
  // cv.plot1DHist(rHist, plot, colors[2], 2);

  // const bHist = cv.calcHist(bgrChannels[0],)
  // cv.imshow("histogram", img);

  return { copy: histImg, img };
};

const getEqualizedHistogram = () => {
  const img = cv.imread("./javascript.jpg");
  const copy = img.copy();

  const grayImg = copy.cvtColor(cv.COLOR_RGB2GRAY);
  const equalizedImg = grayImg.equalizeHist();

  return { copy: equalizedImg, img: grayImg };
};

const stream = server => {
  const io = socketIO(server);
  // const { copy, img } = getFilter2D();
  // const { copy, img } = getBlur();
  // const { dilatedImg: copy, erodedImg: img } = getDilateAndErodeImgs();
  // const { morphologyEx1: copy, morphologyEx2: img } = getMorphologyEx(
  //   cv.MORPH_OPEN,
  //   cv.MORPH_CLOSE
  // );
  // const { morphologyEx1: copy, morphologyEx2: img } = getMorphologyEx(
  //   cv.MORPH_GRADIENT,
  //   cv.MORPH_TOPHAT
  // );
  // const { morphologyEx1: copy, morphologyEx2: img } = getMorphologyEx(
  //   cv.MORPH_BLACKHAT
  // );

  // const { xGradAbs: copy, yGradAbs: img } = getSobel();
  // const { copy, img } = getLaplasian();
  // const { copy, img } = getCanny();
  // const { copy, img } = getHistogram();
  const { copy, img } = getEqualizedHistogram();

  const copyImage = cv.imencode(".jpg", copy).toString("base64");
  const originalImage = cv.imencode(".jpg", img).toString("base64");

  io.on("connection", socket => {
    socket.emit("new-frame", { copyImage: copyImage });
    socket.emit("new-frame", { original: originalImage });

    socket.on("disconnect", function() {
      copy.release();
      img.release();
    });
  });
};

module.exports = stream;
