function generateCharacterSets(sets: string[]) {
  return sets.map(generateCharacterSet).join("");
}
export function generateArray<T>(
  length: number,
  generator: (index: number) => T
): T[] {
  return Array.from({ length: length }, (_, index) => generator(index));
}
function generateCharacterSet(range: string) {
  console.assert(range.length === 2, "range must be a string of length 2");
  const startCode = range.charCodeAt(0);
  const endCode = range.charCodeAt(1);
  return generateArray(endCode - startCode + 1, (index) =>
    String.fromCharCode(startCode + index)
  ).join("");
}
export const CharacterSets = (() => {
  const Lowercase = generateCharacterSet("az");
  const Uppercase = generateCharacterSet("AZ");
  const Digits = generateCharacterSet("09");
  const Symbols = generateCharacterSets(["!/", ":@", "[`", "{~"]);
  const Basic = Lowercase + Uppercase + Digits + "_";
  const All = generateCharacterSet(" ~");
  const CharacterSets = {
    All,
    Basic,
    Lowercase,
    Uppercase,
    Digits,
    Symbols,
  };
  for (const [name, set] of Object.entries(CharacterSets)) {
    if (set.length !== new Set(set).size) {
      throw new Error(`character set "${name}" contains duplicate characters`);
    }
  }
  return CharacterSets;
})();
