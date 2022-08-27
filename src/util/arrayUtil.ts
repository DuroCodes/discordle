export const fillArr = <T>(arr: T[], length: number, fill: T) => [
  ...arr,
  ...Array.from({ length: length - arr.length }).fill(fill),
];

export const splitArr = <T>(arr: T[]) => {
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return [...left, '\n', ...right];
};
