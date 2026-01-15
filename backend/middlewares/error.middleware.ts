import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal server error" });
};
