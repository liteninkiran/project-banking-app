export function toCamelCase(str: string): string {
  return str
    .trim() // remove leading/trailing spaces
    .toLowerCase() // lowercase everything first
    .split(/\s+/) // split by spaces (or any whitespace)
    .map(
      (word, index) =>
        index === 0
          ? word // first word stays lowercase
          : word.charAt(0).toUpperCase() + word.slice(1), // capitalize first letter
    )
    .join('');
}
