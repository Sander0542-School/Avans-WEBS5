require('dotenv').config();
const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('opossum');

const router = new express.Router();

const options = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 3000
};

let serviceAddress = null;

router.post('targets', (req, res) => {

});

module.exports = router;
