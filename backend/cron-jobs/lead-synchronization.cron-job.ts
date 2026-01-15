import cron from "node-cron";

import { LeadSynchronizationService } from "../services/lead-synchronization.service";

cron.schedule("*/2 * * * *", async () => {
  await LeadSynchronizationService.synchronize();
});
