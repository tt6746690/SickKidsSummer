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
