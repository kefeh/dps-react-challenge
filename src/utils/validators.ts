export const validatePlzFormat = (val: string): string | null => {
  if (!/^\d*$/.test(val)) {
    return 'Postal code must only contain digits.';
  }
  return null;
};
