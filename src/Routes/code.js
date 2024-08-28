const { compileCode } = require('../Controllers/code');

const router = require('express').Router();

router.post('/compile', compileCode);

module.exports = router;
