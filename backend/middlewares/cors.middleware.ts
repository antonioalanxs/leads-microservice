import cors from "cors";

import { ENVIRONMENT } from "../configuration/environment";

export const corsMiddleware = ({
  acceptedOrigins = ENVIRONMENT.CORS_ACCEPTED_ORIGINS,
}: {
  acceptedOrigins?: string[];
} = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin '${origin}' not allowed by CORS`));
    },
  });
};
