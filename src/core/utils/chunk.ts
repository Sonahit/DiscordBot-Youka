export default function chunk(arr: any[], chunkSize: number): any[] {
  const chunks = [] as any[];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.concat(arr.slice(i, i + chunkSize));
  }
  return chunks;
}
