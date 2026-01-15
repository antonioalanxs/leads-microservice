import { z } from "zod";

export const CreateLeadDTO = z.object({
  externalId: z.string().uuid().optional(),
  firstName: z
    .string()
    .min(1, "First name must be at least 1 character")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name must be at most 50 characters"),
  email: z
    .email("Email must be a valid email address")
    .max(100, "Email must be at most 100 characters"),
  phone: z
    .string()
    .min(7, "Phone must be at least 7 characters")
    .max(20, "Phone must be at most 20 characters")
    .optional(),
  cell: z
    .string()
    .min(7, "Cell must be at least 7 characters")
    .max(20, "Cell must be at most 20 characters")
    .optional(),
  dob: z
    .string()
    .min(4, "DOB must be at least 4 characters")
    .max(50, "DOB must be at most 50 characters")
    .optional(),
  city: z
    .string()
    .min(1, "City must be at least 1 character")
    .max(50, "City must be at most 50 characters")
    .optional(),
  state: z
    .string()
    .min(1, "State must be at least 1 character")
    .max(50, "State must be at most 50 characters")
    .optional(),
  country: z
    .string()
    .min(1, "Country must be at least 1 character")
    .max(50, "Country must be at most 50 characters")
    .optional(),
  picture: z
    .string()
    .url("Picture must be a valid URL")
    .max(255, "Picture URL must be at most 255 characters")
    .optional(),
});

export const UpdateLeadDTO = CreateLeadDTO.extend({
  summary: z
    .string()
    .max(1000, "Summary must be at most 1000 characters")
    .optional(),
  nextAction: z
    .string()
    .max(1000, "Next action must be at most 1000 characters")
    .optional(),
}).partial();

export type CreateLeadDTOType = z.infer<typeof CreateLeadDTO>;
export type UpdateLeadDTOType = z.infer<typeof UpdateLeadDTO>;
