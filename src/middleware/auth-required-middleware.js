import { AuthenticationError } from '../lib/errors.js';

export default async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      res.status(401).json({ error: error.message });
    } else {
      throw error;
    }
  }
};
