const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const redisClient = require('../../config/redis');
const { User } = require('../models/user');


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.passReqToCallback = true;

passport.use(new JwtStrategy(opts, async function(req, jwt_payload, done) {
  const accessToken = req.headers.authorization.split(' ')[1];

  const loggedOutAccessToken = await redisClient.get(`logged_out:${accessToken}`);
  if(loggedOutAccessToken) return done(null, null);

  const user = await User.findById(jwt_payload.id);
  if(user) return done(null, user);

  return done(null, null);
}));
