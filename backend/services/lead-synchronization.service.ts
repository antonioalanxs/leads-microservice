import path from "path";

import { LeadModel } from "../models/lead.model";

export class LeadSynchronizationService {
  private static prefix = `[${path.basename(__filename)}]`;
  private static EXTERNAL_API_URI = "https://randomuser.me/api";
  private static NUMBER = 10;

  static async synchronize() {
    console.log(`${this.prefix} Running lead synchronization...`);

    const response = await fetch(
      `${this.EXTERNAL_API_URI}?results=${this.NUMBER}`,
    );

    if (!response.ok) {
      console.error(`${this.prefix} ${response}`);
      return;
    }

    const { results: leads } = await response.json();

    for (const lead of leads) {
      if (await LeadModel.findById(lead.login?.uuid)) {
        console.warn(
          `${this.prefix} A lead with identifier '${lead.login?.uuid}' already exists. Skipping...`,
        );
        continue;
      }
      if (await LeadModel.findByEmail(lead?.email)) {
        console.warn(
          `${this.prefix}  A lead with email '${lead?.email}' already exists. Skipping...`,
        );
        continue;
      }
      try {
        await LeadModel.create({
          externalId: lead?.login?.uuid,
          firstName: lead?.name?.first,
          lastName: lead?.name?.last,
          email: lead?.email,
          phone: lead?.phone,
          cell: lead?.cell,
          dob: lead?.dob?.date,
          city: lead?.location?.city,
          state: lead?.location?.state,
          country: lead?.location?.country,
          picture: lead?.picture?.large,
        });
      } catch (error: unknown) {
        console.error(`${this.prefix} ${error}`);
        continue;
      }
    }

    console.log(
      `${this.prefix} Synchronized ${leads.length} leads from '${this.EXTERNAL_API_URI}' successfully`,
    );
  }
}
