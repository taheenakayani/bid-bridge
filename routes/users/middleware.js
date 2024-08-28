const { body } = require('express-validator');

const validateRegisterUserData = [
    body('name').notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isString().withMessage('Invalid role'),
  ];

  const validateLoginUserData = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
  ];

  module.exports = {validateRegisterUserData, validateLoginUserData};