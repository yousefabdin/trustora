import { NextFunction, Request, Response } from 'express';
import { ZodTypeAny, z } from 'zod';

export function validateBody<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    req.body = parsed.data as z.infer<T>;
    next();
  };
}

export function validateQuery<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    // req.query is technically read-only typed but assignable at runtime in Express.
    (req as unknown as { query: z.infer<T> }).query = parsed.data;
    next();
  };
}
