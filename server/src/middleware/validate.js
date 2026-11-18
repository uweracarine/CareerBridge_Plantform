import { AppError } from './errorHandler.js';

export const validate = (schema) => (req, res, next) => {
  if (!schema || !schema.safeParse) return next();

  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    const err = new AppError('Validation failed', 400);
    err.errors = errors;
    return next(err);
  }
  req.body = result.data;
  next();
};
