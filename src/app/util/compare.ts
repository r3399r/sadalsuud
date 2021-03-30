export const compareNumber = (sortedKey: string) => (a: object, b: object) =>
  Number(a[sortedKey]) - Number(b[sortedKey]);
