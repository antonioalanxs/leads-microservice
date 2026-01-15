import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { LeadModel } from "../models/lead.model";
import { GroqClient } from "../configuration/groq";
import { PromptUtilities } from "../utilities/prompts";

export class LeadController {
  static async create(req: Request, res: Response) {
    if (await LeadModel.findById(req.body?.externalId)) {
      res.status(StatusCodes.CONFLICT).json({
        error: `A lead with identifier '${req.body?.externalId}' already exists`,
      });
      return;
    }

    if (await LeadModel.findByEmail(req.body?.email)) {
      res.status(StatusCodes.CONFLICT).json({
        error: `A lead with email '${req.body?.email}' already exists`,
      });
      return;
    }

    const lead = await LeadModel.create(req.body);
    res.status(StatusCodes.CREATED).json(lead);
  }

  static async findAll(_req: Request, res: Response) {
    const leads = await LeadModel.findAll();
    res.status(StatusCodes.OK).json(leads);
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params;

    const lead = await LeadModel.findById(id as string);

    if (lead) {
      res.status(StatusCodes.OK).json(lead);
      return;
    }

    res.status(StatusCodes.NOT_FOUND).json({
      error: `A lead with identifier '${id}' is not found`,
    });
  }

  static async summarize(req: Request, res: Response) {
    const { id } = req.params;

    let lead = await LeadModel.findById(id as string);

    if (!lead) {
      res.status(StatusCodes.NOT_FOUND).json({
        error: `A lead with identifier '${id}' is not found`,
      });
      return;
    }

    const prompt = PromptUtilities.load("lead-summary-next_action.txt", {
      name: `${lead?.firstName} ${lead?.lastName}`,
      email: lead?.email,
      phone: lead?.phone || lead?.cell,
      city: lead?.city,
      country: lead?.country,
    });
    const result = await GroqClient.getCompletion(prompt);

    if (!result) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        error: "Unable to generate the summary at the moment...",
      });
    } else {
      const { summary, next_action } = JSON.parse(result);
      const response = await LeadModel.update(lead, {
        summary,
        nextAction: next_action,
      });
      res.status(StatusCodes.OK).json(response);
    }
  }
}
