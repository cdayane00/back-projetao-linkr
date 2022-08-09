// eslint-disable-next-line import/no-unresolved
import { stripHtml } from "string-strip-html";

export function sanitizeString(string) {
  const { result: sanitizedString } = stripHtml(string.trim());

  return sanitizedString;
}
