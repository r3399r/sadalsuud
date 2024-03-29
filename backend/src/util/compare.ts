export const compareKey =
  <T extends Object>(sortedKey: Extract<keyof T, string>, reverse?: boolean) =>
  (a: { [key: string]: any }, b: { [key: string]: any }) => {
    if (reverse) return a[sortedKey] > b[sortedKey] ? -1 : 1;
    else return a[sortedKey] > b[sortedKey] ? 1 : -1;
  };
