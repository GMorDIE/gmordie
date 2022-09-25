export const getCalamarSearchUrl = (search: string) =>
  `https://calamar.app/gmordie/search?query=${encodeURIComponent(search)}`;
