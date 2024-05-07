const { body, validationResult, matchedData } = require('express-validator');

const validationRules = () => {
  return [
    body('email')
      .trim()
      .exists({ checkNull: true, checkFalsy: true }).withMessage('Email is required')
      .bail()
      .isEmail().withMessage('Email must be a valid email address'),
    body('password')
      .trim()
      .exists({ checkNull: true, checkFalsy: true }).withMessage('Password is required')
  ];
};

const validate = (req, res, next) => {
  const validationErrors = validationResult(req);
  if(validationErrors.isEmpty()) {
    req.params = matchedData(req);
    return next();
  }

  const errors = {};

  validationErrors.array().map((error) => { errors[error.path] = error.msg; });

  return res.status(400).json({ errors });
};

module.exports = { validationRules, validate };