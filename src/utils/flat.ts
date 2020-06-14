export default function flat(arr: any[], depth: number = 0): any[] {
  let arrFlat = [];
  for (let item of arr) {
    if (Array.isArray(item) && depth > 1) {
      item = flat(item, depth - 1);
    }
    arrFlat = arrFlat.concat(item) as any[];
  }
  return arrFlat;
}
