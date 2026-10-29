/** Slovak noun form for a count: 1 → one, 2–4 → few, anything else → many (1 nový, 3 nové, 5 nových). */
export function plural(n: number, one: string, few: string, many: string): string {
  return n === 1 ? one : n >= 2 && n <= 4 ? few : many;
}
