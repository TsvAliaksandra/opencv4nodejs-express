const socketIO = require("socket.io");
const cv = require("opencv4nodejs");
const path = require("path");
const { getImencode, getImage } = require("../common/index");

const f = sample => {
  return (
    Number(sample[0] < 0.5 && sample[1] < 0.5) ||
    Number(sample[0] > 0.5 && sample[1] > 0.5)
  );
};

const trainSVM = () => {
  const d = 2;
  // объем генерируемой выборки
  const n = 2000;
  // объем обучающей части выборки
  const n1 = 1000;

  let randSamples = [];

  for (let i = 0; i < n; ++i) {
    randSamples.push(Array.from({ length: d }, () => Math.random() * 1));
  }

  // матрица признаковых описаний объектов
  const samples = new cv.Mat(randSamples, cv.CV_32F);
  let labelsCols = [];

  for (let i = 0; i < n; ++i) {
    labelsCols[i] = f(samples.row(i));
  }

  // номера классов (матрица значений целевой переменной)
  const labels = new cv.Mat([labelsCols], cv.CV_32S);

  const sampleMask = [...Array.from({ length: n1 }).keys()];
  const trainedSamleMask = new cv.Mat([sampleMask], cv.CV_32S);

  const trainData = new cv.TrainData(
    samples,
    cv.ml.ROW_SAMPLE,
    labels,
    new cv.Mat(),
    trainedSamleMask
  );
  const svm = new cv.SVM({
    c: 1,
    gamma: 1,
    kernelType: cv.ml.SVM.RBF
  });

  svm.train(trainData);
  svm.save("model.yml", "simpleSVMModel");

  const predictions = svm.predict(samples);
  // const predictions = svm.predict(samples);

  let trainError = [];

  // for (let i = 0; i < n1; ++i) {
  //   // trainError += labels.at(i) !== predictions[i];
  // }
};

const trainDTree = () => {};
const trainRTrees = () => {};
const trainGBTrees = () => {};

const stream = server => {
  trainSVM();
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
