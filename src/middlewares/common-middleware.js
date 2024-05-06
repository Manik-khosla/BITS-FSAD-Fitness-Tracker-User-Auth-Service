const express = require('express'),
      cookieParser = require('cookie-parser'),
      hpp = require('hpp'),
      helmet = require('helmet'),
      passport = require('passport'),
      cors = require('cors');

module.exports = [
  express.json({}),
  cookieParser(),
  hpp(),
  cors({
    origin: true,
    credentials: true,
  }),
  helmet({
    contentSecurityPolicy: false,
  }),
  passport.initialize(),
];
