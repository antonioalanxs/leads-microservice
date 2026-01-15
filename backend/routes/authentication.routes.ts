import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { SignupDTO, LoginDTO } from "../schemas/authentication.schemas";
import { AuthenticationController } from "../controllers/authentication.controller";

export const authenticationRouter = Router();

authenticationRouter.post(
  "/signup",
  validate(SignupDTO),
  AuthenticationController.signUp,
);
authenticationRouter.post(
  "/login",
  validate(LoginDTO),
  AuthenticationController.logIn,
);
