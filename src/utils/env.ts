export default (variable: string): string => {
  const v = process.env[variable] || "";
  return v;
};
