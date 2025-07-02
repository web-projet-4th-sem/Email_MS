const express = require('express');
const app = express();
const adminRoutes = require('./routes/admin');

app.use('/api/admin', adminRoutes);

// ...existing code...

module.exports = app;