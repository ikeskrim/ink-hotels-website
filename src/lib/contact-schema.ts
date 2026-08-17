import { z } from "zod";

/**
 * Shared by the form and the route, so both agree on what a valid message is.
 *
 * The messages are stable CODES, not sentences. The server needs a schema it
 * can validate against without knowing which of five languages the sender was
 * reading, and the browser needs to show the complaint in that language — so
 * the schema emits a key and the form looks it up. Putting English prose here
 * would have meant a Greek visitor being told "Please tell us your first name"
 * in the middle of a Greek page.
 */
export const ERRORS = {
  firstName: "errFirstName",
  lastName: "errLastName",
  email: "errEmail",
  emailRequired: "errEmailRequired",
  message: "errMessage",
  tooLong: "errTooLong",
} as const;

export type ErrorCode = (typeof ERRORS)[keyof typeof ERRORS];

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, ERRORS.firstName)
    .max(80, ERRORS.tooLong),
  lastName: z
    .string()
    .trim()
    .min(1, ERRORS.lastName)
    .max(80, ERRORS.tooLong),
  email: z
    .string()
    .trim()
    .min(1, ERRORS.emailRequired)
    .email(ERRORS.email),
  message: z
    .string()
    .trim()
    .min(10, ERRORS.message)
    .max(4000, ERRORS.tooLong),
  /* Honeypot: a real person never fills a field they cannot see. */
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
