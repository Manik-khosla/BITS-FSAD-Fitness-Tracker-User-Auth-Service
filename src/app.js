const http = require('http')
const cors = require('cors')
const express = require('express')
const app = express()

const server = http.createServer(app)

app.use(require('./middlewares/common-middleware'));

require('./middlewares/auth');
require('./routes/v1/index')(app)

module.exports = server;
