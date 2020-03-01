const express = require('express');
const router = express.Router();

// @route GET api/posts
// @dex   Register user
// @access Public
router.post('/', (req, res) => {
    console.log(req.body);
    
})


module.exports = router;