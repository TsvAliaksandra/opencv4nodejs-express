const { Router } = require('express');
const DetectContours = require('./detectContours');

const router = Router();

router.use('/detect-contours', DetectContours);

module.exports = router;
