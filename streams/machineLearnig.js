const socketIO = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode, getImage } = require("../common/index");

const f = sample => {
  return (
    (sample.at(0) < 0.5 && sample.at(1) < 0.5) ||
    (sample.at(0) > 0.5 && sample.at(1) > 0.5)
  );
};

const trainSVM = () => {
  const d = 2;
  // объем генерируемой выборки
  const n = 2000;
  // объем обучающей части выборки
  const n1 = 1000;

  // матрица признаковых описаний объектов
  const samples = new cv.Mat(n, d, cv, cv.CV_32F);
  // номера классов (матрица значений целевой переменной)
  const labels = new cv.Mat(n, 1, cv.CV_32S);

  let trainSampleMask = [];
  const a = new cv.Mat(1, n1, cv.CV_32S);
  console.log(a.at(1));

  // for (let i = 0; i < n1; ++i) {

  // }
};

const trainDTree = () => {};
const trainRTrees = () => {};
const trainGBTrees = () => {};

const stream = server => {
  trainSVM();
  cv.feat
  // const io = socketIO(server);
  // const { copy, img } = getImages();
  // const copyImage = getImencode(copy);
  // const originalImage = getImencode(img);
  // io.on("connection", socket => {
  //   socket.emit("new-frame", { original: originalImage });
  //   socket.emit("new-frame", { copyImage: copyImage });
  //   socket.on("disconnect", function() {
  //     copy.release();
  //     img.release();
  //   });
  // });
};

module.exports = stream;
