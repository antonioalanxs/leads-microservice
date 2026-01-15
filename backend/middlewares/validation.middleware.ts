import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { StatusCodes } from "http-status-codes";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const errors = result.error.issues.reduce(
        (accumulator, issue) => {
          const field = issue.path.join(".");
          if (!accumulator[field]) {
            accumulator[field] = issue.message;
          }
          return accumulator;
        },
        {} as Record<string, string>,
      );
      return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    }
  };
