// eslint-disable-next-line import/no-unresolved
import { stripHtml } from "string-strip-html";

export function sanitizeString(string) {
  const { result: sanitizedString } = stripHtml(string.trim());

  return sanitizedString;
}

export const sanitizeData = (req, res, next) => {
  const data = req.body;
  const output = { ...data };
  for (const param in data) {
    if (typeof output[param] === "string") {
      output[param] = stripHtml(data[param]).result.trim();
    }
  }
  res.locals.sanitizedData = output;
  next();
};
