export default (variable: string, defaultValue: string = ""): string => {
  const v = process.env[variable] || defaultValue || "";
  return v;
};
