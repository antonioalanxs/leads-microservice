import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { validate } from "../middlewares/validation.middleware";
import { CreateLeadDTO } from "../schemas/lead.schemas";
import { LeadController } from "../controllers/lead.controller";

export const leadRouter = Router();

leadRouter.post(
  "/",
  authenticationMiddleware,
  validate(CreateLeadDTO),
  LeadController.create,
);
leadRouter.get("/", authenticationMiddleware, LeadController.findAll);
leadRouter.get("/:id", authenticationMiddleware, LeadController.findById);
leadRouter.post(
  "/:id/summary",
  authenticationMiddleware,
  LeadController.summarize,
);
