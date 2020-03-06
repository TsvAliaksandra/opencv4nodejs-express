const { Router } = require('express');

const router = Router();

router.get('/detect-contours', (req, res) => {
  res.render('index', { title: 'Detect contours of objects' });
});

module.exports = router;
