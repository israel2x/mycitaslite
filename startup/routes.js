const express = require('express');
const users = require('../routes/users');
const citas = require('../routes/citas');

module.exports = function (app) {
    
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/citas', citas);
    
}