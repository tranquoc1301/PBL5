const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const {admin, initializeFirebaseAdmin} = require('./config/firebase')

const app = express();

app.use(express.json());
initializeFirebaseAdmin();
app.use(cors());
app.use(routes);

module.exports = app;