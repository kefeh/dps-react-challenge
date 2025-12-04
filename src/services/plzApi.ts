// Types based on OpenPLZ API response
export interface LocalityInfo {
  name: string;
  postalCode: string;
}

const BASE_URL = 'https://openplzapi.org/de/Localities';

export const fetchByLocality = async (name: string): Promise<LocalityInfo[]> => {
  if (!name) return [];
  // We fetch page 1 with a 10 page size to catch multiple PLZs
  const response = await fetch(`${BASE_URL}?name=${encodeURIComponent(name)}&page=1&pageSize=10`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

export const fetchByPlz = async (plz: string): Promise<LocalityInfo[]> => {
  const formattedPlz = formatPlzForSearch(plz);
  const response = await fetch(`${BASE_URL}?postalCode=${encodeURIComponent(formattedPlz)}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

const formatPlzForSearch = (plz: string): string => {
  return (plz.length < 5) ? "^" + plz : plz;
};
