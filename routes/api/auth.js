const express = require('express');
const router = express.Router();

// @route GET api/auth
// @dex   Text routes
// @access Public
router.get('/', (req, res) => {
    res.send('AUTH route');
})


module.exports = router;