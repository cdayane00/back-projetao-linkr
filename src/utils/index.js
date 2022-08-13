// eslint-disable-next-line import/no-unresolved
import { stripHtml } from "string-strip-html";
import SqlString from "sqlstring";

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

export function findHashtagsInsideString(text) {
  const textWordsArray = text.split(" ").map((word) => word.trim());

  const hashtagsArray = textWordsArray
    .filter((word) => word.startsWith("#"))
    .map((word) => word.slice(1));

  return hashtagsArray;
}

export function validateHashtagsInsideText(text) {
  const textWordsArray = text.split(" ").map((word) => word);

  const checkString = (string) => {
    if (!string.startsWith("#")) {
      return string;
    }

    let lastChar = "";

    if (string.slice(-1).match(/[.,\/!?\;:]/g)) {
      lastChar = ` ${string.slice(-1)}`;
    }

    return (
      string.charAt(0) +
      string.slice(1).replace(/[.,\/!?$%\\^&\*;:{}@#=\`~()]/g, "") +
      lastChar
    );
  };

  const validatedWordsArray = textWordsArray.map(checkString);
  return validatedWordsArray.join(" ");
}

export function buildMultipleInsertsQuery(array, fixedValue = null) {
  let queryArray = [];

  if (fixedValue) {
    queryArray = [
      ...array.map(
        (element) =>
          `(${SqlString.escape(fixedValue)}, ${SqlString.escape(element)})`
      ),
    ];
  } else {
    queryArray = [...array.map((element) => `(${SqlString.escape(element)})`)];
  }

  return queryArray.join(", ");
}
