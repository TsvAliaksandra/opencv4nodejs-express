const cv = require('opencv4nodejs');

const getImencode = img => cv.imencode(".jpg", img).toString("base64");

const getImage = img => cv.imread(img);

module.exports = {
  getImencode,
  getImage,
};
