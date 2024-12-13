const express = require('express');

const router = express.Router();

router.get('/ping', (req, res) => {
    return res.send('pong');
});

router.get('/ping/:name', (req, res) => {
    return res.send(`pong ${req.params.name}`);
});

module.exports = router;