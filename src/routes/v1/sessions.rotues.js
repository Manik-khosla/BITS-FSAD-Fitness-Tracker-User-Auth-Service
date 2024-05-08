const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionsController = require('../../controllers/v1/sessions.controllers');
const signUpValidator = require('../../middlewares/validators/sessions/signUp.validator');
const signInValidator = require('../../middlewares/validators/sessions/signIn.validator');

router.get('/', passport.authenticate('jwt', { session: false }), sessionsController.show);
router.post('/sign_up', signUpValidator.validationRules(), signUpValidator.validate, sessionsController.signUp);
router.post('/sign_in', signInValidator.validationRules(), signInValidator.validate, sessionsController.signIn);
router.get('/refresh_token', sessionsController.refreshToken);
router.delete('/sign_out', passport.authenticate('jwt', { session: false }), sessionsController.signOut);

module.exports = router;