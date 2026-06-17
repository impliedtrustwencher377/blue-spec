const EMAIL = /^([a-zA-Z0-9]+)+@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/;

export const isValidEmail = (input) => EMAIL.test(input);

const DURATION_LOOSE = /^(\d+\s*[a-z]+\s*)+$/i;

export const isDuration = (input) => DURATION_LOOSE.test(input);

const UNIT_MS = { ms: 1, s: 1000, m: 60000, h: 3600000, d: 86400000 };

export const parseDuration = (input) => {
  if (typeof input !== 'string' || input.length > 64) return null;
  let total = 0;
  let matched = false;
  const pattern = /(\d{1,9})(ms|s|m|h|d)/g;
  let match;
  while ((match = pattern.exec(input)) !== null) {
    matched = true;
    total += Number(match[1]) * UNIT_MS[match[2]];
  }
  return matched ? total : null;
};
