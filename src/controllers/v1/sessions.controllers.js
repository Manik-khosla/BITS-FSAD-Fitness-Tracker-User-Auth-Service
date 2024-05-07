const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');
const ms = require('ms');
const redisClient = require('../../../config/redis');
const { RefreshToken } = require('../../models/refresh_token');

const signUp = async (req, res) => {
  try {
    const userWithEmail = await User.findOne({ email: req.body.user.email });
    if(userWithEmail) return res.status(400).json({error: 'Email already in use'});

    const user = new User(req.body.user);
    await user.save();

    return res.status(201).send({
      user: user.toJSON()
    });
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.params;
    const user = await User.findOne({ email: email });

    if(!user) return res.status(401).json({error: 'Invalid credentials'});
    if(!await bcrypt.compare(password, user.password)) return res.status(401).json({error: 'Invalid credentials'});

    const { accessToken, refreshToken } = await user.generateAccessAndRefreshTokens();

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN) });

    return res.status(200).json({ access_token: accessToken });
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
};

const refreshToken = async (req, res) => {
  try {
    if(!req.cookies.jwt) return res.sendStatus(401);
    const refreshToken = req.cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const user = (await RefreshToken.findOne({
      token: refreshToken
    }).populate('user_id')).user_id;

    if(!user) return res.sendStatus(401);

    const { accessToken, newRefreshToken } = await user.generateAccessAndRefreshTokens();

    res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN) });

    return res.status(200).json({ access_token: accessToken });
  } catch(error) {
    return res.status(500).json({error: error.message}); 
  }
};

const signOut = async (req, res) => {
  try {
    if(!req.cookies.jwt) return res.status(400).json({error: 'No refresh token provided'});
    
    const accessToken = req.headers.authorization.split(' ')[1];
    await redisClient.set(`logged_out:${accessToken}`, 'true');

    await RefreshToken.deleteMany({ token: req.cookies.jwt });
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    return res.status(200).json({message: 'Signed out successfully'});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
};

module.exports = { signUp, signIn, refreshToken, signOut };