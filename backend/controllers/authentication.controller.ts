import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { SupabaseClient } from "../configuration/supabase";
import { UserModel } from "../models/user.model";

export class AuthenticationController {
  static async signUp(req: Request, res: Response) {
    const { email, password } = req.body;

    if (await UserModel.findByEmail(email)) {
      res.status(StatusCodes.CONFLICT).json({
        error: "Email is already taken",
      });
      return;
    }

    await UserModel.create({ email, password });

    res.status(StatusCodes.CREATED).json({
      email,
    });
  }

  static async logIn(req: Request, res: Response) {
    const { email, password } = req.body;

    const { data, error } = await SupabaseClient.getInstance().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: error.message,
      });
      return;
    }
    res
      .status(StatusCodes.OK)
      .json({ access_token: data.session?.access_token });
  }
}
