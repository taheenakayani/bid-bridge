const { body } = require("express-validator");

const validateAddJobData = [
  body("title").notEmpty().withMessage("job title is required"),
  body("type").notEmpty().withMessage("job type is required"),
  body("category").notEmpty().withMessage("job category is required"),
  body("location").notEmpty().withMessage("job location is required"),
  body("salary").optional(),
  body("tags")
    .isString()
    .withMessage("Invalid tags, tags value must be string"),
  body("description").isString(),
];

const validateUpdateJobData = [
  body("title").optional().notEmpty().withMessage("job title is required"),
  body("type").optional().notEmpty().withMessage("job type is required"),
  body("category")
    .optional()
    .notEmpty()
    .withMessage("job category is required"),
  body("location")
    .optional()
    .notEmpty()
    .withMessage("job location is required"),
  body("salary").optional().optional(),
  body("tags")
    .optional()
    .isString()
    .withMessage("Invalid tags, tags value must be string"),
  body("description").optional().isString(),
];

module.exports = { validateAddJobData, validateUpdateJobData };
