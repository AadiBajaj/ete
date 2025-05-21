import { body, param, validationResult } from 'express-validator';

export const validateComplaint = [
  body('userName').trim().notEmpty().withMessage('userName is required'),
  body('issue').trim().notEmpty().withMessage('issue is required'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('priority must be Low, Medium, or High'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
