var express = require('express');
var router =  express.Router();


/* /user/ */
router.get('/', (req, res) => {
  res.send('lemmons')
})

/* /user/:id */
router.get('/:id', (req, res) => {
  res.send('elmos')
})

module.exports = router;
