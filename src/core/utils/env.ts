export default (variable: string, defaultValue: any = ""): any => {
  const v = process.env[variable] || defaultValue || "";
  return v;
};
