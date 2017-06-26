export function isEmptyObject(obj: any): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isNonEmptyArray(arr: any[]): boolean {
  return typeof arr !== "undefined" && arr.length > 0;
}

export function log({ ...args }) {
  console.log(args);
}

export function pad(
  s: string,
  c: string,
  len: number,
  right: boolean = true
): string {
  while (s.length < len) {
    if (right) {
      s = c + s;
    } else {
      s = s + c;
    }
  }
  return s;
}

/* 
  precondition: values are sorted
*/
export function median(values: number[]) {
  let lowMiddle = Math.floor((values.length - 1) / 2);
  let highMiddle = Math.ceil((values.length - 1) / 2);
  return (values[lowMiddle] + values[highMiddle]) / 2;
}

export function mean(values: number[]) {
  let count = values.length;
  if (count === 0) {
    return;
  }

  let sum = values.reduce((acc, cur) => (acc += cur), 0);
  return sum / count;
}
