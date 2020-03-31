export function mapToString(map: Map<string, string>): string {
  if (map.size === 0) {
    return '{}';
  }

  let str = '{';
  const items = [];

  map.forEach((value, key) => {
    items.push(`${key}=${value}`);
  });

  str += items.join(', ');
  str += '}';

  return str;
}