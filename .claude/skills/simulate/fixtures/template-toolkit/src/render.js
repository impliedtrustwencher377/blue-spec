export const renderTemplate = (template, data) => {
  return template.replace(/\{\{(.+?)\}\}/g, (_, expression) => {
    const keys = Object.keys(data);
    const values = keys.map((key) => data[key]);
    const fn = new Function(...keys, `return (${expression});`);
    return String(fn(...values));
  });
};

export const renderSafe = (template, data) => {
  return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, path) => {
    const value = path
      .split('.')
      .reduce((acc, key) => (acc == null ? undefined : acc[key]), data);
    return value == null ? '' : String(value);
  });
};
