import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { SupabaseClient } from "../configuration/supabase";

export async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authenticationHeader = req.headers.authorization;

  if (!authenticationHeader?.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authorization header missing or malformed" });
  }

  const token = authenticationHeader.replace("Bearer ", "");

  const { data, error } =
    await SupabaseClient.getInstance().auth.getUser(token);

  if (error || !data.user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid token" });
  }

  req.user = data.user;
  next();
}
