import { Lead } from "@prisma/client";

import { PrismaClient } from "../configuration/prisma/client";
import { RedisClient } from "../configuration/redis";
import { CreateLeadDTOType, UpdateLeadDTOType } from "../schemas/lead.schemas";
import { Optional } from "../types/optional.type";

export class LeadModel {
  static async create(data: CreateLeadDTOType): Promise<Lead> {
    return await PrismaClient.getInstance().lead.create({
      data,
    });
  }

  static async findById(id: string): Promise<Optional<Lead>> {
    let lead = await RedisClient.get<Lead>(id);

    if (lead) {
      console.log(`Lead with identifier '${id}' found in cache`);
      return lead;
    }

    lead = await PrismaClient.getInstance().lead.findFirst({
      where: { OR: [{ id }, { externalId: id }] },
    });

    if (lead) await RedisClient.set(id, lead);

    return lead;
  }

  static async findByEmail(email: string): Promise<Optional<Lead>> {
    return await PrismaClient.getInstance().lead.findFirst({
      where: { email },
    });
  }

  static async findAll(): Promise<Lead[]> {
    return await PrismaClient.getInstance().lead.findMany();
  }

  static async update(lead: Lead, data: UpdateLeadDTOType): Promise<Lead> {
    lead = { ...lead, ...data };
    await RedisClient.setValueIfKeyExists(lead.id, lead);
    return await PrismaClient.getInstance().lead.update({
      where: { id: lead.id },
      data: lead,
    });
  }
}
