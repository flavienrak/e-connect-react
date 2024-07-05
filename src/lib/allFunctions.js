export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === NaN ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value?.trim().length === 0)
  );
}

export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export function isValidNumber(value) {
  return !isNaN(value) && isFinite(value);
}
